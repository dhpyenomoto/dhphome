/*
 * db.js — Supabase REST/Auth への薄いクライアント（外部ライブラリ不要・fetchのみ）
 *
 * 公開ページ: window.DB.fetchProjects() で案件一覧を取得（未設定/失敗時は data.js を使用）
 * 管理画面:   login / logout / upsertProject / deleteProject / upsertMany でCRUD
 *
 * セッション管理:
 *  - access_token は約1時間で失効するため、refresh_token も保存し、
 *    書き込みが 401 になったら自動でリフレッシュして1回だけ再試行します。
 *  - リフレッシュも失敗した場合は自動ログアウトし、"db-session-expired"
 *    イベントを発火（管理画面が再ログインを促します）。
 *  - 読み取り（fetchProjects）は常に anon キーで行うため、
 *    トークン失効の影響を受けません（公開データのため）。
 */
(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const BASE = String(cfg.url || "").replace(/\/+$/, "");
  const ANON = cfg.anonKey || "";
  const TABLE = "projects";
  const TOKEN_KEY = "dhp-sb-token";

  function configured() { return !!(BASE && ANON); }

  // ===== トークン保存（access + refresh をJSONで保持。旧形式=文字列も読める）=====
  function readStore() {
    const raw = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try { const o = JSON.parse(raw); return (o && o.access_token) ? o : null; }
    catch (e) { return { access_token: raw, refresh_token: "" }; } // 旧形式
  }
  function whichStorage() {
    if (localStorage.getItem(TOKEN_KEY)) return localStorage;
    if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
    return null;
  }
  function writeStore(tokens, storage) {
    (storage || sessionStorage).setItem(TOKEN_KEY, JSON.stringify({
      access_token: tokens.access_token || "",
      refresh_token: tokens.refresh_token || ""
    }));
  }
  function clearStore() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  function loggedIn() { const t = readStore(); return !!(t && t.access_token); }

  function anonHeaders(extra) {
    return Object.assign({ "apikey": ANON, "Authorization": "Bearer " + ANON }, extra || {});
  }
  function authHeaders(extra) {
    const t = readStore();
    return Object.assign({
      "apikey": ANON,
      "Authorization": "Bearer " + ((t && t.access_token) || ANON)
    }, extra || {});
  }

  function sessionExpired() {
    clearStore();
    try { window.dispatchEvent(new CustomEvent("db-session-expired")); } catch (e) {}
  }

  // ===== セッションのリフレッシュ（401時に自動実行）=====
  async function refreshSession() {
    const t = readStore();
    if (!t || !t.refresh_token) return false;
    try {
      const res = await fetch(`${BASE}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: { "apikey": ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: t.refresh_token })
      });
      const j = await res.json();
      if (!res.ok || !j.access_token) return false;
      writeStore(j, whichStorage());
      return true;
    } catch (e) { return false; }
  }

  // 認証付きfetch：401なら自動リフレッシュ→1回だけ再試行。それでも401なら自動ログアウト。
  async function authFetch(url, makeOpts) {
    let res = await fetch(url, makeOpts(authHeaders.bind(null)));
    if (res.status === 401) {
      const ok = await refreshSession();
      if (ok) res = await fetch(url, makeOpts(authHeaders.bind(null)));
    }
    if (res.status === 401) {
      sessionExpired();
      throw new Error("セッションの有効期限が切れました。再ログインしてください。");
    }
    return res;
  }

  // ===== 公開ページ用：案件取得（常にanonキー＝トークン失効の影響なし）=====
  async function fetchProjects() {
    if (!configured()) throw new Error("Supabase 未設定");
    const res = await fetch(`${BASE}/rest/v1/${TABLE}?select=data&order=sort_order.asc`, { headers: anonHeaders() });
    if (!res.ok) throw new Error("DB読込失敗: " + res.status);
    const rows = await res.json();
    return rows.map((r) => r.data).filter(Boolean);
  }

  // ===== 認証 =====
  async function login(email, password, remember) {
    if (!configured()) throw new Error("Supabase 未設定");
    const res = await fetch(`${BASE}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "apikey": ANON, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });
    const j = await res.json();
    if (!res.ok || !j.access_token) {
      throw new Error(j.error_description || j.msg || j.error || ("ログイン失敗 " + res.status));
    }
    clearStore();
    writeStore(j, remember ? localStorage : sessionStorage);
    return j;
  }
  function logout() { clearStore(); }

  function rowOf(proj, order) {
    return {
      id: proj.id,
      category: proj.category || "ongoing",
      sort_order: (order == null ? 0 : order),
      data: proj,
      updated_at: new Date().toISOString()
    };
  }

  // ===== 書き込み（要ログイン・401自動リカバリ付き）=====
  async function upsertProject(proj, order) {
    const res = await authFetch(`${BASE}/rest/v1/${TABLE}?on_conflict=id`, (h) => ({
      method: "POST",
      headers: h({ "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(rowOf(proj, order))
    }));
    if (!res.ok) throw new Error("保存失敗: " + res.status + " " + (await res.text()));
  }

  async function upsertMany(projects) {
    const rows = projects.map((p, i) => rowOf(p, i + 1));
    const res = await authFetch(`${BASE}/rest/v1/${TABLE}?on_conflict=id`, (h) => ({
      method: "POST",
      headers: h({ "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(rows)
    }));
    if (!res.ok) throw new Error("一括保存失敗: " + res.status + " " + (await res.text()));
  }

  async function deleteProject(id) {
    const res = await authFetch(`${BASE}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, (h) => ({
      method: "DELETE",
      headers: h({ "Prefer": "return=minimal" })
    }));
    if (!res.ok) throw new Error("削除失敗: " + res.status);
  }

  // ===== Supabase Storage への画像アップロード（要ログイン）=====
  // bucket "images"（公開）に保存し、公開URLを返す。トークン(PAT)不要。
  const BUCKET = "images";
  async function uploadImage(fileOrBlob, path) {
    const enc = path.split("/").map(encodeURIComponent).join("/");
    const res = await authFetch(`${BASE}/storage/v1/object/${BUCKET}/${enc}`, (h) => ({
      method: "POST",
      headers: h({ "Content-Type": (fileOrBlob.type || "image/jpeg"), "x-upsert": "true" }),
      body: fileOrBlob
    }));
    if (!res.ok) {
      const t = await res.text();
      if (res.status === 404) throw new Error("ストレージ未設定: Supabaseで公開バケット 'images' を作成してください（SUPABASE-SETUP.md）");
      throw new Error("画像アップロード失敗: " + res.status + " " + t);
    }
    return `${BASE}/storage/v1/object/public/${BUCKET}/${enc}`;
  }

  window.DB = {
    configured, loggedIn, login, logout,
    fetchProjects, upsertProject, upsertMany, deleteProject,
    uploadImage, refreshSession
  };
})();

/*
 * db.js — Supabase REST/Auth への薄いクライアント（外部ライブラリ不要・fetchのみ）
 *
 * 公開ページ: window.DB.fetchProjects() で案件一覧を取得（未設定/失敗時は data.js を使用）
 * 管理画面:   login / logout / upsertProject / deleteProject / upsertMany でCRUD
 *
 * data 構造: projects テーブルの各行 = { id, sort_order, category, data(jsonb), updated_at }
 *   data には CLAUDE.md と同じ案件オブジェクト（name/location/... gallery/documents）を丸ごと格納。
 */
(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const BASE = String(cfg.url || "").replace(/\/+$/, "");
  const ANON = cfg.anonKey || "";
  const TABLE = "projects";
  const TOKEN_KEY = "dhp-sb-token";

  function configured() { return !!(BASE && ANON); }

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || "";
  }
  function loggedIn() { return !!getToken(); }

  function headers(extra) {
    const tok = getToken();
    return Object.assign({
      "apikey": ANON,
      "Authorization": "Bearer " + (tok || ANON)
    }, extra || {});
  }

  // ===== 公開ページ用：案件取得 =====
  async function fetchProjects() {
    if (!configured()) throw new Error("Supabase 未設定");
    const res = await fetch(`${BASE}/rest/v1/${TABLE}?select=data&order=sort_order.asc`, { headers: headers() });
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
    // remember: localStorage（端末に保持） / それ以外: sessionStorage（タブを閉じると消去）
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, j.access_token);
    return j;
  }
  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  function rowOf(proj, order) {
    return {
      id: proj.id,
      category: proj.category || "ongoing",
      sort_order: (order == null ? 0 : order),
      data: proj,
      updated_at: new Date().toISOString()
    };
  }

  // ===== 書き込み（要ログイン）=====
  async function upsertProject(proj, order) {
    const res = await fetch(`${BASE}/rest/v1/${TABLE}?on_conflict=id`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(rowOf(proj, order))
    });
    if (!res.ok) throw new Error("保存失敗: " + res.status + " " + (await res.text()));
  }

  async function upsertMany(projects) {
    const rows = projects.map((p, i) => rowOf(p, i + 1));
    const res = await fetch(`${BASE}/rest/v1/${TABLE}?on_conflict=id`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(rows)
    });
    if (!res.ok) throw new Error("一括保存失敗: " + res.status + " " + (await res.text()));
  }

  async function deleteProject(id) {
    const res = await fetch(`${BASE}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: headers({ "Prefer": "return=minimal" })
    });
    if (!res.ok) throw new Error("削除失敗: " + res.status);
  }

  window.DB = {
    configured, loggedIn, login, logout,
    fetchProjects, upsertProject, upsertMany, deleteProject
  };
})();

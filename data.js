/*
 * data.js — dhp都市開発 案件データ（唯一の情報源 / single source of truth）
 *
 * このファイルは admin.html から書き出して差し替えできます。
 * 手で編集する場合も CLAUDE.md のデータ構造を厳守してください。
 */
const SITE_DATA = {
  categories: [
    { id: "residential",   ja: "住宅",   en: "Residential" },
    { id: "commercial",    ja: "商業",   en: "Commercial" },
    { id: "hotel",         ja: "ホテル", en: "Hotel" },
    { id: "redevelopment", ja: "再開発", en: "Redevelopment" },
    { id: "land",          ja: "土地",   en: "Land" }
  ],
  projects: [
    {
      id: "p001",
      category: "residential",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      name:     { ja: "中目黒レジデンスタワー",       en: "Nakameguro Residence Tower" },
      location: { ja: "東京都目黒区",                 en: "Meguro-ku, Tokyo" },
      summary:  { ja: "駅徒歩3分の希少立地に建つ32階建ての分譲・賃貸併用タワー。",
                  en: "A 32-story for-sale and rental tower on a rare lot 3 minutes from the station." },
      status:   { ja: "開発中",                       en: "Under development" },
      year:     2026,
      area:     "28,500 m²",
      investment: { ja: "想定総事業費 180億円／IRR 12%目標",
                    en: "Est. total cost ¥18.0B / target IRR 12%" }
    },
    {
      id: "p002",
      category: "commercial",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      name:     { ja: "丸の内グランドオフィス",       en: "Marunouchi Grand Office" },
      location: { ja: "東京都千代田区",               en: "Chiyoda-ku, Tokyo" },
      summary:  { ja: "大手町・丸の内エリアのプライムオフィス。基準階600坪の大型ビル。",
                  en: "Prime office in the Otemachi-Marunouchi district with 600-tsubo floor plates." },
      status:   { ja: "稼働中",                       en: "Operating" },
      year:     2021,
      area:     "64,000 m²",
      investment: { ja: "稼働率98%／NOI利回り3.8%",
                    en: "98% occupancy / 3.8% NOI yield" }
    },
    {
      id: "p003",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      name:     { ja: "京都東山ラグジュアリーホテル", en: "Kyoto Higashiyama Luxury Hotel" },
      location: { ja: "京都府京都市東山区",           en: "Higashiyama-ku, Kyoto" },
      summary:  { ja: "インバウンド需要を取り込む全120室のラグジュアリーホテル開発。",
                  en: "A 120-room luxury hotel development capturing inbound demand." },
      status:   { ja: "計画中",                       en: "In planning" },
      year:     2027,
      area:     "9,800 m²",
      investment: { ja: "想定ADV 65,000円／運営パートナー選定中",
                    en: "Est. ADR ¥65,000 / operator selection underway" }
    },
    {
      id: "p004",
      category: "redevelopment",
      image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1200&q=80",
      name:     { ja: "横浜みなとみらい再開発区画",   en: "Yokohama Minato Mirai Redevelopment" },
      location: { ja: "神奈川県横浜市西区",           en: "Nishi-ku, Yokohama" },
      summary:  { ja: "住・商・オフィスを統合する大規模複合再開発。第一期着工。",
                  en: "Large-scale mixed-use redevelopment of residential, retail and office. Phase 1 underway." },
      status:   { ja: "第一期着工",                   en: "Phase 1 underway" },
      year:     2025,
      area:     "150,000 m²",
      investment: { ja: "総延床15万m²／公民連携スキーム",
                    en: "150,000 m² GFA / public-private partnership scheme" }
    },
    {
      id: "p005",
      category: "land",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      name:     { ja: "福岡天神開発用地",             en: "Fukuoka Tenjin Development Land" },
      location: { ja: "福岡県福岡市中央区",           en: "Chuo-ku, Fukuoka" },
      summary:  { ja: "天神ビッグバン対象エリアの整形地。容積率緩和を活用予定。",
                  en: "A regular-shaped lot in the Tenjin Big Bang zone, leveraging FAR relaxation." },
      status:   { ja: "取得済み",                     en: "Acquired" },
      year:     2024,
      area:     "3,200 m²",
      investment: { ja: "用途地域：商業／指定容積率800%",
                    en: "Zoning: commercial / designated FAR 800%" }
    },
    {
      id: "p006",
      category: "residential",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      name:     { ja: "大阪うめきたガーデンレジデンス", en: "Osaka Umekita Garden Residence" },
      location: { ja: "大阪府大阪市北区",             en: "Kita-ku, Osaka" },
      summary:  { ja: "うめきた2期に隣接する緑豊かな大規模分譲マンション。",
                  en: "A large green condominium development adjacent to Umekita Phase 2." },
      status:   { ja: "販売準備中",                   en: "Pre-sales preparation" },
      year:     2026,
      area:     "41,000 m²",
      investment: { ja: "総戸数420戸／第1期は完売想定",
                    en: "420 units / Phase 1 expected sell-out" }
    }
  ]
};

// ブラウザ・admin の双方から参照できるように公開する
if (typeof window !== "undefined") {
  window.SITE_DATA = SITE_DATA;
}

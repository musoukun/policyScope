import type { Party } from "@/types/party";

// 政党のカラーコード（公式カラーに基づく）
export const PARTY_COLORS: Record<string, string> = {
  ldp: "#C7000B",        // 自民党 - 赤（自民党公式の赤）
  komeito: "#FF69B4",    // 公明党 - ピンク（公明党の伝統的なピンク）
  cdp: "#004EA2",        // 立憲民主党 - 立憲ブルー（公式の青）
  ishin: "#228B22",      // 維新 - 緑（維新グリーン）
  jcp: "#7B68EE",        // 共産党 - 紫（赤を避けて紫を使用）
  dpfp: "#FF8C00",       // 国民民主党 - オレンジ（濃い目のオレンジ）
  reiwa: "#FF1493",      // れいわ - ショッキングピンク（猫の肉球色）
  sanseito: "#FF6600",   // 参政党 - オレンジ（橙色・だいだい色）
  team_mirai: "#90EE90", // チームみらい - パステルグリーン（くすみグリーン）
  saisei: "#8B008B",     // 再生の道 - 紫（右でも左でもない中道を表現）
  hoshuto: "#1E90FF",    // 日本保守党 - 青（保守系政党の伝統的な色）
};

export const PARTIES: Party[] = [
  {
    id: "ldp",
    name: "自由民主党",
    name_en: "Liberal Democratic Party",
    founded_year: 1955,
    description: "日本の保守政党。長期にわたり政権を担当。",
  },
  {
    id: "komeito",
    name: "公明党",
    name_en: "Komeito",
    founded_year: 1964,
    description: "中道政党。自民党と連立政権を組む。",
  },
  {
    id: "cdp",
    name: "立憲民主党",
    name_en: "Constitutional Democratic Party",
    founded_year: 2020,
    description: "中道左派の野党第一党。",
  },
  {
    id: "jcp",
    name: "日本共産党",
    name_en: "Japanese Communist Party",
    founded_year: 1922,
    description: "日本最古の政党の一つ。",
  },
  {
    id: "dpfp",
    name: "国民民主党",
    name_en: "Democratic Party for the People",
    founded_year: 2020,
    description: "中道改革政党。",
  },
  {
    id: "reiwa",
    name: "れいわ新選組",
    name_en: "Reiwa Shinsengumi",
    founded_year: 2019,
    description: "山本太郎が設立した政党。",
  },
  {
    id: "sanseito",
    name: "参政党",
    name_en: "Sanseito",
    founded_year: 2020,
    description: "保守系の新興政党。",
  },
  {
    id: "ishin",
    name: "日本維新の会",
    name_en: "Japan Innovation Party",
    founded_year: 2015,
    description: "改革志向の保守政党。",
  },
  {
    id: "team_mirai",
    name: "チームみらい",
    name_en: "Team Mirai",
    founded_year: 2025,
    description: "AIエンジニアの安野貴博氏が設立したテクノロジー政党。",
  },
  {
    id: "saisei",
    name: "再生の道",
    name_en: "Saisei no Michi",
    founded_year: 2025,
    description: "石丸伸二元安芸高田市長が設立した地域政党。",
  },
  {
    id: "hoshuto",
    name: "日本保守党",
    name_en: "Japan Conservative Party",
    founded_year: 2023,
    description: "百田尚樹・有本香が設立した保守政党。",
  },
];
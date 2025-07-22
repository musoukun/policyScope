import type { Party } from "@/types/party";

// 政党のカラーコード
export const PARTY_COLORS: Record<string, string> = {
  ldp: "#DC143C",        // 自民党 - 赤
  komeito: "#FFD700",    // 公明党 - 金色
  cdp: "#1E90FF",        // 立憲民主党 - 青
  ishin: "#90EE90",      // 維新 - 緑
  jcp: "#FF0000",        // 共産党 - 赤
  dpfp: "#FFA500",       // 国民民主党 - オレンジ
  reiwa: "#FF69B4",      // れいわ - ピンク
  sanseito: "#800080",   // 参政党 - 紫
  team_mirai: "#00CED1", // チームみらい - ターコイズ
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
];
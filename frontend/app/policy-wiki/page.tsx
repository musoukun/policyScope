import { getAllParties } from "@/app/actions/parties";
import { PartySelector } from "./components/PartySelector";
import { PolicyWikiContent } from "./components/PolicyWikiContent";

export default async function PolicyWikiPage() {
  const parties = await getAllParties();

  return (
    <div className="space-y-6">
      {/* 政党選択UI */}
      <PartySelector parties={parties} />
      
      {/* メインコンテンツ */}
      <PolicyWikiContent parties={parties} />
    </div>
  );
}
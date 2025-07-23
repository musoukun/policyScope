import { getAllParties } from "@/app/actions/parties";
import { PartySelector } from "./components/PartySelector";
import { PolicyWikiContent } from "./components/PolicyWikiContent";
import AI_Input_Search from "./components/AI_Input_Search";

export default async function PolicyWikiPage() {
  const parties = await getAllParties();

  return (
    <div className="relative min-h-screen">
      <div className="space-y-6 pb-32">
        {/* 政党選択UI */}
        <PartySelector parties={parties} />
        
        {/* メインコンテンツ */}
        <PolicyWikiContent parties={parties} />
      </div>
      
      {/* AI検索入力を下部に固定配置 */}
      <div className="fixed bottom-4 left-0 right-0 pointer-events-none">
        <div className="pointer-events-auto max-w-xl mx-auto px-4">
          <AI_Input_Search />
        </div>
      </div>
    </div>
  );
}
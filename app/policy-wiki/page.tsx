import { getAllPartiesServer } from "@/lib/server/parties";
import { PartySelector } from "./components/PartySelector";
import { PolicyWikiContent } from "./components/PolicyWikiContent";
import AI_Input_Search from "./components/AI_Input_Search";
import Headline from "@/components/ui/headline";
import Link from "next/link";

export default async function PolicyWikiPage() {
  const parties = await getAllPartiesServer();

  return (
    <div className="relative min-h-screen">
      <div className="space-y-6 pb-32">
        {/* ロゴをタブの直上に配置 */}
        <div className="mb-4">
          <Link href="/policy-wiki" className="inline-block">
            <Headline 
              title="日本の政党DeepWiki"
              subtitle="AI-Powered Political Intelligence"
              className=""
            />
          </Link>
        </div>
        
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
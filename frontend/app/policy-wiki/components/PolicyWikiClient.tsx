"use client";

import type { Party } from "@/types/party";
import { PartyTabs } from "./PartyTabs";
import { PartySummary } from "./PartySummary";
import { PartyNews } from "./PartyNews";
import { ChatInterface } from "./ChatInterface";

interface PolicyWikiClientProps {
  parties: Party[];
}

export function PolicyWikiClient({ parties }: PolicyWikiClientProps) {
  return (
    <div className="relative">
      <PartyTabs parties={parties}>
        {(party) => (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 左側：政党要約（3幅） */}
            <div className="lg:col-span-3">
              <PartySummary party={party} />
            </div>

            {/* 右側：最新ニュース（2幅） */}
            <div className="lg:col-span-2">
              <PartyNews party={party} />
            </div>
          </div>
        )}
      </PartyTabs>

      {/* チャットインターフェース */}
      <ChatInterface />
    </div>
  );
}
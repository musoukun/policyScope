"use client";

import { ChatPage } from "./chat-page";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useChatStore } from "@/lib/stores/chat-store";

function ChatThreadContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const threadId = params.threadId as string;
  const { getChatInitData, removeChatInitData } = useChatStore();
  
  // URLパラメータから取得（後方互換性のため）
  let initialQuery = searchParams.get("q");
  
  // Zustandストアから初期クエリを同期的に取得
  if (!initialQuery) {
    const chatData = getChatInitData(threadId);
    console.log("Zustandストアから取得:", chatData);
    if (chatData) {
      initialQuery = chatData.initialQuery;
      // 使用後は削除
      removeChatInitData(threadId);
    }
  }

  console.log("ChatPageに渡すprops:", { threadId, initialQuery });
  return <ChatPage threadId={threadId} initialQuery={initialQuery} />;
}

export default function ChatThreadPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">読み込み中...</div>}>
      <ChatThreadContent />
    </Suspense>
  );
}
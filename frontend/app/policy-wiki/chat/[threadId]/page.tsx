"use client";

import { ChatPage } from "./chat-page";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

function ChatThreadContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const threadId = params.threadId as string;
  const initialQuery = searchParams.get("q");

  return <ChatPage threadId={threadId} initialQuery={initialQuery} />;
}

export default function ChatThreadPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">読み込み中...</div>}>
      <ChatThreadContent />
    </Suspense>
  );
}
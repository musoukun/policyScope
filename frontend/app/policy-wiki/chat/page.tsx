"use client";

import { Assistant } from "@/app/assistant";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  return <Assistant initialQuery={initialQuery} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">読み込み中...</div>}>
      <ChatContent />
    </Suspense>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    AssistantRuntimeProvider,
    ChatModelAdapter,
    ChatModelRunOptions,
    useLocalRuntime,
} from "@assistant-ui/react";
import {
    AssistantMessageAccumulator,
    DataStreamDecoder,
} from "assistant-stream";
import { Thread } from "@/components/assistant-ui/auto-send-thread";
import { useState, useEffect } from "react";
import AI_Input_Search from "@/app/policy-wiki/components/AI_Input_Search";

interface AssistantProps {
    threadId?: string;
    initialQuery?: string | null;
}

export const Assistant = ({ threadId, initialQuery }: AssistantProps) => {
    const [currentThreadId] = useState<string | null>(threadId || null);
    // 初期クエリを一度だけ保持
    const [initialQueryState] = useState<string | null>(initialQuery || null);

    const MyCustomAdapter: ChatModelAdapter = {
        async *run({ messages, abortSignal }: ChatModelRunOptions) {
            console.log("🔥 ChatModelAdapter.run 開始");
            
            const messageToSend = messages[messages.length - 1];
            if (!messageToSend) return;

            // シンプルなメッセージ形式に変換
            const messageContent = typeof messageToSend.content === "string" 
                ? messageToSend.content 
                : messageToSend.content?.map((c: any) => c.text || "").join(" ") || "";

            try {
                // partyAssistantエージェントに送信
                const response = await fetch(`http://localhost:4111/api/agents/partyAssistant/stream`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: messageContent }],
                        threadId: currentThreadId,
                        resourceId: "partyAssistant",
                    }),
                    signal: abortSignal,
                });

                if (!response.ok) {
                    throw new Error(`Status ${response.status}: ${await response.text()}`);
                }

                if (!response.body) {
                    throw new Error("Response body is null");
                }

                const stream = response.body
                    .pipeThrough(new DataStreamDecoder())
                    .pipeThrough(new AssistantMessageAccumulator());

                const reader = stream.getReader();

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        yield {
                            content: value.content || [],
                            status: value.status || { type: "running" },
                            metadata: value.metadata || {},
                        };
                    }

                    yield {
                        content: [],
                        status: { type: "complete" },
                    };
                } finally {
                    reader.releaseLock();
                }
            } catch (error: any) {
                console.error("Stream error:", error);
                yield {
                    content: [
                        {
                            type: "text",
                            text: `エラーが発生しました: ${error.message}`,
                        },
                    ],
                    status: { type: "error", error: error.message },
                };
            }
        },
    };

    const runtime = useLocalRuntime(MyCustomAdapter);

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <div className="relative min-h-screen bg-background">
                <div className="pb-32">
                    {/* チャットエリア */}
                    <Thread initialQuery={initialQueryState} />
                </div>
                
                {/* AI検索入力を下部に固定配置（Wikiページと同じ） */}
                <div className="fixed bottom-4 left-0 right-0 pointer-events-none">
                    <div className="pointer-events-auto max-w-xl mx-auto px-4">
                        <AI_Input_Search />
                    </div>
                </div>
            </div>
        </AssistantRuntimeProvider>
    );
};
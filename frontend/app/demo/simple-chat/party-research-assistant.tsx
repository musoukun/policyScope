/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AssistantRuntimeProvider,
  ChatModelAdapter,
  ChatModelRunOptions,
  useLocalRuntime,
  Thread as ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
} from "@assistant-ui/react";
import {
  AssistantMessageAccumulator,
  DataStreamDecoder,
} from "assistant-stream";
import { FC, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";

interface PartyResearchAssistantProps {
  onArtifactReceived?: (code: string) => void;
}

export const PartyResearchAssistant: FC<PartyResearchAssistantProps> = ({
  onArtifactReceived,
}) => {
  const [currentParty, setCurrentParty] = useState<string>("");

  const MyCustomAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal }: ChatModelRunOptions) {
      console.log("🔥 PartyResearch ChatModelAdapter.run 開始");

      // 最新のメッセージを取得
      const latestMessage = messages[messages.length - 1];
      if (!latestMessage || !latestMessage.content) {
        console.error("メッセージがありません");
        return;
      }

      // メッセージから政党名を抽出
      let partyName = "";
      if (typeof latestMessage.content === "string") {
        partyName = latestMessage.content;
      } else if (Array.isArray(latestMessage.content)) {
        const textContent = latestMessage.content.find(
          (c) => c.type === "text"
        );
        if (textContent?.text) {
          partyName = textContent.text;
        }
      }

      if (!partyName) {
        console.error("政党名が指定されていません");
        yield {
          content: [{ type: "text", text: "政党名を入力してください。" }],
          status: { type: "complete" },
        };
        return;
      }

      setCurrentParty(partyName);
      console.log(`政党研究を開始: ${partyName}`);

      try {
        const response = await fetch("/api/research-party-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partyName }),
          signal: abortSignal,
        });

        if (!response.ok) {
          throw new Error(
            `Status ${response.status}: ${await response.text()}`
          );
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        // DataStreamDecoderとAssistantMessageAccumulatorを使用
        const stream = response.body
          .pipeThrough(new DataStreamDecoder())
          .pipeThrough(new AssistantMessageAccumulator());

        const reader = stream.getReader();
        let accumulatedText = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            // assistant-ui形式でyield
            yield {
              content: value.content || [],
              status: value.status || { type: "running" },
              metadata: value.metadata || {},
            };

            // Tool呼び出しをチェック（artifacts）
            if (value.content && Array.isArray(value.content)) {
              value.content.forEach((content: any) => {
                if (
                  content.type === "tool-call" &&
                  content.toolName === "artifacts" &&
                  content.args?.code
                ) {
                  console.log("🎨 Artifact detected:", content.args.code);
                  // artifactを親コンポーネントに伝達
                  if (onArtifactReceived) {
                    onArtifactReceived(content.args.code);
                  }
                }
              });
            }
          }

          // 完了
          yield {
            content: [],
            status: { type: "complete" },
          };
        } finally {
          reader.releaseLock();
        }
      } catch (error: any) {
        console.error("ストリームエラー:", error);
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
      <div className="flex flex-col h-full">
        {/* メッセージ表示エリア */}
        <ThreadPrimitive.Root className="flex-1 overflow-hidden">
          <ThreadPrimitive.Viewport className="h-full overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              <ThreadPrimitive.Empty>
                <div className="text-center py-8">
                  <h2 className="text-xl font-bold mb-2">政党研究AI</h2>
                  <p className="text-muted-foreground">
                    調査したい政党名を入力してください
                  </p>
                </div>
              </ThreadPrimitive.Empty>

              <ThreadPrimitive.Messages
                components={{
                  UserMessage: () => (
                    <MessagePrimitive.Root className="flex justify-end mb-4">
                      <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                        <MessagePrimitive.Content />
                      </div>
                    </MessagePrimitive.Root>
                  ),
                  AssistantMessage: () => (
                    <MessagePrimitive.Root className="flex justify-start mb-4">
                      <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                        <MessagePrimitive.Content
                          components={{
                            Text: MarkdownText,
                          }}
                        />
                      </div>
                    </MessagePrimitive.Root>
                  ),
                }}
              />
            </div>
          </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>

        {/* 入力エリア */}
        <div className="border-t p-4">
          <ComposerPrimitive.Root className="flex gap-2">
            <ComposerPrimitive.Input
              placeholder="政党名を入力（例：自由民主党）"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <ComposerPrimitive.Send asChild>
              <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};
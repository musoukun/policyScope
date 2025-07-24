/* eslint-disable react-hooks/exhaustive-deps */
import {
	ThreadPrimitive,
	MessagePrimitive,
	ComposerPrimitive,
	useThreadRuntime,
} from "@assistant-ui/react";
import { FC, useEffect, useRef } from "react";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";

interface ThreadProps {
	initialQuery?: string | null;
}

export const Thread: FC<ThreadProps> = ({ initialQuery }) => {
	const runtime = useThreadRuntime();
	const hasAutoSent = useRef(false);

	// 初期クエリがある場合、マウント時に自動送信
	useEffect(() => {
		if (initialQuery && !hasAutoSent.current && runtime.composer) {
			hasAutoSent.current = true;
			console.log("自動送信実行:", initialQuery);
			// composer経由で送信
			runtime.composer.setText(initialQuery);
			runtime.composer.send();
		}
	}, []);

	return (
		<ThreadPrimitive.Root className="h-full bg-background">
			<ThreadPrimitive.Viewport className="h-full overflow-y-auto">
				<div className="max-w-4xl mx-auto px-4 py-8">
					<ThreadPrimitive.Messages
						components={{
							UserMessage: () => (
								<MessagePrimitive.Root className="mb-4">
									<div className="flex justify-end">
										<div className="bg-muted rounded-3xl px-5 py-2.5 max-w-[80%]">
											<MessagePrimitive.Content />
										</div>
									</div>
								</MessagePrimitive.Root>
							),
							AssistantMessage: () => (
								<MessagePrimitive.Root className="mb-4">
									<div className="flex justify-start">
										<div className="bg-background rounded-lg px-4 py-2 max-w-[80%] prose prose-sm dark:prose-invert">
											<MessagePrimitive.Content
												components={{
													Text: MarkdownText,
												}}
											/>
										</div>
									</div>
								</MessagePrimitive.Root>
							),
						}}
					/>

					{/* 隠しコンポーザー（自動送信用） */}
					<div className="hidden">
						<ComposerPrimitive.Root>
							<ComposerPrimitive.Input />
						</ComposerPrimitive.Root>
					</div>
				</div>
			</ThreadPrimitive.Viewport>
		</ThreadPrimitive.Root>
	);
};

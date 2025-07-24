"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatInterface() {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// チャット機能は未実装（UIのみ）
		console.log("Message:", message);
		setMessage("");
	};

	return (
		<>
			{/* チャット開閉ボタン */}
			<Button
				className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? (
					<X className="h-6 w-6" />
				) : (
					<MessageCircle className="h-6 w-6" />
				)}
			</Button>

			{/* チャットウィンドウ */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="fixed bottom-24 right-6 w-96 h-[500px] bg-background/70 backdrop-blur-md border rounded-lg shadow-xl flex flex-col"
					>
						{/* ヘッダー */}
						<div className="p-4 border-b">
							<h3 className="font-semibold">AI アシスタント</h3>
							<p className="text-sm text-muted-foreground">
								政党について質問してください
							</p>
						</div>

						{/* メッセージエリア */}
						<div className="flex-1 p-4 overflow-y-auto">
							<div className="text-center text-muted-foreground">
								<p className="text-sm">
									チャット機能は近日公開予定です
								</p>
							</div>
						</div>

						{/* 入力エリア */}
						<form onSubmit={handleSubmit} className="p-4 border-t">
							<div className="flex gap-2">
								<Input
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="メッセージを入力..."
									disabled
								/>
								<Button type="submit" size="icon" disabled>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			{/* スクロール用のスペーサー */}
			{isOpen && <div className="h-[600px]" />}
		</>
	);
}

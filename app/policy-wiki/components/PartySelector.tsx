"use client";

import { useQueryState } from "nuqs";
import type { Party } from "@/types/party";
import { PARTY_COLORS } from "@/lib/parties";
import { motion } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PartySelectorProps {
	parties: Party[];
}

export function PartySelector({ parties }: PartySelectorProps) {
	const [selectedParty, setSelectedParty] = useQueryState("party", {
		defaultValue: parties[0]?.id || "ldp",
	});
	const [dimensions, setDimensions] = useState({ width: 0, left: 0 });
	const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
	const containerRef = useRef<HTMLDivElement>(null);

	// 選択されたタブの位置とサイズを更新
	useLayoutEffect(() => {
		const updateDimensions = () => {
			const selectedButton = buttonRefs.current.get(selectedParty || "");
			const container = containerRef.current;

			if (selectedButton && container) {
				const rect = selectedButton.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();

				setDimensions({
					width: rect.width,
					left: rect.left - containerRect.left,
				});
			}
		};

		// 初期更新
		requestAnimationFrame(() => {
			updateDimensions();
		});

		// リサイズ時の更新
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, [selectedParty]);

	return (
		<div 
			ref={containerRef}
			className="relative grid grid-cols-3 md:grid-cols-5 lg:grid-cols-11 gap-2 mb-6"
		>
			{/* スライディング背景 */}
			{selectedParty && (
				<motion.div
					className="absolute rounded-md z-0"
					initial={false}
					animate={{
						width: dimensions.width,
						x: dimensions.left,
						opacity: 1,
					}}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 30,
					}}
					style={{ 
						height: "100%", 
						top: "0",
						backgroundColor: PARTY_COLORS[selectedParty] || "#000",
					}}
				/>
			)}
			
			{/* タブボタン */}
			{parties.map((party) => {
				const isSelected = selectedParty === party.id;
				return (
					<motion.button
						key={party.id}
						ref={(el) => {
							if (el) buttonRefs.current.set(party.id, el);
							else buttonRefs.current.delete(party.id);
						}}
						onClick={() => setSelectedParty(party.id)}
						className={cn(
							"relative z-10 px-4 py-2 text-sm font-medium rounded-md transition-all overflow-hidden",
							"after:absolute after:bottom-1 after:left-2 after:right-2 after:h-0.5",
							"after:scale-x-0 after:transition-transform after:duration-300 after:origin-left",
							"hover:after:scale-x-100",
							"border-2",
							"hover:translate-x-[2px] hover:translate-y-[2px]",
							"active:translate-x-[1px] active:translate-y-[1px]",
							isSelected
								? "text-white after:bg-white/70 border-transparent"
								: "text-foreground hover:bg-muted/50 after:bg-current shadow-[2px_2px_0_0_currentColor] hover:shadow-none"
						)}
						style={{
							borderColor: isSelected ? "transparent" : PARTY_COLORS[party.id],
							color: !isSelected ? PARTY_COLORS[party.id] : undefined,
							boxShadow: !isSelected ? `2px 2px 0 0 ${PARTY_COLORS[party.id]}` : undefined,
						}}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						{party.name}
					</motion.button>
				);
			})}
		</div>
	);
}
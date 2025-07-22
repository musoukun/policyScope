/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import type { Party, PartySummary as PartySummaryType } from "@/types/party";
import { getPartySummary, savePartySummary } from "@/app/actions/parties";
import { researchParty } from "@/lib/mastra-client";

interface PartySummaryProps {
	party: Party;
}

export function PartySummary({ party }: PartySummaryProps) {
	const [summary, setSummary] = useState<PartySummaryType | null>(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				console.log(
					`Loading summary for party: ${party.name} (${party.id})`
				);
				const data = await getPartySummary(party.id);

				if (!data) {
					console.log(
						`No existing summary found for ${party.name}, fetching from AI...`
					);
					// 初回は自動で取得
					await updateSummary();
				} else {
					console.log(`Found existing summary for ${party.name}`);
					setSummary(data);
				}
			} catch (error) {
				console.error("Error loading summary:", error);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [party.id, party.name]);

	const updateSummary = async () => {
		setUpdating(true);
		try {
			console.log(`Researching party: ${party.name} using Mastra Agent...`);
			
			// Mastra Client SDKを使用してAgentを呼び出す
			const data = await researchParty(party.name);
			console.log(`AI response for ${party.name}:`, data);

			// 新しいスキーマ構造に合わせてデータを整形
			const formattedData = {
				comprehensivePartyReport: {
					basicInfo: {
						breakingNews: data.breakingNewsSection,
						basicInformation: data.basicInformation,
					},
					policyAnalysis: data.policyAnalysis,
					supportAnalysis: data.supportBaseAnalysis,
					internationalComparison: data.internationalComparison,
					currentStatus: data.currentStatus,
					evaluation: {
						multifacetedEvaluation: data.multifacetedEvaluation,
						comprehensiveEvaluation: data.comprehensiveAssessment,
					},
					metadata: {
						researchDate: new Date().toISOString().split('T')[0],
						dataSources: data.dataSources,
					},
				},
			};

			console.log(`Saving summary for ${party.name}...`);
			const saved = await savePartySummary(party.id, formattedData);

			if (saved) {
				console.log(`Summary saved successfully for ${party.name}`);
				setSummary(saved);

				// データ完全性の確認
				const savedDataKeys = Object.keys(saved.summary_data);
				console.log(
					`Saved data contains ${savedDataKeys.length} fields:`,
					savedDataKeys
				);
			} else {
				console.error(`Failed to save summary for ${party.name}`);
			}
		} catch (error) {
			console.error("Error updating summary:", error);
			alert(
				`エラーが発生しました: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		} finally {
			setUpdating(false);
		}
	};

	if (loading || updating) {
		return (
			<div className="space-y-8 animate-pulse">
				{/* ヘッダー */}
				<div className="flex justify-between items-start">
					<div>
						<Skeleton className="h-9 w-48 mb-2" />
						<Skeleton className="h-6 w-32" />
					</div>
					<Skeleton className="h-9 w-20" />
				</div>

				{/* 速報セクション */}
				<div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
					<Skeleton className="h-7 w-20 mb-4" />
					<div className="space-y-4">
						<div>
							<Skeleton className="h-5 w-32 mb-2" />
							<div className="bg-white dark:bg-gray-900 p-4 rounded">
								<Skeleton className="h-5 w-40 mb-2" />
								<Skeleton className="h-4 w-32 mb-2" />
								<div className="grid grid-cols-2 gap-2">
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-4 w-28" />
								</div>
							</div>
						</div>
						<div>
							<Skeleton className="h-5 w-32 mb-2" />
							<div className="space-y-1">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-4 w-4/5" />
							</div>
						</div>
					</div>
				</div>

				{/* 基本情報セクション */}
				<div>
					<Skeleton className="h-7 w-24 mb-4" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-4 w-52" />
						</div>
						<div className="bg-muted p-4 rounded-lg">
							<Skeleton className="h-5 w-32 mb-2" />
							<Skeleton className="h-5 w-40 mb-1" />
							<Skeleton className="h-4 w-16 mb-2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-4/5" />
						</div>
					</div>
				</div>

				{/* 政策分析セクション */}
				<div>
					<Skeleton className="h-7 w-24 mb-4" />
					<div className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-6 w-48" />
						<div className="space-y-2">
							{[1, 2, 3].map((i) => (
								<div key={i} className="bg-muted p-3 rounded">
									<Skeleton className="h-5 w-32 mb-1" />
									<Skeleton className="h-4 w-full mb-1" />
									<Skeleton className="h-3 w-24" />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ローディングメッセージ */}
				<div className="text-center text-sm text-muted-foreground mt-8">
					<p className="animate-pulse">
						AIが政党情報を包括的に分析中です...
					</p>
				</div>
			</div>
		);
	}

	if (!summary) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground mb-4">
					まだ情報が取得されていません
				</p>
				<Button onClick={updateSummary} disabled={updating}>
					{updating ? "取得中..." : "情報を取得"}
				</Button>
			</div>
		);
	}

	// 新しいデータ構造をチェック
	if (
		!summary.summary_data ||
		!summary.summary_data.comprehensivePartyReport
	) {
		console.error("Invalid data structure:", summary.summary_data);
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground mb-4">
					データ形式が正しくありません。
				</p>
				<Button onClick={updateSummary} disabled={updating}>
					{updating ? "取得中..." : "再取得"}
				</Button>
			</div>
		);
	}

	const report = summary.summary_data.comprehensivePartyReport as any;

	// 新しいデータ構造への対応
	// 旧構造: breakingSection, basicInfo, overallAssessment
	// 新構造: basicInfo.breakingNews, basicInfo.basicInformation, evaluation.comprehensiveEvaluation
	const hasOldStructure = report && "breakingSection" in report;

	// 基本情報の取得
	let basicInfo: any = {};
	let breakingSection: any = null;
	let overallAssessment: any = null;

	if (hasOldStructure) {
		// 旧構造
		breakingSection = report.breakingSection;
		basicInfo = report.basicInfo || {};
		overallAssessment = report.overallAssessment;
	} else if (report.basicInfo) {
		// 新構造
		const newBasicInfo = report.basicInfo;
		breakingSection = newBasicInfo.breakingNews;

		// basicInformationをbasicInfoにマッピング
		if (newBasicInfo.basicInformation) {
			basicInfo = {
				partyName: newBasicInfo.basicInformation.partyName,
				abbreviation: newBasicInfo.basicInformation.abbreviation,
				foundedDate: newBasicInfo.basicInformation.establishmentDate,
				leader: {
					name: newBasicInfo.basicInformation.partyLeader?.name,
					age: newBasicInfo.basicInformation.partyLeader?.age,
					background:
						newBasicInfo.basicInformation.partyLeader?.background,
					majorAchievements:
						newBasicInfo.basicInformation.partyLeader
							?.majorAchievements,
				},
				foundingBackground:
					newBasicInfo.basicInformation.foundingBackground,
				headquarters:
					newBasicInfo.basicInformation.headquartersLocation,
				memberCount: newBasicInfo.basicInformation.membershipCount,
				parliamentSeats: {
					houseOfRepresentatives:
						newBasicInfo.basicInformation
							.parliamentaryRepresentation?.lowerHouse,
					houseOfCouncillors:
						newBasicInfo.basicInformation
							.parliamentaryRepresentation?.upperHouse,
				},
			};
		}

		// evaluationからoverallAssessmentを取得
		if (report.evaluation?.comprehensiveEvaluation) {
			overallAssessment = {
				overallConclusion:
					report.evaluation.comprehensiveEvaluation.overallAssessment,
			};
		}
	}

	return (
		<div className="space-y-8">
			{/* ヘッダー */}
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-3xl font-bold">
						{basicInfo.partyName || party.name}
					</h2>
					<p className="text-lg text-muted-foreground">
						{basicInfo.abbreviation || ""}
					</p>
				</div>
				<Button
					size="sm"
					variant="outline"
					onClick={updateSummary}
					disabled={updating}
				>
					<RefreshCw
						className={`h-4 w-4 mr-2 ${updating ? "animate-spin" : ""}`}
					/>
					更新
				</Button>
			</div>

			{/* 速報セクション */}
			{breakingSection && (
				<section className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
					<h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">
						速報
					</h3>
					<div className="space-y-4">
						<div>
							<h4 className="font-semibold mb-2">最新選挙結果</h4>
							<div className="bg-white dark:bg-gray-900 p-4 rounded">
								<p className="font-medium">
									{breakingSection.latestElectionResult
										?.electionName || "不明"}
								</p>
								<p className="text-sm text-muted-foreground">
									投開票日:{" "}
									{breakingSection.latestElectionResult
										?.electionDate || "不明"}
								</p>
								<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
									<div>
										獲得議席数:{" "}
										{breakingSection.latestElectionResult
											?.seatsWon || 0}
									</div>
									<div>
										得票率:{" "}
										{breakingSection.latestElectionResult
											?.votePercentage || 0}
										%
									</div>
									<div>
										得票数:{" "}
										{(
											breakingSection.latestElectionResult
												?.votesReceived || 0
										).toLocaleString()}
									</div>
									<div>
										政党要件:{" "}
										{breakingSection.latestElectionResult
											?.partyStatusAchieved
											? "達成"
											: "未達成"}
									</div>
								</div>
								{breakingSection.latestElectionResult
									?.leaderStatement && (
									<p className="mt-2 text-sm italic">
										「
										{
											breakingSection.latestElectionResult
												.leaderStatement
										}
										」
									</p>
								)}
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-2">
								直近の重要動向
							</h4>
							<ul className="list-disc list-inside space-y-1">
								{(
									breakingSection.recentImportantEvents ||
									breakingSection.recentMajorDevelopments ||
									[]
								).map((item: string, index: number) => (
									<li key={index} className="text-sm">
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>
			)}

			{/* 基本情報 */}
			<section>
				<h3 className="text-xl font-semibold mb-4">基本情報</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<p>
							<span className="font-medium">設立年月日:</span>{" "}
							{basicInfo.foundedDate || "不明"}
						</p>
						<p>
							<span className="font-medium">本部所在地:</span>{" "}
							{basicInfo.headquarters || "不明"}
						</p>
						<p>
							<span className="font-medium">党員数:</span>{" "}
							{(basicInfo.memberCount || 0).toLocaleString()}人
						</p>
						<p>
							<span className="font-medium">国会議員数:</span>{" "}
							衆議院{" "}
							{basicInfo.parliamentSeats
								?.houseOfRepresentatives || 0}
							人 / 参議院{" "}
							{basicInfo.parliamentSeats?.houseOfCouncillors || 0}
							人
						</p>
					</div>
					<div className="bg-muted p-4 rounded-lg">
						<h4 className="font-semibold mb-2">党首・代表</h4>
						<p className="font-medium">
							{basicInfo.leader?.name || "不明"}
						</p>
						<p className="text-sm text-muted-foreground">
							{basicInfo.leader?.age || ""}歳
						</p>
						<p className="text-sm mt-2">
							{basicInfo.leader?.background || ""}
						</p>
					</div>
				</div>
				<div className="mt-4">
					<h4 className="font-medium mb-2">設立背景</h4>
					<p className="text-sm text-muted-foreground">
						{basicInfo.foundingBackground || ""}
					</p>
				</div>
			</section>

			{/* 政策分析 */}
			<section>
				<h3 className="text-xl font-semibold mb-4">政策分析</h3>
				<div className="space-y-4">
					<div>
						<h4 className="font-medium">基本理念</h4>
						<p className="text-muted-foreground">
							{report.policyAnalysis?.corePhilosophy ||
								report.policyAnalysis?.coreIdeology ||
								""}
						</p>
					</div>
					<div>
						<h4 className="font-medium">スローガン</h4>
						<p className="text-lg font-semibold text-primary">
							「
							{report.policyAnalysis?.slogan ||
								report.policyAnalysis?.campaignSlogan ||
								""}
							」
						</p>
					</div>
					<div>
						<h4 className="font-medium mb-2">重点政策</h4>
						<div className="space-y-2">
							{(report.policyAnalysis?.priorityPolicies || [])
								.slice(0, 3)
								.map((policy: any, index: number) => (
									<div
										key={index}
										className="bg-muted p-3 rounded"
									>
										<p className="font-medium">
											{policy.policyName}
										</p>
										<p className="text-sm mt-1">
											{policy.overview}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											実現可能性:{" "}
											{"★".repeat(
												policy.feasibilityScore ||
													policy.feasibilityAssessment ||
													3
											)}
											☆
											{"☆".repeat(
												5 -
													(policy.feasibilityScore ||
														policy.feasibilityAssessment ||
														3)
											)}
										</p>
									</div>
								))}
						</div>
					</div>
				</div>
			</section>

			{/* 支持基盤分析 */}
			<section>
				<h3 className="text-xl font-semibold mb-4">支持基盤分析</h3>
				<div className="space-y-4">
					<div>
						<h4 className="font-medium mb-2">支持率推移</h4>
						<div className="space-y-1">
							{(
								report.supportBaseAnalysis?.supportRateTrend ||
								report.supportAnalysis?.approvalRatingTrends ||
								[]
							)
								.slice(0, 3)
								.map((data: any, index: number) => (
									<div
										key={index}
										className="flex justify-between text-sm"
									>
										<span>{data.surveyDate}</span>
										<span className="font-medium">
											{data.supportRate ||
												data.approvalRating}
											%
										</span>
										<span className="text-muted-foreground">
											(
											{data.surveyOrganization ||
												data.pollingOrganization}
											)
										</span>
									</div>
								))}
						</div>
					</div>
					<div>
						<h4 className="font-medium mb-2">支持層の特徴</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
							<div>
								<p className="font-medium mb-1">年齢層</p>
								<div className="space-y-1">
									<div>
										20代以下:{" "}
										{report.supportBaseAnalysis
											?.supporterCharacteristics
											?.ageGroups?.under30 ||
											report.supportAnalysis
												?.supporterDemographics
												?.ageGroups?.under30 ||
											0}
										%
									</div>
									<div>
										30-40代:{" "}
										{report.supportBaseAnalysis
											?.supporterCharacteristics
											?.ageGroups?.thirtiesToForties ||
											report.supportAnalysis
												?.supporterDemographics
												?.ageGroups
												?.thirtiesToForties ||
											0}
										%
									</div>
									<div>
										50-60代:{" "}
										{report.supportBaseAnalysis
											?.supporterCharacteristics
											?.ageGroups?.fiftiesToSixties ||
											report.supportAnalysis
												?.supporterDemographics
												?.ageGroups?.fiftiesToSixties ||
											0}
										%
									</div>
									<div>
										70代以上:{" "}
										{report.supportBaseAnalysis
											?.supporterCharacteristics
											?.ageGroups?.over70 ||
											report.supportAnalysis
												?.supporterDemographics
												?.ageGroups?.seventyAndAbove ||
											0}
										%
									</div>
								</div>
							</div>
							<div>
								<p className="font-medium mb-1">地域別</p>
								<div className="space-y-1">
									<div>
										都市部:{" "}
										{report.supportBaseAnalysis
											?.supporterCharacteristics?.region
											?.urban ||
											report.supportAnalysis
												?.supporterDemographics
												?.regionalDistribution
												?.urbanAreas ||
											0}
										%
									</div>
									<div>
										地方:{" "}
										{report.supportBaseAnalysis
											?.supporterCharacteristics?.region
											?.rural ||
											report.supportAnalysis
												?.supporterDemographics
												?.regionalDistribution
												?.ruralAreas ||
											0}
										%
									</div>
								</div>
							</div>
							<div>
								<p className="font-medium mb-1">支持理由</p>
								<ul className="list-disc list-inside">
									{(
										report.supportBaseAnalysis
											?.supporterCharacteristics
											?.reasonsForSupport ||
										report.supportAnalysis
											?.supporterDemographics
											?.supportReasons ||
										[]
									)
										.slice(0, 3)
										.map(
											(reason: string, index: number) => (
												<li key={index}>{reason}</li>
											)
										)}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 総合評価 */}
			{overallAssessment && (
				<section>
					<h3 className="text-xl font-semibold mb-4">総合評価</h3>
					<div className="bg-muted p-4 rounded-lg">
						<p className="text-sm">
							{overallAssessment.overallConclusion ||
								overallAssessment.overallAssessment ||
								""}
						</p>
					</div>
				</section>
			)}

			{/* メタデータ */}
			<div className="text-xs text-muted-foreground text-right">
				調査実施日: {report.metadata?.researchDate || "不明"}
			</div>
		</div>
	);
}

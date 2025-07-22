import { notFound } from "next/navigation";
import {
	ChevronLeft,
	ExternalLink,
	Users,
	Calendar,
	MapPin,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartyResearchButton } from "../components/PartyResearchButton";

interface PageProps {
	params: {
		party: string;
	};
}

export default function PartyPage({ params }: PageProps) {
	const party = parties.find((p: { id: string }) => p.id === params.party);

	if (!party) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="mb-6">
					<Link href="/policy-wiki">
						<Button variant="ghost" size="sm">
							<ChevronLeft className="h-4 w-4 mr-1" />
							政党一覧に戻る
						</Button>
					</Link>
				</div>

				<div className="mb-8">
					<div className="flex items-center gap-4 mb-4">
						<div
							className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
							style={{ backgroundColor: party.color }}
						>
							{party.name.charAt(0)}
						</div>
						<div>
							<h1 className="text-4xl font-bold text-gray-900">
								{party.name}
							</h1>
							<p className="text-lg text-gray-600">
								{party.name_en}
							</p>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 mb-6">
						<Badge
							variant="secondary"
							className="flex items-center gap-1"
						>
							<Calendar className="h-3 w-3" />
							設立: {party.founded_year}年
						</Badge>
						{party.seats && (
							<Badge
								variant="secondary"
								className="flex items-center gap-1"
							>
								<Users className="h-3 w-3" />
								議席数: {party.seats}
							</Badge>
						)}
						{party.headquarters && (
							<Badge
								variant="secondary"
								className="flex items-center gap-1"
							>
								<MapPin className="h-3 w-3" />
								{party.headquarters}
							</Badge>
						)}
					</div>

					{/* AI包括調査ボタン */}
					<div className="mb-6">
						<PartyResearchButton
							partyName={party.id}
							partyNameJa={party.name}
						/>
					</div>
				</div>

				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">概要</TabsTrigger>
						<TabsTrigger value="policies">主要政策</TabsTrigger>
						<TabsTrigger value="history">歴史</TabsTrigger>
						<TabsTrigger value="organization">組織</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>党の概要</CardTitle>
								<CardDescription>
									基本理念と特徴
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-gray-700 leading-relaxed">
									{party.description}
								</p>
							</CardContent>
						</Card>

						{party.ideology && (
							<Card>
								<CardHeader>
									<CardTitle>政治的立場</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2">
										{party.ideology.map((item, index) => (
											<Badge
												key={index}
												variant="outline"
											>
												{item}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="policies" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>主要政策</CardTitle>
								<CardDescription>
									党の重点政策分野
								</CardDescription>
							</CardHeader>
							<CardContent>
								{party.key_policies ? (
									<ul className="space-y-3">
										{party.key_policies.map(
											(policy, index) => (
												<li
													key={index}
													className="flex items-start"
												>
													<span className="text-primary mr-2">
														•
													</span>
													<span className="text-gray-700">
														{policy}
													</span>
												</li>
											)
										)}
									</ul>
								) : (
									<p className="text-gray-500">
										政策情報は準備中です。
									</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="history" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>党の歴史</CardTitle>
								<CardDescription>
									設立から現在まで
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-gray-500">
									歴史情報は準備中です。
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="organization" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>組織構造</CardTitle>
								<CardDescription>党の組織体制</CardDescription>
							</CardHeader>
							<CardContent>
								{party.leader && (
									<div className="mb-6">
										<h3 className="text-lg font-semibold mb-2">
											党首・代表
										</h3>
										<p className="text-gray-700">
											{party.leader}
										</p>
									</div>
								)}
								<p className="text-gray-500">
									詳細な組織情報は準備中です。
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{party.website && (
					<div className="mt-8 text-center">
						<a
							href={party.website}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-primary hover:underline"
						>
							公式ウェブサイト
							<ExternalLink className="h-4 w-4" />
						</a>
					</div>
				)}
			</div>
		</div>
	);
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { researchParty, type PartyResearchResult } from "@/lib/mastra-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PartyResearchButtonProps {
  partyName: string;
  partyNameJa: string;
}

export function PartyResearchButton({ partyName, partyNameJa }: PartyResearchButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [researchData, setResearchData] = useState<PartyResearchResult | null>(null);

  const handleResearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await researchParty(partyNameJa);
      setResearchData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "調査中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleResearch}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            調査中...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            AI包括調査を実行
          </>
        )}
      </Button>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {researchData && (
        <Card>
          <CardHeader>
            <CardTitle>{researchData.basicInformation.partyName}</CardTitle>
            <CardDescription>
              AI による包括的調査レポート（Google Grounding 使用）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="breaking" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="breaking">速報</TabsTrigger>
                <TabsTrigger value="basic">基本情報</TabsTrigger>
                <TabsTrigger value="policy">政策</TabsTrigger>
                <TabsTrigger value="support">支持基盤</TabsTrigger>
              </TabsList>
              
              <TabsContent value="breaking" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">最新選挙結果</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>選挙名:</span>
                      <span>{researchData.breakingNewsSection.latestElectionResults.electionName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>獲得議席:</span>
                      <span className="font-bold">{researchData.breakingNewsSection.latestElectionResults.seatsWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>得票率:</span>
                      <span>{researchData.breakingNewsSection.latestElectionResults.voteShare}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">最新動向</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {researchData.breakingNewsSection.recentImportantDevelopments.map((dev, idx) => (
                      <li key={idx}>{dev}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">設立:</span>
                    <p className="font-medium">{researchData.basicInformation.foundingDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">党員数:</span>
                    <p className="font-medium">{researchData.basicInformation.membershipCount.toLocaleString()}人</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">衆議院:</span>
                    <p className="font-medium">{researchData.basicInformation.parliamentMembers.houseOfRepresentatives}議席</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">参議院:</span>
                    <p className="font-medium">{researchData.basicInformation.parliamentMembers.houseOfCouncillors}議席</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">党首</h3>
                  <p className="font-medium">{researchData.basicInformation.partyLeader.name}</p>
                  <p className="text-sm text-muted-foreground">{researchData.basicInformation.partyLeader.background}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="policy" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">基本理念</h3>
                  <p className="text-sm">{researchData.policyAnalysis.corePhilosophy}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">重点政策</h3>
                  <div className="space-y-3">
                    {researchData.policyAnalysis.priorityPolicies.map((policy, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{policy.policyName}</h4>
                          <Badge variant="outline">
                            実現可能性: {policy.feasibilityScore}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{policy.overview}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>予算規模: {policy.budgetScale}</span>
                          <span className="ml-4">実施時期: {policy.implementationPeriod}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="support" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">第三者評価</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">{researchData.policyAnalysis.thirdPartyEvaluation.evaluatingOrganization}</span>
                    <Badge>{researchData.policyAnalysis.thirdPartyEvaluation.score}/100</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {researchData.policyAnalysis.thirdPartyEvaluation.evaluationComment}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
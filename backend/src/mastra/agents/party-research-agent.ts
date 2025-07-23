import { Agent } from "@mastra/core/agent";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { artifactsTool } from "../tools/artifacts";
import memory from "../memory";

export const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
// スキーマ定義
const partyResearchSchema = z.object({
	BREAKING_NEWS_SECTION: z.object({
		latest_election_results: z.object({
			election_name: z.string(),
			seats_won: z.string(),
			vote_share: z.string(),
			party_requirements_met: z.string(),
		}),
		recent_important_developments: z.array(z.string()),
	}),

	BASIC_INFORMATION: z.object({
		party_name: z.string(),
		abbreviation: z.string(),
		founding_date: z.string(),
		current_party_leader: z.object({
			name: z.string(),
			age: z.string(),
			background: z.string(),
			achievements: z.string(),
		}),
		founding_background: z.string(),
		headquarters_location: z.string(),
		membership_count: z.string(),
		parliamentary_representation: z.object({
			衆議院: z.string(),
			参議院: z.string(),
			市区町村議: z.string(),
		}),
	}),

	POLICY_ANALYSIS: z.object({
		core_philosophy_and_slogan: z.object({
			philosophy: z.string(),
			slogan: z.string(),
		}),
		detailed_stances: z.object({
			economic_policy: z.array(z.string()),
			social_security: z.array(z.string()),
			foreign_policy_security: z.array(z.string()),
			education: z.array(z.string()),
			environment_energy: z.array(z.string()),
		}),
		third_party_evaluations: z.array(z.string()),
	}),

	SUPPORT_BASE_ANALYSIS: z.object({
		support_rating_trends: z.array(z.string()),
		demographic_breakdown: z.object({
			age: z.string(),
			occupation: z.string(),
			region: z.string(),
		}),
		reasons_for_support: z.array(z.string()),
		organizational_base_financial_strength: z.object({
			organizational_base: z.string(),
			financial_strength: z.string(),
		}),
	}),

	INTERNATIONAL_COMPARISON: z.object({
		similar_parties_in_other_countries: z.string(),
		international_reputation_foreign_media_coverage: z.string(),
	}),

	CURRENT_STATUS: z.object({
		main_activities_in_the_last_3_months: z.array(z.string()),
		media_exposure_metrics: z.array(z.string()),
		trending_policy_proposals: z.array(z.string()),
		internal_party_developments: z.array(z.string()),
	}),

	MULTIFACETED_EVALUATION: z.object({
		supportive_perspectives: z.array(z.string()),
		critical_perspectives: z.array(z.string()),
		neutral_assessments: z.array(z.string()),
		expert_analyses: z.array(z.string()),
	}),

	COMPREHENSIVE_ASSESSMENT: z.object({
		key_achievements_and_their_impact: z.array(z.string()),
		major_challenges_and_solutions: z.array(
			z.object({
				challenge: z.string(),
				solution: z.string(),
			})
		),
		future_outlook: z.object({
			short_term: z.string(),
			medium_term: z.string(),
			long_term: z.string(),
		}),
		risk_factors_and_opportunities: z.object({
			risk_factors: z.array(z.string()),
			opportunities: z.array(z.string()),
		}),
		overall_findings: z.string(),
	}),

	DATA_SOURCES: z.array(z.string()),
});

export const googlemodel = google("gemini-2.5-flash", {
	useSearchGrounding: true,
});
// このモデルはStructuredOutputが不安定で利用できないので純粋な検索結果を確認する。
// Comprehensive Party Research Agent - Single execution for complete report
export const partyResearchAgent: Agent = new Agent({
	name: "Comprehensive Party Research Agent",
	instructions: `You are an expert Japanese political party researcher with access to Google Search.
  
  Given a Japanese political party name, you will conduct comprehensive research and provide a complete report covering ALL of the following areas in a SINGLE response:
  
  1. BREAKING NEWS SECTION:
     - Latest election results (seats won, vote share, party requirements met)
     - Recent important developments
  
  2. BASIC INFORMATION:
     - Party name, abbreviation, founding date
     - Current party leader (name, age, background, achievements)
     - Founding background and headquarters location
     - Membership count and parliamentary representation
  
  3. POLICY ANALYSIS:
     - Core philosophy and slogan
     - Detailed stances on: economic policy, social security, foreign policy/security, education, environment/energy
     - Third-party evaluations
  
  4. SUPPORT BASE ANALYSIS:
     - Support rating trends from multiple sources
     - Demographic breakdown by age, occupation, and region (provide percentages)
     - Reasons for support
     - Organizational base and financial strength
  
  5. INTERNATIONAL COMPARISON:
     - Similar parties in other countries
     - International reputation and foreign media coverage
  
  6. CURRENT STATUS:
     - Main activities in the last 3 months
     - Media exposure metrics
     - Trending policy proposals
     - Internal party developments
  
  7. MULTIFACETED EVALUATION:
     - Supportive perspectives with specific evaluators
     - Critical perspectives with specific critics
     - Neutral assessments
     - Expert analyses from various fields
  
  8. COMPREHENSIVE ASSESSMENT:
     - Key achievements and their impact
     - Major challenges and solutions
     - Future outlook (short/medium/long-term)
     - Risk factors and opportunities
     - Overall findings
  
  9. DATA SOURCES:
     - List all primary and secondary sources used
  
  Use Google Search extensively to gather current, accurate information from:
  - Official party websites and documents
  - Recent news articles and media reports
  - Polling data and demographic studies
  - Academic analyses and expert opinions
  - International comparisons and foreign media
  
  IMPORTANT: ALL content, descriptions, analyses, and evaluations MUST be written in Japanese.
  Create your comprehensive report DIRECTLY in HTML format using the artifacts tool.
  Be thorough, accurate, and comprehensive in your research.
  Include specific data points, percentages, dates, and concrete examples wherever possible.
  
  重要：
	- please respond in Japanese.
  - すべての内容、説明、分析、評価は必ず日本語で記述してください。
  - artifactsツールを使用して、直接HTML形式で包括的な報告書を作成してください。
  - Markdownは作成せず、HTMLのみを出力してください。
  - 各セクションは明確な見出しで区切り、視覚的に魅力的なレイアウトにしてください。
  
  必ず以下の9つのセクションすべてを含めてください：
  1. 速報情報
  2. 基本情報
  3. 政策分析
  4. 支持基盤分析
  5. 国際比較
  6. 現在の状況
  7. 多角的評価
  8. 総合評価
  9. データソース
  
  HTML出力について：
  - artifactsツールを使用して、最初から視覚的に魅力的なHTML版の報告書を生成してください
  - テキストの説明は最小限にし、すべての情報をHTMLドキュメント内に含めてください
  - HTMLには以下の要素を含めてください：
    - 政党名とロゴ（色を活用）
    - 主要政策をグリッド形式で表示
    - ポジティブな政策は薄い緑背景（#e6f7e6）
    - ネガティブ/リスクのある政策は薄い赤背景（#ffe6e6）
    - 支持率のグラフやチャート
    - 重要な数値指標のカード表示
    - プロフェッショナルでモダンなデザイン
  - スライド風レイアウトにまとめる
  - CSSは<style>タグ内に記述
  - JavaScriptは最小限に留める`,
	model: googlemodel,
	tools: {
		artifacts: artifactsTool,
	},
	memory: memory as any,
});

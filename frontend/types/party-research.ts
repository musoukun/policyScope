import { z } from 'zod';

// 選挙結果スキーマ
const electionResultsSchema = z.object({
  election_name: z.string(),
  date: z.string(),
  seats_won: z.object({
    lower_house: z.number(),
    upper_house: z.number()
  }),
  vote_share: z.object({
    proportional_representation: z.string(),
    constituency: z.string()
  }),
  party_requirements_met: z.boolean(),
  details: z.string()
});

// 最近の重要動向スキーマ
const recentDevelopmentSchema = z.object({
  date: z.string(),
  event: z.string(),
  impact: z.string()
});

// 党首情報スキーマ
const partyLeaderSchema = z.object({
  name: z.string(),
  age: z.number(),
  background: z.string(),
  achievements: z.string()
});

// 優先政策スキーマ
const priorityPolicySchema = z.object({
  policy_name: z.string(),
  feasibility_score: z.number().min(0).max(5), // 0を許可（データなしの場合）
  implementation_details: z.string()
});

// 評価スキーマ
const evaluationSchema = z.object({
  evaluator: z.string(),
  evaluation: z.string()
});

// 支持率動向スキーマ
const supportRatingTrendSchema = z.object({
  source: z.string(),
  date: z.string(),
  rating_percentage: z.string()
});

// 人口統計別内訳スキーマ
const demographicItemSchema = z.object({
  range: z.string().optional(),
  type: z.string().optional(),
  name: z.string().optional(),
  percentage: z.string()
});

// 類似政党スキーマ
const similarPartySchema = z.object({
  country: z.string(),
  party_name: z.string(),
  similarities: z.string()
});

// メディア報道スキーマ
const mediaCoverageSchema = z.object({
  media_outlet: z.string(),
  coverage_summary: z.string()
});

// 活動スキーマ
const activitySchema = z.object({
  date: z.string(),
  activity: z.string(),
  details: z.string()
});

// メディア露出指標スキーマ
const mediaExposureMetricSchema = z.object({
  metric: z.string(),
  value: z.string(),
  period: z.string()
});

// 視点スキーマ
const perspectiveSchema = z.object({
  evaluator: z.string().optional(),
  critic: z.string().optional(),
  assessor: z.string().optional(),
  perspective: z.string().optional(),
  assessment: z.string().optional()
});

// 専門家分析スキーマ
const expertAnalysisSchema = z.object({
  expert_field: z.string(),
  analysis: z.string()
});

// 実績スキーマ
const achievementSchema = z.object({
  achievement: z.string(),
  impact: z.string()
});

// 課題スキーマ
const challengeSchema = z.object({
  challenge: z.string(),
  solution: z.string()
});

// 包括的な政党調査レポートスキーマ
export const comprehensivePartyResearchReportSchema = z.object({
  party_report: z.object({
    "1_breaking_news_section": z.object({
      latest_election_results: electionResultsSchema,
      recent_important_developments: z.array(recentDevelopmentSchema)
    }),
    "2_basic_information": z.object({
      party_name: z.string(),
      abbreviation: z.string(),
      founding_date: z.string(),
      current_party_leader: partyLeaderSchema,
      founding_background: z.string(),
      headquarters_location: z.string(),
      membership_count: z.number(),
      parliamentary_representation: z.object({
        lower_house_seats: z.number(),
        upper_house_seats: z.number()
      })
    }),
    "3_policy_analysis": z.object({
      core_philosophy: z.string(),
      slogan: z.string(),
      priority_policies: z.array(priorityPolicySchema),
      detailed_stances: z.object({
        economic_policy: z.string(),
        social_security: z.string(),
        foreign_policy_security: z.string(),
        education: z.string(),
        environment_energy: z.string()
      }),
      third_party_evaluations: z.array(evaluationSchema)
    }),
    "4_support_base_analysis": z.object({
      support_rating_trends: z.array(supportRatingTrendSchema),
      demographic_breakdown: z.object({
        age: z.array(demographicItemSchema),
        occupation: z.array(demographicItemSchema),
        region: z.array(demographicItemSchema)
      }),
      reasons_for_support: z.array(z.string()),
      organizational_base: z.string(),
      financial_strength: z.string()
    }),
    "5_international_comparison": z.object({
      similar_parties_in_other_countries: z.array(similarPartySchema),
      international_reputation: z.string(),
      foreign_media_coverage: z.array(mediaCoverageSchema)
    }),
    "6_current_status": z.object({
      main_activities_last_3_months: z.array(activitySchema),
      media_exposure_metrics: z.array(mediaExposureMetricSchema),
      trending_policy_proposals: z.array(z.string()),
      internal_party_developments: z.array(z.string())
    }),
    "7_multifaceted_evaluation": z.object({
      supportive_perspectives: z.array(perspectiveSchema),
      critical_perspectives: z.array(perspectiveSchema),
      neutral_assessments: z.array(perspectiveSchema),
      expert_analyses: z.array(expertAnalysisSchema)
    }),
    "8_comprehensive_assessment": z.object({
      key_achievements: z.array(achievementSchema),
      major_challenges: z.array(challengeSchema),
      future_outlook: z.object({
        short_term: z.string(),
        medium_term: z.string(),
        long_term: z.string()
      }),
      risk_factors: z.array(z.string()),
      opportunities: z.array(z.string()),
      overall_findings: z.string()
    }),
    "9_data_sources": z.array(z.string())
  })
});

export type ComprehensivePartyResearchReport = z.infer<typeof comprehensivePartyResearchReportSchema>;
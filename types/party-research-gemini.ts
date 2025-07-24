// Geminiの実際の出力形式に基づいた型定義

export interface GeminiPartyResearchReport {
  "1. BREAKING NEWS SECTION": {
    "Latest election results": {
      election_name: string;
      seats_won: {
        total: number;
        house_of_representatives: number;
        house_of_councillors_proportional: number;
        house_of_councillors_electoral_districts: number;
      };
      vote_share: {
        proportional_representation: string;
        total_votes_proportional: string;
      };
      party_requirements_met: boolean;
      details: string;
    };
    "Recent important developments": string[];
  };
  "2. BASIC INFORMATION": {
    "Party name": string;
    "Abbreviation": string;
    "Founding date": string;
    "Current party leader": {
      name: string;
      age: string;
      background: string;
      achievements: string;
    };
    "Founding background": string;
    "Headquarters location": string;
    "Membership count": string;
    "Parliamentary representation": {
      house_of_representatives: string;
      house_of_councillors: string;
      local_assemblies: string;
    };
  };
  "3. POLICY ANALYSIS": {
    core_philosophy_and_slogan: {
      slogan: string;
      philosophy: string;
    };
    priority_policies: Array<{
      name: string;
      feasibility_score: number;
      implementation_details: string;
    }>;
    detailed_stances: {
      economic_policy: string;
      social_security: string;
      foreign_policy_security: string;
      education: string;
      environment_energy: string;
    };
    third_party_evaluations: string[];
  };
  "4. SUPPORT BASE ANALYSIS": {
    support_rating_trends: string[];
    demographic_breakdown: {
      age: string;
      occupation: string;
      region: string;
    };
    reasons_for_support: string[];
    organizational_base_and_financial_strength: string;
  };
  "5. INTERNATIONAL COMPARISON": {
    similar_parties_in_other_countries: string[];
    international_reputation_and_foreign_media_coverage: string;
  };
  "6. CURRENT STATUS": {
    main_activities_in_the_last_3_months: string[];
    media_exposure_metrics: string;
    trending_policy_proposals: string[];
    internal_party_developments: string[];
  };
  "7. MULTIFACETED EVALUATION": {
    supportive_perspectives: Array<{
      evaluator: string;
      comment: string;
    }>;
    critical_perspectives: Array<{
      critic: string;
      comment: string;
      source?: string;
    }>;
    neutral_assessments: string[];
    expert_analyses_from_various_fields: Array<{
      expert: string;
      field: string;
      analysis: string;
    }>;
  };
  "8. COMPREHENSIVE ASSESSMENT": {
    key_achievements_and_their_impact: string[];
    major_challenges_and_solutions: {
      challenges: string[];
      solutions: string[];
    };
    future_outlook: {
      short_term: string;
      medium_term: string;
      long_term: string;
    };
    risk_factors_and_opportunities: {
      risk_factors: string[];
      opportunities: string[];
    };
    overall_findings: string;
  };
  "9. DATA SOURCES": string[];
}

// APIレスポンスの型
export interface PartyResearchApiResponse {
  success: boolean;
  data: {
    party_report: GeminiPartyResearchReport;
  };
}
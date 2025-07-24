import { z } from "zod";

// Latest Election Results Schema
export const latestElectionResultsSchema = z.object({
  electionName: z.string().describe("Name of the election"),
  votingDate: z.string().describe("Date of voting"),
  seatsWon: z.number().describe("Number of seats won"),
  votesReceived: z.number().describe("Total votes received"),
  voteShare: z.number().describe("Vote share percentage"),
  partyRequirementsMet: z.boolean().describe("Whether party requirements were met"),
  representativeComment: z.string().describe("Comment from party representative"),
});

// Breaking News Section Schema
export const breakingNewsSectionSchema = z.object({
  latestElectionResults: latestElectionResultsSchema,
  recentImportantDevelopments: z.array(z.string()).describe("Recent important developments"),
});

// Party Leader Schema
export const partyLeaderSchema = z.object({
  name: z.string().describe("Leader's name"),
  age: z.number().describe("Leader's age"),
  background: z.string().describe("Leader's background"),
  majorAchievements: z.array(z.string()).describe("Major achievements"),
});

// Parliament Members Schema
export const parliamentMembersSchema = z.object({
  houseOfRepresentatives: z.number().describe("Number in House of Representatives"),
  houseOfCouncillors: z.number().describe("Number in House of Councillors"),
});

// Basic Information Schema
export const basicInformationSchema = z.object({
  partyName: z.string().describe("Official party name"),
  abbreviation: z.string().describe("Party abbreviation"),
  foundingDate: z.string().describe("Date of founding"),
  partyLeader: partyLeaderSchema,
  foundingBackground: z.string().describe("Background of party founding"),
  headquartersLocation: z.string().describe("Location of headquarters"),
  membershipCount: z.number().describe("Total membership count"),
  parliamentMembers: parliamentMembersSchema,
});

// Priority Policy Schema
export const priorityPolicySchema = z.object({
  policyName: z.string().describe("Name of the policy"),
  overview: z.string().describe("Policy overview"),
  feasibilityScore: z.string().describe("Feasibility score (1-5)"),
  scoreRationale: z.string().describe("Rationale for the score"),
  budgetScale: z.string().describe("Budget scale"),
  implementationPeriod: z.string().describe("Implementation period"),
});

// Policy Category Schema
export const policyCategorySchema = z.object({
  basicStance: z.string().describe("Basic stance on the category"),
  specificMeasures: z.array(z.string()).describe("Specific measures"),
  fundingSources: z.string().optional().describe("Funding sources"),
  targetGroups: z.string().optional().describe("Target groups"),
  internationalRelationsView: z.string().optional().describe("International relations view"),
  budgetAllocation: z.string().optional().describe("Budget allocation"),
  targets: z.string().optional().describe("Targets or goals"),
});

// Third Party Evaluation Schema
export const thirdPartyEvaluationSchema = z.object({
  evaluatingOrganization: z.string().describe("Name of evaluating organization"),
  score: z.number().describe("Evaluation score"),
  evaluationComment: z.string().describe("Evaluation comment"),
  comparisonWithOtherParties: z.string().describe("Comparison with other parties"),
});

// Policy Analysis Schema
export const policyAnalysisSchema = z.object({
  corePhilosophy: z.string().describe("Core philosophy"),
  slogan: z.string().describe("Party slogan"),
  priorityPolicies: z.array(priorityPolicySchema).describe("Priority policies"),
  policyCategoryStances: z.object({
    economicPolicy: policyCategorySchema,
    socialSecurity: policyCategorySchema,
    foreignPolicyAndSecurity: policyCategorySchema,
    education: policyCategorySchema,
    environmentAndEnergy: policyCategorySchema,
  }),
  thirdPartyEvaluation: thirdPartyEvaluationSchema,
});

// Support Rating Trend Schema
export const supportRatingTrendSchema = z.object({
  surveyDate: z.string().describe("Survey date"),
  supportRate: z.number().describe("Support rate percentage"),
  surveyOrganization: z.string().describe("Survey organization"),
});

// Age Groups Schema
export const ageGroupsSchema = z.object({
  under20s: z.number().describe("Percentage under 20s"),
  "30s40s": z.number().describe("Percentage 30s-40s"),
  "50s60s": z.number().describe("Percentage 50s-60s"),
  over70s: z.number().describe("Percentage over 70s"),
});

// Occupation Schema
export const byOccupationSchema = z.object({
  companyEmployee: z.number().describe("Percentage company employees"),
  selfEmployed: z.number().describe("Percentage self-employed"),
  civilServant: z.number().describe("Percentage civil servants"),
  homemaker: z.number().describe("Percentage homemakers"),
  student: z.number().describe("Percentage students"),
  other: z.number().describe("Percentage others"),
});

// Region Schema
export const byRegionSchema = z.object({
  urban: z.number().describe("Percentage urban"),
  rural: z.number().describe("Percentage rural"),
});

// Supporter Characteristics Schema
export const supporterCharacteristicsSchema = z.object({
  ageGroups: ageGroupsSchema,
  byOccupation: byOccupationSchema,
  byRegion: byRegionSchema,
  reasonsForSupport: z.array(z.string()).describe("Reasons for support"),
});

// Organizational Base Schema
export const organizationalBaseSchema = z.object({
  supportingOrganizations: z.array(z.string()).describe("Supporting organizations"),
  affiliatedOrganizations: z.array(z.string()).describe("Affiliated organizations"),
  financialStrength: z.string().describe("Financial strength"),
  localOrganizations: z.string().describe("Local organizations"),
});

// Support Base Analysis Schema
export const supportBaseAnalysisSchema = z.object({
  supportRatingTrends: z.array(supportRatingTrendSchema).describe("Support rating trends"),
  supporterCharacteristics: supporterCharacteristicsSchema,
  organizationalBase: organizationalBaseSchema,
});

// Similar Party Schema
export const similarPartySchema = z.object({
  country: z.string().describe("Country name"),
  partyName: z.string().describe("Party name"),
  commonalities: z.array(z.string()).describe("Commonalities"),
  differences: z.array(z.string()).describe("Differences"),
  successCases: z.string().describe("Success cases"),
  failureCases: z.string().describe("Failure cases"),
});

// International Comparison Schema
export const internationalComparisonSchema = z.object({
  similarParties: z.array(similarPartySchema).describe("Similar parties"),
  internationalReputation: z.string().describe("International reputation"),
  foreignMediaCoverage: z.array(z.string()).describe("Foreign media coverage"),
});

// Main Activity Schema
export const mainActivitySchema = z.object({
  date: z.string().describe("Activity date"),
  activityDetails: z.string().describe("Activity details"),
  outcomes: z.string().describe("Outcomes"),
});

// Media Exposure Schema
export const mediaExposureSchema = z.object({
  television: z.number().describe("Television appearances"),
  newspapers: z.number().describe("Newspaper mentions"),
  internet: z.number().describe("Internet mentions"),
  socialMediaMentions: z.number().describe("Social media mentions"),
});

// Current Status Schema
export const currentStatusSchema = z.object({
  mainActivitiesLast3Months: z.array(mainActivitySchema).describe("Main activities last 3 months"),
  mediaExposure: mediaExposureSchema,
  trendingPolicyProposals: z.array(z.string()).describe("Trending policy proposals"),
  internalPartyDevelopments: z.string().describe("Internal party developments"),
});

// Perspective Schema
export const perspectiveSchema = z.object({
  evaluator: z.string().describe("Evaluator name"),
  title: z.string().describe("Evaluator title"),
  evaluationContent: z.string().optional().describe("Evaluation content"),
  criticism: z.string().optional().describe("Criticism"),
  basis: z.string().optional().describe("Basis for evaluation"),
  specificExamples: z.string().optional().describe("Specific examples"),
});

// Neutral Assessment Schema
export const neutralAssessmentSchema = z.object({
  assessor: z.string().describe("Assessor name"),
  analysis: z.string().describe("Analysis"),
  strengths: z.array(z.string()).describe("Strengths"),
  weaknesses: z.array(z.string()).describe("Weaknesses"),
});

// Expert Analysis Schema
export const expertAnalysisSchema = z.object({
  politicalScientist: z.string().describe("Political scientist analysis"),
  economist: z.string().describe("Economist analysis"),
  sociologist: z.string().describe("Sociologist analysis"),
});

// Multifaceted Evaluation Schema
export const multifacetedEvaluationSchema = z.object({
  supportivePerspectives: z.array(perspectiveSchema).describe("Supportive perspectives"),
  criticalPerspectives: z.array(perspectiveSchema).describe("Critical perspectives"),
  neutralAssessment: z.array(neutralAssessmentSchema).describe("Neutral assessments"),
  expertAnalysis: expertAnalysisSchema,
});

// Achievement Schema
export const achievementSchema = z.object({
  item: z.string().describe("Achievement item"),
  details: z.string().describe("Achievement details"),
  impact: z.enum(["high", "medium", "low"]).describe("Impact level"),
});

// Challenge Schema
export const challengeSchema = z.object({
  challengeName: z.string().describe("Challenge name"),
  details: z.string().describe("Challenge details"),
  urgency: z.enum(["high", "medium", "low"]).describe("Urgency level"),
  proposedSolutions: z.string().describe("Proposed solutions"),
});

// Future Outlook Schema
export const futureOutlookSchema = z.object({
  shortTerm: z.string().describe("Short term outlook (within 1 year)"),
  mediumTerm: z.string().describe("Medium term outlook (within 3 years)"),
  longTerm: z.string().describe("Long term outlook (5+ years)"),
});

// Comprehensive Assessment Schema
export const comprehensiveAssessmentSchema = z.object({
  achievements: z.array(achievementSchema).describe("Achievements"),
  challenges: z.array(challengeSchema).describe("Challenges"),
  futureOutlook: futureOutlookSchema,
  riskFactors: z.array(z.string()).describe("Risk factors"),
  opportunities: z.array(z.string()).describe("Opportunities"),
  overallFindings: z.string().describe("Overall findings"),
});

// Data Source Schema
export const dataSourceSchema = z.object({
  sourceName: z.string().describe("Source name"),
  publisher: z.string().optional().describe("Publisher"),
  author: z.string().optional().describe("Author"),
  publicationDate: z.string().describe("Publication date"),
  url: z.string().optional().describe("URL"),
});

// Data Sources Schema
export const dataSourcesSchema = z.object({
  primarySources: z.array(dataSourceSchema).describe("Primary sources"),
  secondarySources: z.array(dataSourceSchema).describe("Secondary sources"),
});

// Complete Party Research Report Schema
export const comprehensivePartyResearchReportSchema = z.object({
  breakingNewsSection: breakingNewsSectionSchema,
  basicInformation: basicInformationSchema,
  policyAnalysis: policyAnalysisSchema,
  supportBaseAnalysis: supportBaseAnalysisSchema,
  internationalComparison: internationalComparisonSchema,
  currentStatus: currentStatusSchema,
  multifacetedEvaluation: multifacetedEvaluationSchema,
  comprehensiveAssessment: comprehensiveAssessmentSchema,
  dataSources: dataSourcesSchema,
});

// Individual stage schemas for step-by-step research
export const stage1Schema = z.object({
  breakingNewsSection: breakingNewsSectionSchema,
  basicInformation: basicInformationSchema,
});

export const stage2Schema = z.object({
  policyAnalysis: policyAnalysisSchema,
});

export const stage3Schema = z.object({
  supportBaseAnalysis: supportBaseAnalysisSchema,
});

export const stage4Schema = z.object({
  internationalComparison: internationalComparisonSchema,
  currentStatus: currentStatusSchema,
});

export const stage5Schema = z.object({
  multifacetedEvaluation: multifacetedEvaluationSchema,
  comprehensiveAssessment: comprehensiveAssessmentSchema,
  dataSources: dataSourcesSchema,
});
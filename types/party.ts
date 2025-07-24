export interface Party {
	id: string;
	name: string;
	name_en: string;
	founded_year?: number;
	description?: string;
	created_at?: string;
	updated_at?: string;
}

export interface PartyNewsItem {
	title: string;
	summary: string;
	url: string;
}

export interface PartyNews {
	id?: string;
	party_id: string;
	news_data: PartyNewsItem[];
	created_at?: string;
	updated_at?: string;
}

export interface PartySummary {
	id?: string;
	party_id: string;
	summary_data: PartyComprehensiveData;
	html_content?: string;
	created_at?: string;
	updated_at?: string;
}

export interface PartyComprehensiveData {
	comprehensivePartyReport: {
		markdown?: string;
		breakingSection: {
			latestElectionResult: {
				electionName: string;
				electionDate: string;
				seatsWon: number;
				votesReceived: number;
				votePercentage: number;
				partyStatusAchieved: boolean;
				leaderComment: string;
			};
			recentImportantEvents: string[];
		};

		basicInfo: {
			partyName: string;
			abbreviation: string;
			foundedDate: string;
			leader: {
				name: string;
				age: number;
				background: string;
				majorAchievements: string[];
			};
			foundingBackground: string;
			headquarters: string;
			memberCount: number;
			parliamentSeats: {
				houseOfRepresentatives: number;
				houseOfCouncillors: number;
			};
		};

		policyAnalysis: {
			corePhilosophy: string;
			slogan: string;
			priorityPolicies: Array<{
				policyName: string;
				overview: string;
				feasibilityScore: number;
				evaluationBasis: string;
				budgetScale: string;
				implementationPeriod: string;
			}>;
			policiesByCategory: {
				economic: {
					basicPolicy: string;
					specificMeasures: string[];
					fundingSources: string;
				};
				socialSecurity: {
					basicPolicy: string;
					specificMeasures: string[];
					targetBeneficiaries: string;
				};
				foreignPolicyAndSecurity: {
					basicPolicy: string;
					specificMeasures: string[];
					internationalStance: string;
				};
				education: {
					basicPolicy: string;
					specificMeasures: string[];
					budgetAllocation: string;
				};
				environmentAndEnergy: {
					basicPolicy: string;
					specificMeasures: string[];
					targets: string;
				};
			};
			thirdPartyEvaluation: {
				evaluatingOrganization: string;
				score: number;
				comment: string;
				comparisonWithOtherParties: string;
			};
		};

		supportBaseAnalysis: {
			supportRateTrend: Array<{
				surveyDate: string;
				supportRate: number;
				surveyOrganization: string;
			}>;
			supporterCharacteristics: {
				ageGroups: {
					under30: number;
					thirtiesToForties: number;
					fiftiesToSixties: number;
					over70: number;
				};
				occupation: {
					companyEmployee: number;
					selfEmployed: number;
					publicServant: number;
					homemaker: number;
					student: number;
					other: number;
				};
				region: {
					urban: number;
					rural: number;
				};
				reasonsForSupport: string[];
			};
			organizationalBase: {
				supportingOrganizations: string[];
				affiliatedOrganizations: string[];
				financialStrength: string;
				localOrganizations: string;
			};
		};

		internationalComparison: {
			similarParties: Array<{
				country: string;
				partyName: string;
				commonalities: string[];
				differences: string[];
				successStories: string;
				failures: string;
			}>;
			internationalReputation: string;
			foreignMediaCoverage: string[];
		};

		latestDevelopments: {
			recentActivities: Array<{
				date: string;
				activity: string;
				outcome: string;
			}>;
			mediaExposure: {
				television: number;
				newspaper: number;
				internet: number;
				socialMediaMentions: number;
			};
			trendingPolicyProposals: string[];
			internalPartyDynamics: string;
		};

		multiPerspectiveEvaluation: {
			supportivePerspectives: Array<{
				evaluator: string;
				title: string;
				evaluation: string;
				basis: string;
			}>;
			criticalPerspectives: Array<{
				critic: string;
				title: string;
				criticism: string;
				specificExamples: string;
			}>;
			neutralAssessments: Array<{
				assessor: string;
				analysis: string;
				strengths: string[];
				weaknesses: string[];
			}>;
			expertAnalysis: {
				politicalScientist: string;
				economist: string;
				sociologist: string;
			};
		};

		overallAssessment: {
			achievements: Array<{
				item: string;
				details: string;
				impactLevel: "high" | "medium" | "low";
			}>;
			challenges: Array<{
				challengeName: string;
				details: string;
				urgency: "high" | "medium" | "low";
				proposedSolutions: string;
			}>;
			futureOutlook: {
				shortTerm: string;
				mediumTerm: string;
				longTerm: string;
			};
			riskFactors: string[];
			opportunities: string[];
			overallConclusion: string;
		};

		dataSources: {
			primarySources: Array<{
				documentName: string;
				publisher: string;
				publishDate: string;
				url: string;
			}>;
			secondarySources: Array<{
				documentName: string;
				author: string;
				publisher: string;
				publishDate: string;
			}>;
			interviews: Array<{
				interviewee: string;
				interviewDate: string;
				keyStatements: string;
			}>;
		};

		metadata: {
			researchDate: string;
		};
	};
}

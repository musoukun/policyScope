import { Mastra } from "@mastra/core";
import { partyResearchAgent } from "./agents/party-research-agent";
import { htmlArtifactAgent } from "./agents/html-artifact-agent";
import { partyResearchWorkflow } from "./workflows/party-research-workflow";
import { partyAssistant } from "./agents/party-assistant";
import { partyNews } from "./agents/party-news";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Initialize Mastra with the comprehensive research agent and workflow
export const mastra = new Mastra({
	agents: {
		partyResearchAgent: partyResearchAgent,
		htmlArtifactAgent: htmlArtifactAgent,
		partyAssistant: partyAssistant,
		partyNews: partyNews, // Reusing partyAssistant for news queries
	},
	workflows: {
		partyResearchWorkflow: partyResearchWorkflow,
	},
});

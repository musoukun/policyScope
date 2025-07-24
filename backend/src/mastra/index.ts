import { Mastra } from "@mastra/core";
import { partyResearchAgent } from "./agents/party-research-agent";
import { htmlArtifactAgent } from "./agents/html-artifact-agent";
import { partyResearchWorkflow } from "./workflows/party-research-workflow";
import { partyAssistant } from "./agents/party-assistant";
import { partyNews } from "./agents/party-news";

// Initialize Mastra with the comprehensive research agent and workflow
const mastra = new Mastra({
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

// Export both named and default
export { mastra };
export default mastra;

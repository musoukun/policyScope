import { Mastra } from "@mastra/core";
import { partyResearchAgent } from "./agents/party-research-agent";
import { memory } from "./memory";

// Initialize Mastra with the comprehensive research agent and workflow
const mastra = new Mastra({
	agents: {
		partyResearchAgent: partyResearchAgent,
	},
});

// Export both named and default
export { mastra };
export default mastra;

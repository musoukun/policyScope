import { Mastra } from "@mastra/core";
import { partyResearchAgent } from "./agents/party-research-agent";
import { partyResearchWorkflow } from "./workflows/party-research-workflow";

// Initialize Mastra with the comprehensive research agent and workflow
const mastra = new Mastra({
  agents: {
    partyResearchAgent,
  },
  workflows: {
    partyResearchWorkflow,
  },
});

// Export both named and default
export { mastra };
export default mastra;
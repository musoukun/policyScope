# Bug Report: useSearchGrounding Option Not Working in Workflow

## Title
[BUG] useSearchGrounding option not working in Workflow with Google Generative AI

## Describe the Bug
When using Google Generative AI with `useSearchGrounding: true` option inside a Mastra workflow, the search grounding feature does not work as expected. 

- When searching through normal Agent chat, it returns the latest and accurate results
- When searching through workflow, it returns outdated results or mostly reports "no relevant information found"
- The agent seems to have limited or no access to Google Search results when executed within a workflow, even though the option is enabled

## Steps To Reproduce
1. Create a Mastra agent with Google Generative AI model and `useSearchGrounding: true`
2. Create a workflow that uses this agent with `createStep` and `agent.generate()`
3. Execute the workflow with a query that requires current information from Google Search
4. The agent responds without using Google Search data, as if the option was not enabled

### Example code:
```typescript
// Agent configuration
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({});
const googlemodel = google("gemini-2.0-flash-exp", {
    useSearchGrounding: true,
});

const partyResearchAgent = new Agent({
    name: "Party Research Agent",
    model: googlemodel,
    // ... other config
});

// Workflow step
const stage1Step = createStep({
    id: "stage1",
    execute: async ({ inputData }) => {
        const response = await partyResearchAgent.generate(
            [{
                role: "user",
                content: "Search for current information about [topic]"
            }],
            { output: schema }
        );
        return response.object;
    },
});
```

## Expected Behavior
The agent should be able to access and use Google Search results when `useSearchGrounding: true` is set, providing current and accurate information based on search results within the workflow execution.

## Environment Information
- Mastra Version: 0.1.102
- @ai-sdk/google Version: 1.0.11
- Node.js Version: v20.11.0
- OS: Windows 11 (WSL2 - Ubuntu)
- LLM Provider: Google Gemini (gemini-2.0-flash-exp)

## Additional Context
The same configuration works correctly when the agent is used outside of a workflow context. The issue only occurs when the agent is called within a workflow step using `agent.generate()`.

Looking at the Agent class implementation, the `generate` method calls `getLLM()` which should handle the model configuration. However, it seems the `useSearchGrounding` option may not be properly propagated when the agent is executed within a workflow context.

This might be related to how the LLM instance is created or cached within the workflow execution context, potentially losing the search grounding configuration during the process.

### Concrete Example: "Team Mirai" (チームみらい) Search Results

**1. Search results from normal Agent chat:**
- Very detailed and up-to-date information (including winning 1 seat in the July 2025 House of Councillors election)
- Detailed profile of Takahiro Anno (founder)
- Specific policy content
- Support rate data (4.1%)
- Rich data sources (over 30 URLs)

**2. Search results from Workflow:**
- Most items show "No information" or "Not applicable"
- Unable to retrieve even basic information
- States "No major national political party with the name 'Team Mirai' could be confirmed"

This difference suggests that the useSearchGrounding option is not functioning correctly within the Workflow. While the normal Agent chat can access the latest Google search results, the search functionality within the Workflow appears to be restricted or completely non-functional.

This is important evidence supporting the bug report content.

## Verification
- [x] I have searched the existing issues to make sure this is not a duplicate
- [x] I have included sufficient information for the team to reproduce and understand the issue
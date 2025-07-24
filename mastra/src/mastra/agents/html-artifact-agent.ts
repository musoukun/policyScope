import { Agent } from "@mastra/core/agent";
import { artifactsTool } from "../tools/artifacts";
import { google } from ".";

// gemma-3n-e4b-it モデルを使用
const model = google("gemini-2.0-flash");

// HTMLを受け取ってArtifactツールを実行するだけのエージェント
export const htmlArtifactAgent: Agent = new Agent({
	name: "HTML Artifact Agent",
	instructions: `You are a simple HTML display agent. 
  Your only task is to receive HTML content and display it using the artifacts tool.
  
  IMPORTANT:
  - You will receive HTML content as input
  - Use the artifacts tool to display the HTML
  - Do NOT modify the HTML in any way
  - Do NOT add any additional text or explanation
  - Just call the artifacts tool with the provided HTML code`,
	model: model,
	tools: {
		artifactsTool,
	},
});

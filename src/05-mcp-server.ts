import OpenAI from "openai";
import dotenv from "dotenv";
import * as readline from "readline";

// Load environment variables
dotenv.config();

// prepare readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Queries the agent with the given text and previous response ID.
 */
async function queryAgent(
  openai: OpenAI,
  text: string,
  previousResponseId: string | null
) {
  const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    instructions: 
        `You are a helpful assistant that can access information from DeepWiki. 
        Answer the question in two paragraphs at most.`,
    input: text,
    previous_response_id: previousResponseId,
    tools: [
      {
        type: "mcp",
        server_label: "deepwiki",
        server_url: "https://mcp.deepwiki.com/mcp",
        require_approval: "never",
        allowed_tools: ["ask_question"],
      },
    ],
  });

  return { response: response.output_text, responseId: response.id };
}

/**
 * Handles the main prompt loop.
 */
async function processPrompt(
  openai: OpenAI,
  previousResponseId: string | null
): Promise<void> {
  rl.question("\n# What is your question? \n> ", async (prompt) => {
    if (prompt.toLowerCase() === "q") {
      rl.close();
      console.log("\nExiting...");
      process.exit(0);
    } else {
      const result = await queryAgent(openai, prompt, previousResponseId);

      console.log("\n# Agent response:");
      console.log(result.response);

      // recursively call processPrompt with the new response ID
      processPrompt(openai, result.responseId);
    }
  });
}

async function main() {
  console.log("# 05-mcp-server.ts started...");
  console.log("Type 'q' to quit");
  try {
    const openai = new OpenAI();
    await processPrompt(openai, null);
  } catch (err) {
    console.error("\nFatal error:", err);
    process.exit(1);
  }
}

main();

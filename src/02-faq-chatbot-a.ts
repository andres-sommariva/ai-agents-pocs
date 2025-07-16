import OpenAI from "openai";
import {
  Agent,
  AgentInputItem,
  fileSearchTool,
  run,
  SystemMessageItem,
} from "@openai/agents";
import { setDefaultOpenAIKey } from "@openai/agents";
import dotenv from "dotenv";
import * as readline from "readline";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();
setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);

const FAQ_FILENAME = "02-faq-chatbot.txt";
const VECTOR_STORE_NAME = "faq-chatbot";

// prepare readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Sets up the vector store and uploads the FAQ file.
 */
async function setupVectorStore(openai: OpenAI): Promise<string> {
  // check if vector store exists
  const vectorStores = await openai.vectorStores.list();
  let vectorStore = vectorStores.data.find((v) => v.name === VECTOR_STORE_NAME);
  if (vectorStore) {
    return vectorStore.id;
  }
  // create vector store
  vectorStore = await openai.vectorStores.create({
    name: VECTOR_STORE_NAME,
  });
  // upload knowledge base file to vector store
  const filePath = path.join(__dirname, FAQ_FILENAME);
  await openai.vectorStores.files.uploadAndPoll(
    vectorStore.id,
    fs.createReadStream(filePath)
  );
  return vectorStore.id;
}

/**
 * Sets up the agent.
 */
async function setupAgent(
  vectorStoreId: string
): Promise<Agent> {
  const agent = new Agent({
    model: "gpt-4.1-nano",
    name: "Assistant",
    instructions: `You are a FAQ chatbot. Answer the question based on the FAQ data provided.
    Answer should be no longer than 250 words. Be concise and to the point.
    You will be provided with the conversation history for additional context.
    `,
    tools: [fileSearchTool([vectorStoreId], { maxNumResults: 1 })],
  });
  return agent;
}

let conversationHistory: AgentInputItem[] = [];

/**
 * Handles the main prompt loop.
 */
async function processPrompt(agent: Agent) {
  rl.question("\n# What is your question? \n> ", async (prompt) => {
    if (prompt.toLowerCase() === "q") {
      rl.close();
      console.log("\nExiting...");
      process.exit(0);
    } else {
      conversationHistory.push({
        role: "user",
        content: prompt,
      });
      const result = await run(agent, conversationHistory);

      console.log("\n# Agent response:");
      console.log(result.finalOutput);

      conversationHistory.push({
        role: "system",
        content: result.finalOutput,
      } as SystemMessageItem);

      // recursively call processPrompt
      processPrompt(agent);
    }
  });
}

async function main() {
  console.log("# 02-faq-chatbot.ts started...");
  console.log("Type 'q' to quit");
  try {
    const openai = new OpenAI();
    const vectorStoreId = await setupVectorStore(openai);
    const agent = await setupAgent(vectorStoreId);
    await processPrompt(agent);
  } catch (err) {
    console.error("\nFatal error:", err);
    process.exit(1);
  }
}

main();

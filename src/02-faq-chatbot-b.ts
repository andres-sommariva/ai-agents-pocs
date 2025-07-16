import OpenAI from "openai";
import dotenv from "dotenv";
import * as readline from "readline";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

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
 * Queries the agent with the given text and previous response ID.
 */
async function queryAgent(
  openai: OpenAI,
  vectorStoreId: string,
  text: string,
  previousResponseId: string | null
) {
  const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    instructions: `You are a FAQ chatbot. Answer the question based on the FAQ data provided.
            Answer should be no longer than 250 words. Be concise and to the point.
            You will be provided with the conversation history for additional context.`,
    input: text,
    previous_response_id: previousResponseId,
    tools: [
      {
        type: "file_search",
        vector_store_ids: [vectorStoreId!],
        max_num_results: 1,
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
  vectorStoreId: string,
  previousResponseId: string | null
): Promise<void> {
  rl.question("\n# What is your question? \n> ", async (prompt) => {
    if (prompt.toLowerCase() === "q") {
      rl.close();
      console.log("\nExiting...");
      process.exit(0);
    } else {
      const result = await queryAgent(
        openai,
        vectorStoreId,
        prompt,
        previousResponseId
      );
      
      console.log("\n# Agent response:");
      console.log(result.response);

      // recursively call processPrompt with the new response ID
      processPrompt(openai, vectorStoreId, result.responseId);
    }
  });
}

async function main() {
  console.log("# 02-faq-chatbot-b.ts started...");
  console.log("Type 'q' to quit");
  try {
    const openai = new OpenAI();
    const vectorStoreId = await setupVectorStore(openai);
    await processPrompt(openai, vectorStoreId, null);
  } catch (err) {
    console.error("\nFatal error:", err);
    process.exit(1);
  }
}

main();

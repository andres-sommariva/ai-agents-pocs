import OpenAI from "openai";
import dotenv from "dotenv";
import * as readline from "readline";
import fs from "fs";
import path from "path";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

// Load environment variables
dotenv.config();

const FAQ_FILENAME = "04-structured-outputs.csv";

// prepare readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// define the schema for the output
const SentimentAnalysisResult = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
  sentiment: z.enum(["Positive", "Negative", "Neutral"]),
});

/**
 * Queries the agent with the given text and previous response ID.
 */
async function queryAgent(
  openai: OpenAI,
  text: string,
) {
  const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    instructions: `You are a helpful assistant. Analyze the following text and return a JSON object with the following structure:
    {
      "summary": "A concise summary of the text",
      "keywords": ["List of keywords extracted from the text"],
      "sentiment": "Positive, Negative, or Neutral"
    }`,
    input: text,
    text: {
      format: zodTextFormat(SentimentAnalysisResult, "sentiment"),
    },
  });

  return { response: response.output_text };
}

/**
 * Handles the main prompt loop.
 */
async function processPrompt(
  openai: OpenAI,
): Promise<void> {
  rl.question("\n# User input: \n> ", async (prompt) => {
    if (prompt.toLowerCase() === "q") {
      rl.close();
      console.log("\nExiting...");
      process.exit(0);
    } else {
      const result = await queryAgent(
        openai,
        prompt,
      );
      
      console.log("\n# Agent response:");
      console.log(JSON.parse(result.response));

      // recursively call processPrompt
      processPrompt(openai);
    }
  });
}

async function main() {
  console.log("# 04-structured-outputs.ts started...");
  console.log("Type 'q' to quit");
  try {
    const openai = new OpenAI();
    await processPrompt(openai);
  } catch (err) {
    console.error("\nFatal error:", err);
    process.exit(1);
  }
}

main();

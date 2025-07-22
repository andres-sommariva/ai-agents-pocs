import OpenAI from "openai";
import { getEncoding, getEncodingNameForModel } from "js-tiktoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const MODEL_NAME = "gpt-4.1-nano";
const ENCODING = getEncoding(getEncodingNameForModel(MODEL_NAME));

/**
 * Splits a text into chunks of paragraphs, each not exceeding a specified token limit.
 */
function chunkTextByParagraph(text: string, maxTokens: number = 2000): string[] {
  const paragraphs = text.split(/\n\s*\n/); // Split by empty lines (paragraphs)
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const tokens = ENCODING.encode(currentChunk + para);
    if (tokens.length > maxTokens) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

/**
 * Summarizes a chunk of text using OpenAI's API.
 */
async function summarizeChunk(openai: OpenAI, chunk: string): Promise<string> {
  const response = await openai.responses.create({
    model: MODEL_NAME,
    instructions: "Summarize the following text in a concise paragraph.",
    input: chunk,
    max_output_tokens: 256, // adjust as needed
  });
  return response.output_text;
}

/**
 * Summarizes a large text by breaking it into chunks and summarizing each chunk.
 */
async function summarizeLargeText(
  openai: OpenAI,
  text: string
): Promise<string> {
  const chunks = chunkTextByParagraph(text);
  const summaries: string[] = [];
  for (const chunk of chunks) {
    const summary = await summarizeChunk(openai, chunk);
    summaries.push(summary);
  }

  // Optionally, summarize the summaries for a final output
  const combinedSummaries = summaries.join("\n\n");
  const finalSummary = await summarizeChunk(openai, combinedSummaries);
  return finalSummary;
}

/**
 * Summarizes a large input text using chunking and recursive summarization.
 */
export async function summarizeAgent(
  openai: OpenAI,
  text: string
): Promise<string> {
  return await summarizeLargeText(openai, text);
}

async function main() {
  console.log("# 03-summarizer-tool.ts started...");
  try {
    const openai = new OpenAI();
    const text = fs.readFileSync(path.join(__dirname, "03-summarizer-tool.txt"), "utf-8");
    const summary = await summarizeAgent(openai, text);
    console.log("\n# Agent response:");
    console.log(summary);
  } catch (err) {
    console.error("\nFatal error:", err);
    process.exit(1);
  }
}

main();
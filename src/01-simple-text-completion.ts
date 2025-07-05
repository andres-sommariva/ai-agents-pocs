import { Agent, run } from "@openai/agents";
import { setDefaultOpenAIKey } from '@openai/agents';
import dotenv from "dotenv";
import * as readline from "readline";

// read env variables
dotenv.config();

// prepare readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// setup agent
setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);
const agent = new Agent({
  model: "gpt-4.1-nano",
  name: "Assistant",
  instructions: 
  `You are a helpful assistant. 
  
  Answer should be no longer than 250 words. Be concise and to the point.
  
  At the end of your answer, include the following:
  - The source of your information
  - The date of your information
  - A quote about happiness
  
  Example:
  - Question: Who is going to win the F1 British GP on 2025?
  - Answer: Lewis Hamilton
  - Source: F1 website
  - Date: 2025-07-05
  - Quote: "Happiness is not something ready made. It comes from your own actions." - Dalai Lama
  `,
});

console.log("# 01-simple-text-completion.ts started...");
console.log("Type 'q' to quit");

function processPrompt() {
  rl.question("# What is your question? \n> ", async (prompt) => {
    if (prompt.toLowerCase() === "q") {
      rl.close();
      console.log("Exiting...");
    } else {
      const result = await run(agent, prompt);
      console.log("\n# Agent response:");
      console.log(result.finalOutput);
      console.log('\n');
      processPrompt(); // Call the function again to prompt for more input
    }
  });
}

processPrompt();

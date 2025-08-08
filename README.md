# AI Agents POCs

This repository contains a collection of proof of concept (PoC) projects exploring the integration of AI agents into different applications and workflows.

These examples use OpenAI's [Agent SDK](https://openai.github.io/openai-agents-js/guides/agents/) and [Response API](https://platform.openai.com/docs/api-reference/responses).

In order to run the examples, you will need to setup a `.env` file with your OpenAI API key.

```
OPENAI_API_KEY=your-api-key
```

You can get your API key from [here](https://platform.openai.com/account/api-keys).

## Table of Contents

- [Simple Text Completion](#simple-text-completion)
- [FAQ Chatbot](#faq-chatbot)
- [Summarizer Tool](#summarizer-tool)

## Simple Text Completion

Code: [src/01-simple-text-completion.ts](./src/01-simple-text-completion.ts)

This is a simple text completion example.

- Description: Basic interface where the user types a prompt and sees the completion from OpenAI.
- Technical aspects: API request/response basics, handling user input, displaying output.

### How to run it

```bash
tsx src/01-simple-text-completion.ts
```

## FAQ Chatbot

Code: [src/02-faq-chatbot-a.ts](./src/02-faq-chatbot-a.ts) and [src/02-faq-chatbot-b.ts](./src/02-faq-chatbot-b.ts)

This is a FAQ chatbot example.

- Description: Builds on #1 by turning the agent into a chatbot for answering predefined or user-imported FAQs.
- Technical aspects: Maintaining chat history, optimizing prompt structure, basic conversation state.

Simply, add whatever knowledge you want to give to the agent in the `02-faq-chatbot.txt` text file and the agent will be able to answer questions based on that information.

The file will be uploaded to OpenAI's Vector Store and the agent will be able to access it.

### How to run it

```bash
tsx src/02-faq-chatbot-a.ts
```

or

```
tsx src/02-faq-chatbot-b.ts
```

### 02-faq-chatbot-a.ts

This sample uses the [Agent SDK](https://openai.github.io/openai-agents-js/guides/agents/) to create a chatbot.

### 02-faq-chatbot-b.ts

This sample uses the OpenAI [Response API](https://platform.openai.com/docs/api-reference/responses) to create a chatbot.

## Summarizer Tool

Code: [src/03-summarizer-tool.ts](./src/03-summarizer-tool.ts)

This is a summarizer tool example.

- Description: Enhances previous agents by accepting larger text and returning concise summaries.
- Technical aspects: Handling longer inputs, chunking, recursive summarization.

Simply, add whatever text you want to summarize in the `03-summarizer-tool.txt` text file and run the sample.  

### How to run it

```bash
tsx src/03-summarizer-tool.ts
```

## Structured Outputs

Code: [src/04-structured-outputs.ts](./src/04-structured-outputs.ts)

This is a structured output example.

- Description: Builds on #1 by accepting user input and returning a structured output.
- Technical aspects: Structured Outputs is a feature that ensures the model will always generate responses that adhere to your supplied JSON Schema.

### How to run it

```bash
tsx src/04-structured-outputs.ts
```

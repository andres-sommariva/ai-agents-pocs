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
- [Structured Outputs](#structured-outputs)
- [MCP Server](#mcp-server)

## Simple Text Completion

Code: [src/01-simple-text-completion.ts](./src/01-simple-text-completion.ts)

This is a simple text completion example.

- Description: Basic interface where the user types a prompt and sees the completion from OpenAI.
- Technical aspects: API request/response basics, handling user input, displaying output.

### How to run it

```bash
tsx src/01-simple-text-completion.ts
```

### Sample output

#### Prompt

```
Can you tell me a joke about cats?
```

#### Response

> Why was the cat sitting on the computer? Because it wanted to keep an eye on the mouse!
>
> - Source: General humor
> - Date: 2023-10-05
> - Quote: "Time spent with cats is never wasted." - Sigmund Freud


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

```bash
tsx src/02-faq-chatbot-b.ts
```

### 02-faq-chatbot-a.ts

This sample uses the [Agent SDK](https://openai.github.io/openai-agents-js/guides/agents/) to create a chatbot.What

### 02-faq-chatbot-b.ts

This sample uses the OpenAI [Response API](https://platform.openai.com/docs/api-reference/responses) to create a chatbot.

### Sample output

#### Prompt

```
How can my personal information be used?
```

#### Response

> Your personal information can be used mainly to provide the services you request, process payments, and, if you agree, send you information about similar products or services you might be interested in. This usage is in accordance with the Privacy Policy outlined by the service provider.

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

### Sample output

#### Response

> Niccolò Machiavelli’s life spanned three phases: his youth during Florence's Medici golden age, his career in public service as a diplomat and politician, and his later years during Medici rule, until his death in 1527. His extensive experiences, including diplomatic dealings with figures like Louis XII and Cesare Borgia, and his observations of Italian and European politics, deeply informed his writings, especially _The Prince_, which offers pragmatic and often ruthless advice on power, leadership, and statecraft. Despite political setbacks—including imprisonment and exile—Machiavelli dedicated himself to understanding human nature, military strategy, and political stability, emphasizing the importance of virtù, adaptability, and realpolitik. His works analyze the rise and fall of rulers, the importance of military strength rooted in citizen armies, and the necessity of balancing cruelty and clemency, all while highlighting the significance of appearance, reputation, and strategic alliances. Throughout, Machiavelli advocates for pragmatic, sometimes morally questionable actions, emphasizing that effective power depends on shrewdness, resilience, and a deep understanding of political realities, securing his legacy as a foundational thinker in political theory.

## Structured Outputs

Code: [src/04-structured-outputs.ts](./src/04-structured-outputs.ts)

This is a structured output example.

- Description: Builds on #1 by accepting user input and returning a structured output.
- Technical aspects: Structured Outputs is a feature that ensures the model will always generate responses that adhere to your supplied JSON Schema.

### How to run it

```bash
tsx src/04-structured-outputs.ts
```

### Sample output

#### Prompt

```
The repository serves a specific niche - making Formula 1 data accessible through the Model Context Protocol standard. Its value depends on whether you need F1 data integration with MCP-compatible AI applications. The implementation quality appears solid with good architectural patterns and comprehensive tooling.
```

#### Response

```js
{
  summary: 'The repository provides Formula 1 data access via the Model Context Protocol, useful for MCP-compatible AI applications, with solid implementation and tooling.',
  keywords: [
    'Formula 1 data',
    'Model Context Protocol',
    'MCP',
    'AI applications',
    'implementation quality'
  ],
  sentiment: 'Positive'
}
```

## MCP Server

Code: [src/05-mcp-server.ts](./src/05-mcp-server.ts)

This is a MCP server example.

- Description: Enhances previous agents by using MCP server tools to process the user input.
- Technical aspects: MCP server tools are a feature that allows the agent to access information from external sources.

### How to run it

```bash
tsx src/05-mcp-server.ts
```

### Sample output

#### Prompt

```
What are the main technologies used in "andres-sommariva/ai-agents-pocs"?
```

#### Response

> The repository "andres-sommariva/ai-agents-pocs" primarily employs OpenAI's technological ecosystem for developing AI agents and applications. The key technologies include the OpenAI `Agent SDK`, which offers a high-level abstraction for building conversational AI systems by managing conversations, tools, and integrations, and the OpenAI `Response API`, a lower-level interface for generating model responses directly. The project also leverages various supporting libraries such as `dotenv` for environment variable management, `readline` for interactive CLI input, `fs` for file system operations, `js-tiktoken` for token counting and text chunking, and `zod` for schema validation.
>
> The implementation is predominantly in TypeScript and utilizes models like `"gpt-4.1-nano"` across different examples. The repository also integrates vector store technology for storing and retrieving knowledge base content, enabling functionalities such as FAQ chatbots with search capabilities. Overall, the project showcases a variety of tools and APIs from OpenAI to explore AI agent integration, conversation management, and knowledge retrieval.


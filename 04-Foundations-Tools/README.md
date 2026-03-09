# 04 - Foundations: Tools

## The Big Picture
Large Language Models are great at generating text, but they are isolated from the real world. They can't check a database, do complex math reliably, or look up the current weather. 

Tools (also known as function calling) bridge this gap. You give the AI a description of a function it can use. If the AI decides it needs that tool to answer the user's prompt, it will pause generating text, ask your application to run the tool, wait for the result, and then use that result to formulate its final answer.

## Anatomy of a Tool
Every tool in the Vercel AI SDK needs three core properties:
1. description: A clear explanation of what the tool does. The AI reads this to decide if it should trigger the tool.
2. parameters: A schema (usually Zod) that defines exactly what data the tool needs to run. 
3. execute: The actual asynchronous JavaScript function that runs the code.

## Types of Tools
The SDK categorizes tools into three types:
1. Custom Tools: You build the description, schema, and execute logic from scratch. These are provider-agnostic, meaning they work whether you use Google, OpenAI, or Anthropic.
2. Provider-Defined Tools: The AI provider dictates the schema and description, but you write the execute logic. (e.g., Anthropic's specific bash tool).
3. Provider-Executed Tools: The AI provider hosts and runs the tool on their own servers. You just configure it. (e.g., OpenAI's built-in web search).

## What I Learned (Key Takeaways)
* Zod is the bouncer: The AI SDK uses Zod to strictly validate the data the AI tries to pass to the tool. If the AI hallucinates a parameter or passes a number instead of a string, Zod catches it before your server crashes.
* The AI does not run the code: A common misconception is that the AI executes the function. It doesn't. The AI just generates a JSON object with the requested parameters, and the Vercel AI SDK runs the function securely on your backend.
* Tool Packages: Because tools are just JavaScript objects, the community has built tons of ready-made NPM packages for things like web scraping or database querying that can just be imported and dropped into the tools object.

---

## Running the Code

This example runs a simple custom tool that simulates fetching the weather. 

Make sure your terminal is in the root directory of the project, then run:

node 04-tools/index.js
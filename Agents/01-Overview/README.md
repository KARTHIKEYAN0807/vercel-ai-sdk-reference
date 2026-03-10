# Agents: Overview

## The Big Picture
In the previous "Foundations" section, we learned about Tools. When you gave the AI a tool, it used it *once* and stopped. 

**Agents** take this to the next level. An Agent is an AI that is put inside a **loop**. You give it a goal and multiple tools. The AI will look at the tools, use one, check the result, realize it needs to use another tool, use that one, and keep looping until the main goal is completely finished.

## Core Concepts
* **`ToolLoopAgent` Class:** In Vercel AI SDK Version 6, they introduced this brand new class. Instead of writing messy `while` loops yourself, this class automatically manages the loop, remembers the conversation history, and stops when the task is done.
* **Autonomy:** You don't tell the AI *how* to do the task. You just give it tools (like a Weather tool and a Math tool) and ask a complex question. The AI figures out the order of operations by itself.
* **Reusability:** Because the Agent is a Class, you can define it once at the top of your file and reuse it anywhere in your app just by calling `agent.generate()`.

## What I Learned (Key Takeaways)
Agents are just Large Language Models (LLMs) stuck in a loop with tools. The new `ToolLoopAgent` removes all the boilerplate code, letting the AI automatically chain multiple tools together (e.g., getting the weather, then converting the temperature) before finally talking to the user.

---

## Running the Code
This script gives the AI two tools: one to fetch weather, and one to convert math. We ask it a trick question that requires using *both* tools.

Run this command from the root of your project:

```bash
node Agents/01-Overview/index.js
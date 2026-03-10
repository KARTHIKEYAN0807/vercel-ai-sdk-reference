```markdown
# Agents: Building Agents

## The Big Picture
While the `ToolLoopAgent` class automatically handles loops for you, you don't want an Agent running infinitely and burning through your API budget. You also want to monitor what it is doing behind the scenes. 

"Building Agents" is about applying guardrails, specific behaviors, and tracking mechanisms to your autonomous loops.

## Core Concepts
* **System Instructions:** You can pass `instructions` directly into the agent to define its personality, strict rules, and boundaries (e.g., "Never share internal company info").
* **Loop Control (`stopWhen`):** By default, an agent will stop after 20 steps. You can modify this to strictly limit how many times the AI is allowed to loop (e.g., `stopWhen: stepCountIs(5)`) to save money.
* **Tool Choice:** You can force the agent to use a specific tool, force it to *not* use tools, or let it decide automatically (the default).
* **Lifecycle Callbacks:** The agent provides hooks like `onStepFinish` and `onFinish`. These are incredibly useful for logging exactly how many tokens the agent used during its loop so you can track your API costs.
* **Structured Output:** You can force an agent to return strict, typed JSON objects (like a sentiment analysis report) instead of plain text conversations.
* **Streaming:** You can make the agent type out its final response chunk-by-chunk for a better user experience.

## What I Learned (Key Takeaways)
The `ToolLoopAgent` is designed for reusability. By defining the model, instructions, tools, and callbacks inside a single Class instance, you can export that Agent and use it anywhere in your codebase (like a Next.js API route) without rewriting the logic. The SDK also makes it incredibly easy to switch between standard text generation, streaming, or strict JSON output depending on the needs of your application.

---

## Running the Code

This folder contains three distinct examples of configuring an Agent:

**1. The Monitored Agent (`index.js`)**
Creates a strictly controlled agent with a maximum of 3 steps and uses lifecycle callbacks to print its internal thought process and token usage to the terminal.
```bash
node Agents/02-Building-Agents/index.js

```

**2. The Structured Agent (`structured.js`)**
Demonstrates how to force an agent to fetch data and return it as a strictly typed JSON object instead of a text paragraph.

```bash
node Agents/02-Building-Agents/structured.js

```

**3. The Streaming Agent (`stream.js`)**
Demonstrates how to run a tool (rolling a dice) and then stream the resulting story back to the terminal chunk-by-chunk.

```bash
node Agents/02-Building-Agents/stream.js

```

# Agents: Configuring Call Options

## The Big Picture
If you build an AI assistant for your app, you don't want to create a brand new `ToolLoopAgent` every time a different user logs in. You want to create *one* master Agent, and simply pass the user's specific context (like their User ID, Location, or Account Tier) into the agent right before it runs.

"Call Options" allow you to pass strictly typed, dynamic data into your Agent at runtime.

## Core Concepts
1. **`callOptionsSchema`:** You use Zod to define exactly what variables the Agent expects to receive when someone calls `agent.generate()`.
2. **`prepareCall`:** This is a callback that runs exactly once *before* the agent starts its loop. It intercepts the `options` you passed in, and uses them to dynamically rewrite the system prompt, swap the model, or toggle tools on/off.

## Key Patterns Included
1. **Basic Context Injection:** Injecting a User ID and Account Tier into the system prompt.
2. **Dynamic Model Selection:** Automatically switching to a smarter model if the incoming request is flagged as "complex".
3. **Dynamic Tool Configuration:** Passing the user's City and Region directly into a Weather or Search tool.
4. **Provider-Specific Options:** Changing low-level settings (like OpenAI's `reasoningEffort`) based on the difficulty of the task.
5. **RAG & Combined Settings:** Fetching a user's database role (Admin vs User), doing a vector search, and turning off "write" tools if they aren't an Admin.

---

## Running the Code
```bash
node Agents/05-Configuring-Call-Options/01-basic-context.js
node Agents/05-Configuring-Call-Options/02-dynamic-model.js
node Agents/05-Configuring-Call-Options/03-dynamic-tools.js
node Agents/05-Configuring-Call-Options/04-provider-options.js
node Agents/05-Configuring-Call-Options/05-rag-and-roles.js
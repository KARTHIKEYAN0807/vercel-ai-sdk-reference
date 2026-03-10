# Agents: Loop Control

## The Big Picture
When you give an AI tools and put it in a loop, it has the potential to run forever. "Loop Control" is about strictly managing that execution flow. You need to know how to stop the agent conditionally and how to modify the agent's brain (model, tools, memory) *between* its steps.

## Core Concepts
1. **`stopWhen` (Stop Conditions):** Define rules for when the loop must terminate (e.g., maximum steps, specific tools used, or budget limits).
2. **`prepareStep` (Dynamic Adjustments):** A callback that runs *before* every single loop iteration. You can use it for:
   - **Dynamic Model Selection:** Upgrading to a smarter model mid-loop.
   - **Context Management:** Trimming old conversation memory to save tokens.
   - **Tool Selection:** Turning specific tools on or off depending on the step number.
   - **Message Modification:** Intercepting large tool responses and summarizing them before the AI reads them.
3. **Forced Tool Calling (The `done` Pattern):** Forcing the AI to use a fake `done` tool to exit the loop, ensuring strict JSON output instead of text.
4. **Manual Loop Control:** Completely abandoning the `ToolLoopAgent` class and writing your own custom `while` loop using raw `generateText` for absolute, low-level control.

---

## Running the Code

**Stop Conditions & Forced Exits**
```bash
node Agents/04-Loop-Control/01-stop-conditions.js
node Agents/04-Loop-Control/03-forced-tool.js 

PrepareStep (Dynamic Adjustments)

Bash
node Agents/04-Loop-Control/02-prepare-step-model.js
node Agents/04-Loop-Control/04-context-management.js
node Agents/04-Loop-Control/05-tool-selection.js
node Agents/04-Loop-Control/06-message-modification.js
Advanced

node Agents/04-Loop-Control/07-manual-loop.js
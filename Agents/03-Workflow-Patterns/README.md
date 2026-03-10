# Agents: Workflow Patterns

## The Big Picture
While the `ToolLoopAgent` is great for simple autonomous tasks, professional AI applications require rigid structure and reliability. "Workflow Patterns" are architectural blueprints for how to chain multiple AI calls together to handle complex, enterprise-level tasks.

Instead of relying on a single AI to magically do everything, you break the task down and use specific core SDK functions (like `generateText`) to control exactly *how* and *when* the AI operates.

## Core Patterns
1. **Sequential Processing:** Passing the output of one AI directly into the input of the next AI (like an assembly line).
2. **Routing:** Using an initial AI to classify a prompt, and then writing an `if/else` statement to send it to different, specialized models.
3. **Parallel Processing:** Using `Promise.all()` to have 3 different AIs process the exact same input simultaneously to save time.
4. **Orchestrator-Worker:** Using a "Manager" AI to create a plan, and then spinning up multiple smaller "Worker" AIs to execute each step of that plan.
5. **Evaluator-Optimizer:** Putting an AI in a `while` loop to check its own work. If the work is bad, it gets feedback and tries again until it passes quality control.

## Running the Code
Because these patterns represent complex logic, they are split into individual files. 

*(Note: These scripts use multiple AI calls in a row. If you are on the free tier, these will quickly trigger a 429 Rate Limit error. Run them sparingly!)*

```bash
node Agents/03-Workflow-Patterns/01-sequential.js
node Agents/03-Workflow-Patterns/02-routing.js
node Agents/03-Workflow-Patterns/03-parallel.js
node Agents/03-Workflow-Patterns/04-orchestrator.js
node Agents/03-Workflow-Patterns/05-evaluator.js
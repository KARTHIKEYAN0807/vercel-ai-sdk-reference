# AI SDK Core: DevTools

This module demonstrates how to configure local observability during development using `@ai-sdk/devtools` while maintaining cloud telemetry with Langfuse.

**1️⃣ What is it? (Definition)**
The AI SDK DevTools is a local development middleware and companion web application that captures and visualizes AI interactions, prompts, and tool calls in a clean UI.

**2️⃣ Why do we need it? (Purpose)**
It helps developers debug complex, multi-step AI agent workflows by allowing them to inspect exact inputs, raw provider outputs, latency, and token usage without constantly refreshing an external cloud dashboard or digging through terminal logs.

**3️⃣ Where is it used? (Real usage)**
It is used locally during the active development phase of building AI applications, especially when engineering complex prompt chains or testing new system instructions.

**4️⃣ Where should it NOT be used? (Limitations)**
It should NEVER be deployed to production environments. DevTools stores all generated data locally in a `.devtools` folder, which could expose sensitive user interactions if left active on a live server.

**5️⃣ What was used before this? (Older approach)**
Before this local UI, developers had to rely on massive `console.log()` statements that flooded the terminal with unreadable JSON, or they had to wait for cloud telemetry tools (like Langfuse) to process traces even for minor local tests.
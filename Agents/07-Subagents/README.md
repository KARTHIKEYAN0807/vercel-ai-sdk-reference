# Agents: Subagents

## The Big Picture
A Subagent is an autonomous agent that is called by a "Parent" agent via a Tool. 

Instead of forcing your main conversational AI to do heavy, token-expensive research (which pollutes its context window), the main AI delegates the task to a specialized Subagent. The Subagent works in isolation and then returns a clean, condensed summary back to the main AI.

## Core Concepts
1. **Context Offloading:** Keeping the main agent's "brain" clean by having subagents do the heavy reading/processing.
2. **Basic Delegation:** Creating a `ToolLoopAgent` and placing its `generate()` method inside the `execute` block of a Tool.
3. **Controlling What the Model Sees (`toModelOutput`):** A powerful feature where the User UI sees the entire subagent's thought process, but the Main Agent only sees the final summarized text to save tokens.
4. **Streaming Progress:** Using async generators (`yield`) to stream the Subagent's internal thought process back to the UI in real-time. *(Note: This requires React/Next.js to visualize properly).*

## Running the Code
Because the streaming subagents require a Next.js frontend to work correctly, this folder focuses on the pure backend architectural implementation of a Subagent.

```bash
node Agents/07-Subagents/01-basic-subagent.js
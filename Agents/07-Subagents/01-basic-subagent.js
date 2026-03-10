import { ToolLoopAgent, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runSubagentPattern() {
  console.log("Starting Subagents: Manager & Researcher Pattern...\n");

  // ---------------------------------------------------------
  // 1. THE SUBAGENT (The Worker)
  // ---------------------------------------------------------
  const researchSubagent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    stopWhen: stepCountIs(5),
    instructions: `You are a meticulous researcher. 
    Use your tools to find information. 
    CRITICAL: When you are finished, write a 2-sentence summary of your findings. Do not write a long essay.`,
    tools: {
      fakeSearchInternet: tool({
        description: 'Search the internet for raw data',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          console.log(`      [Subagent Tool] Searching internet for: ${query}...`);
          return { data: `Massive 500-page document about ${query}. It says the core concept is X and Y.` };
        },
      }),
    },
  });

  // ---------------------------------------------------------
  // 2. THE DELEGATION TOOL
  // ---------------------------------------------------------
  const researchTool = tool({
    description: 'Delegate heavy research tasks to a specialized researcher subagent.',
    inputSchema: z.object({
      task: z.string().describe('The specific topic to research'),
    }),
    
    execute: async ({ task }) => {
      console.log(`\n  [Manager] Spinning up Subagent for task: "${task}"...`);
      
      const result = await researchSubagent.generate({
        prompt: task,
      });
      
      console.log(`  [Manager] Subagent finished. Returning summary to main context.`);
      return result.text; // We ONLY return the short summary back to the Manager!
    },
  });

  // ---------------------------------------------------------
  // 3. THE MAIN AGENT (The Orchestrator)
  // ---------------------------------------------------------
  const mainAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'), // FIXED MODEL NAME
    instructions: 'You are a helpful assistant. If a user asks a complex question, delegate it to your research subagent.',
    tools: {
      research: researchTool,
    },
  });

  console.log("User Prompt: 'Can you research Quantum Computing for me?'");
  
  const finalResult = await mainAgent.generate({
    prompt: 'Can you research Quantum Computing for me?',
  });

  console.log("\n--- Final Answer from Main Agent ---");
  console.log(finalResult.text);
}

runSubagentPattern();
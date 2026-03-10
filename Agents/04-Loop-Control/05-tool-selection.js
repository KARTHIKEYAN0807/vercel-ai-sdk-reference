import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runToolSelection() {
  console.log("Starting Loop Control: Dynamic Tool Selection...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    stopWhen: stepCountIs(3),
    
    prepareStep: async ({ stepNumber }) => {
      console.log(`[Step ${stepNumber}] Adjusting available tools...`);
      
      if (stepNumber === 0) {
        console.log("-> Phase 1: Only allowing the Search tool.");
        return { 
          activeTools: ['search'], // Only this tool is allowed
          toolChoice: 'required'   // Force it to use the tool
        };
      }
      
      if (stepNumber === 1) {
        console.log("-> Phase 2: Only allowing the Analyze tool.");
        return { activeTools: ['analyze'] };
      }

      return {}; // Default settings for the rest
    },

    tools: {
      search: tool({
        description: 'Search for raw data',
        inputSchema: z.object({}),
        execute: async () => ({ raw: "Raw database dump." }),
      }),
      analyze: tool({
        description: 'Analyze raw data',
        inputSchema: z.object({ data: z.string() }),
        execute: async () => ({ analysis: "The data is good." }),
      })
    }
  });

  const result = await agent.generate({ prompt: 'Search for data and then analyze it.' });
  console.log("\n--- Final Output ---");
  console.log(result.text);
}

runToolSelection();
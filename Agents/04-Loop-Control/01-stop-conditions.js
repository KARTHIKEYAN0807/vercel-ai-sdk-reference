import { ToolLoopAgent, stepCountIs, hasToolCall, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runStopConditions() {
  console.log("Starting Loop Control: Stop Conditions...\n");

  // Custom Stop Condition: Stop if the agent uses more than 500 tokens total
  const tokenLimitReached = ({ steps }) => {
    let totalTokens = 0;
    for (const step of steps) {
      if (step.usage) {
        totalTokens += (step.usage.inputTokens + step.usage.outputTokens);
      }
    }
    if (totalTokens > 500) {
      console.log(`[STOP CONDITION TRIGGERED] Token limit exceeded: ${totalTokens}`);
      return true;
    }
    return false;
  };

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    // The agent will stop if ANY of these conditions are met
    stopWhen: [
      stepCountIs(10),              // Stop at 10 steps max
      hasToolCall('submitFinal'),   // Stop immediately if this tool is called
      tokenLimitReached             // Stop if it gets too expensive
    ],

    tools: {
      searchDatabase: tool({
        description: 'Search the database for clues',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => ({ result: `Found info about ${query}. Keep looking.` }),
      }),
      submitFinal: tool({
        description: 'Submit the final answer',
        inputSchema: z.object({ answer: z.string() }),
        execute: async ({ answer }) => ({ status: 'Submitted', answer }),
      })
    }
  });

  const result = await agent.generate({
    prompt: 'Search the database for the secret code and then submit it.',
  });

  console.log("\n--- Agent Finished ---");
  console.log(`Steps taken: ${result.steps.length}`);
}

runStopConditions();
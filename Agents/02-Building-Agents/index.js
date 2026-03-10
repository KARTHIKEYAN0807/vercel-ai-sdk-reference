import { ToolLoopAgent, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runBuildingAgentsExample() {
  console.log("Initializing the strict, tracked Agent...\n");

  const monitoredAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    // 1. Strict System Instructions
    instructions: `You are a strict data assistant. 
    Rule 1: Always use the 'getFakeDatabaseRecord' tool to answer queries.
    Rule 2: Keep your final response under 2 sentences.`,
    
    // 2. Loop Control - Prevents infinite loops and saves API budget
    stopWhen: stepCountIs(3), 
    
    // 3. Tool Choice - 'auto' is default, but you can use 'required' to force tool usage
    toolChoice: 'auto',

    tools: {
      getFakeDatabaseRecord: tool({
        description: 'Fetch user data from the database by ID',
        inputSchema: z.object({
          userId: z.string().describe('The ID of the user'),
        }),
        execute: async ({ userId }) => {
          return { id: userId, name: "Alice", status: "Active Premium Member" };
        },
      }),
    },

    // 4. Lifecycle Callbacks - These let you spy on the agent while it loops
    onStepFinish({ stepNumber, usage, toolCalls }) {
      console.log(`\n[Callback Log] Step ${stepNumber} finished.`);
      console.log(`  Tokens used this step: ${usage.totalTokens}`);
      if (toolCalls && toolCalls.length > 0) {
        console.log(`  Tools invoked: ${toolCalls.map(t => t.toolName).join(', ')}`);
      } else {
        console.log(`  Tools invoked: None (Agent is writing final response)`);
      }
    },
  });

  console.log("Sending Prompt: 'Who is user 9942?'\n");

  // We run the agent. Because of the callbacks, it will print logs as it thinks!
  const result = await monitoredAgent.generate({
    prompt: 'Who is user 9942?',
    
    // we can also add specific callbacks just for this single generation
    onFinish({ totalUsage, steps }) {
      console.log(`\n[Callback Log] Agent task completely finished!`);
      console.log(`  Total steps taken: ${steps.length}`);
      console.log(`  Total tokens burned: ${totalUsage.totalTokens}`);
    }
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}


runBuildingAgentsExample();
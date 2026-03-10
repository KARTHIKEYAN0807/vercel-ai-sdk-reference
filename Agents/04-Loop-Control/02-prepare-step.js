import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runPrepareStep() {
  console.log("Starting Loop Control: Dynamic prepareStep...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'), // We start with the cheap model
    stopWhen: stepCountIs(5),

    // This runs before EVERY single loop iteration
    prepareStep: async ({ stepNumber, messages }) => {
      console.log(`\n[Prepare Step] Checking config before Step ${stepNumber}...`);

      // If the agent is struggling (taking too many steps), upgrade the model!
      if (stepNumber > 1) {
        console.log("-> Agent seems stuck. Upgrading model to Gemini Pro!");
        return {
          model: google('gemini-3.1-pro'),
        };
      }

      // If it's step 0 or 1, keep the default settings
      return {}; 
    },

    tools: {
      calculateComplexMath: tool({
        description: 'Calculate physics equations',
        inputSchema: z.object({ equation: z.string() }),
        execute: async () => ({ answer: 42 }),
      })
    }
  });

  const result = await agent.generate({
    prompt: 'Solve this extremely complex physics equation and explain the theory behind it.',
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

runPrepareStep();
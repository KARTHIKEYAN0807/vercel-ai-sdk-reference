import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runStreamingAgent() {
  console.log("Initializing the Streaming Agent...\n");

  const storyAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    instructions: "You are a creative storyteller.",
    stopWhen: stepCountIs(3),
    tools: {
      rollDice: tool({
        description: 'Roll a 20-sided dice to determine the outcome of an action',
        inputSchema: z.object({}),
        execute: async () => {
          const roll = Math.floor(Math.random() * 20) + 1;
          console.log(`\n[Tool] The agent rolled a ${roll}!`);
          return { roll };
        },
      }),
    }
  });

  console.log("Prompt: 'Roll a dice and write a 2-sentence story about a knight based on the roll.'\n");
  console.log("--- Agent Response Stream ---");

  // 1. We use .stream() instead of .generate()
  const result = await storyAgent.stream({
    prompt: 'Roll a dice and write a 2-sentence story about a knight based on the roll.',
  });

  // 2. We loop through the text stream just like ChatGPT
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
  
  console.log("\n\n--- Stream Complete ---");
}

runStreamingAgent();
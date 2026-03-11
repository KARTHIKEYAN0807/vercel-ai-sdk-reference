import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const { text, steps } = await generateText({
    model: ollama('llama3.2'),
    // stopWhen: stepCountIs(n) is the current way to limit tool loops in the SDK
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => {
          console.log(`\n[Tool] Executing weather check for: ${location}`);
          return {
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          };
        },
      } as any), // 'as any' handles the Zod version mismatch with the provider
    },
    prompt: 'What is the weather in chennai?',
  });

  console.log('\n--- Result ---');
  console.log('Final Answer:', text);
  
  // 'steps' contains the history of everything the model did (tool calls, etc.)
  console.log(`\nSteps taken: ${steps.length}`);
}

main();
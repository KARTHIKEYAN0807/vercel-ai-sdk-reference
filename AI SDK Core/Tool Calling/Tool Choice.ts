import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const result = await generateText({
    model: ollama('llama3.2'),
    toolChoice: 'required', 
    
    // Use stopWhen instead of maxSteps to fix the TS error
    stopWhen: stepCountIs(2), 

    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => {
          console.log(`\n[Tool] Forced execution for: ${location}`);
          return {
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          };
        },
      } as any),
    },
    prompt: 'What is the weather in San Francisco?',
  });

  console.log('\n--- Final Result ---');
  // result.text will now contain the actual weather description
  console.log(result.text);
}

main().catch(console.error);
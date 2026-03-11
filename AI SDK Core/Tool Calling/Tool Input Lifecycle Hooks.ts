import { streamText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  // Note: We don't use 'await' here because streamText returns immediately
  const result = streamText({
    model: ollama('llama3.2'),
    stopWhen: stepCountIs(2),
    tools: {
      getWeather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => {
          console.log(`\n\n[Tool Executing] Fetching weather for: ${location}`);
          return { temperature: 72 + Math.floor(Math.random() * 21) - 10 };
        },
        
        // --- Streaming Hooks ---
        onInputStart: () => {
          console.log('\n[Hook] Tool call starting. Streaming arguments:');
        },
        onInputDelta: ({ inputTextDelta }: { inputTextDelta: string }) => {
          // process.stdout.write prints on the same line so we can watch it build
          process.stdout.write(inputTextDelta);
        },
        onInputAvailable: ({ input }: { input: any }) => {
          console.log('\n\n[Hook] Complete input parsed into object:', input);
        },
      } as any),
    },
    prompt: 'What is the weather in San Francisco?',
  });

  console.log('Waiting for model to start...');

  // We loop over the textStream to watch the final answer stream in
  console.log('\n--- Final Model Response ---');
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  
  console.log('\n\nDone!');
}

main().catch(console.error);
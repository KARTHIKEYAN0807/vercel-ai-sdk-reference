import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const controller = new AbortController();
  const myAbortSignal = controller.signal;

  try {
    const { text } = await generateText({
      model: ollama('llama3.2'),
      abortSignal: myAbortSignal,
      stopWhen: stepCountIs(2),
      tools: {
        weather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({ location: z.string() }),
          
          execute: async (
            { location }: { location: string }, 
            { abortSignal }: { abortSignal: AbortSignal }
          ) => {
            console.log(`\n[Tool] Fetching weather for: ${location}...`);
            
            // 1. Simulate a 1-second network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2. Check if the user cancelled the request during the delay
            if (abortSignal.aborted) {
              throw new Error('AbortError');
            }

            // 3. Return fake data instead of failing on the fetch call
            return { 
              location, 
              temperature: 65, 
              condition: 'Foggy with a cool breeze' 
            };
          },
        } as any),
      },
      prompt: 'What is the weather in San Francisco?',
    });

    console.log('\n--- Final Result ---');
    console.log(text);

  } catch (error: any) {
    if (error.message === 'AbortError' || error.name === 'AbortError') {
      console.log('\n[System] Request was cancelled.');
    } else {
      console.error('\n[Error]:', error.message);
    }
  }
}

main();
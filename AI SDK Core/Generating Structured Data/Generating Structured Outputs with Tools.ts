import { generateText, Output, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  try {
    const { output } = await generateText({
      model: ollama('llama3.2'),
      // Limit steps so it doesn't loop forever if it fails
      stopWhen: stepCountIs(3), 

      tools: {
        weather: tool({
          description: 'Get the weather for a city',
          // Simplified schema helps local models
          parameters: z.object({ 
            location: z.string().describe('The city name only') 
          }),
          execute: async ({ location }: { location: string }) => {
            console.log(`\n[Tool] Fetching weather for: ${location || 'San Francisco'}...`);
            return { temperature: 72, condition: 'sunny' };
          },
        } as any),
      },

      output: Output.object({
        schema: z.object({
          summary: z.string(),
          recommendation: z.string(),
        }),
      }),
      
      // Explicit instructions help small models like Llama 3.2
      prompt: 'First, use the weather tool for "San Francisco". Then, based on the result, provide a summary and a clothing recommendation in JSON format.',
    });

    console.log('\n--- Results ---');
    console.log('Summary:', output.summary);
    console.log('Recommendation:', output.recommendation);

  } catch (error) {
    console.error('\n[Error]: Model failed to generate the final object. Try a larger model or check the tool input.');
  }
}

main();
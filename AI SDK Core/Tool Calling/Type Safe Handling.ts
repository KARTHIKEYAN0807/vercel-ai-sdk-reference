import { generateText, tool, dynamicTool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get the weather in a location',
  parameters: z.object({
    location: z.string().describe('The city name'),
  }),
  execute: async ({ location }: { location: string }) => ({
    location,
    temperature: 72,
  }),
} as any);

async function main() {
  const result = await generateText({
    model: ollama('llama3.2'),
    tools: {
      weather: weatherTool,
      custom: dynamicTool({
        description: 'A dynamic tool',
        inputSchema: z.object({ query: z.string() }),
        execute: async (input: any) => ({ result: `Processed ${input.query}` }),
      }),
    },
    stopWhen: stepCountIs(5),
    prompt: 'What is the weather in San Francisco?',
    
    onStepFinish: ({ toolCalls }) => {
      for (const toolCall of toolCalls) {
        if (toolCall.dynamic) {
          const input = toolCall.input as { query: string };
          console.log('\n[Dynamic Tool] Input:', input.query);
        } else if (toolCall.toolName === 'weather') {
          const input = toolCall.input as { location: string };
          console.log('\n[Static Tool] Weather Location:', input.location);
        }
      }
    },
  });

  console.log('\n--- Final Output ---');
  console.log(result.text);
}

main().catch(console.error);
import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const { steps } = await generateText({
    model: ollama('llama3.2'),
    stopWhen: stepCountIs(10),
    
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => {
          return { location, temperature: 72 };
        },
      } as any),
    },
    prompt: 'What is the weather in San Francisco?',
  });

  const allToolCalls = steps.flatMap(step => step.toolCalls);

  console.log(`Total tool calls made: ${allToolCalls.length}`);

  allToolCalls.forEach((toolCall, index) => {
    console.log(`\n[Tool Call ${index + 1}]`);
    console.log(`Tool: ${toolCall.toolName}`);
    
    // Use 'args' here. If TS complains, it's often because of the 
    // union type, so we cast it or use a check.
    const args = (toolCall as any).args; 
    console.log(`Args:`, args);
  });
}

main();
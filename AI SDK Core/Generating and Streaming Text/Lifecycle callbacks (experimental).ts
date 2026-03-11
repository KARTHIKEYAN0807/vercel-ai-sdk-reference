import { generateText, tool } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const result = await generateText({
    model: ollama('llama3.2'),
    prompt: 'What is the weather in San Francisco?',
    
    tools: {
      getWeather: tool({
        description: 'Get the current weather for a specific location',
        parameters: z.object({
          location: z.string().describe('The city and state, e.g., San Francisco, CA'),
        }),
        execute: async ({ location }: { location: string }) => {
          console.log(`\n[API] Fetching weather for ${location}...`);
          return { temperature: 72, condition: 'Sunny', location };
        },
      } as any),
    },

    experimental_onStart({ model }) {
      console.log('Generation started', { model: model.modelId });
    },

    experimental_onStepStart({ stepNumber, messages }) {
      console.log(`Step ${stepNumber} starting`, { messages: messages.length });
    },

    experimental_onToolCallStart({ toolCall }) {
      console.log(`Tool call starting: ${toolCall.toolName}`, { id: toolCall.toolCallId });
    },

    experimental_onToolCallFinish({ toolCall, durationMs, success }) {
      console.log(`Tool call finished: ${toolCall.toolName} (${durationMs}ms)`, { success });
    },

    onStepFinish({ stepNumber, finishReason, usage }) {
      console.log(`Step ${stepNumber} finished`, { finishReason, tokens: usage.totalTokens });
    },
  });

  console.log('\nFinal Output:', result.text);
}

main();
import { streamText, tool } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const result = streamText({
    model: ollama('llama3.2'),
    prompt: 'What are some San Francisco tourist attractions?',
    tools: {
      cityAttractions: tool({
        description: 'Get tourist attractions for a specific city',
        parameters: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => ({
          attractions: ['Golden Gate Bridge', 'Alcatraz', 'Pier 39'],
        }),
      } as any),
    },
  });

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'start': {
        console.log('--- Stream Started ---');
        break;
      }
      case 'start-step': {
        console.log('\n[Step Started]');
        break;
      }
      case 'text-start': {
        break;
      }
      case 'text-delta': {
        process.stdout.write(part.text);
        break;
      }
      case 'text-end': {
        break;
      }
      case 'reasoning-start': {
        break;
      }
      case 'reasoning-delta': {
        break;
      }
      case 'reasoning-end': {
        break;
      }
      case 'source': {
        break;
      }
      case 'file': {
        break;
      }
      case 'tool-call': {
        switch (part.toolName) {
          case 'cityAttractions': {
            const input = part.input as { city: string };
            console.log(`\n[Tool Call] Fetching attractions for: ${input.city}`);
            break;
          }
        }
        break;
      }
      case 'tool-input-start': {
        break;
      }
      case 'tool-input-delta': {
        break;
      }
      case 'tool-input-end': {
        break;
      }
      case 'tool-result': {
        switch (part.toolName) {
          case 'cityAttractions': {
            console.log(`[Tool Result] Successfully fetched attractions data.`);
            break;
          }
        }
        break;
      }
      case 'tool-error': {
        console.error(`\n[Tool Error]`, part.error);
        break;
      }
      case 'finish-step': {
        console.log('\n[Step Finished]');
        break;
      }
      case 'finish': {
        console.log('\n--- Stream Finished ---');
        console.log('Tokens Used:', part.totalUsage.totalTokens);
        break;
      }
      case 'error': {
        console.error(`\n[Stream Error]`, part.error);
        break;
      }
      case 'raw': {
        break;
      }
    }
  }
}

main();
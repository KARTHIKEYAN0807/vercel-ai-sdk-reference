import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// Initialize Langfuse observability
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Testing Stream Error Handling ---');

  try {
    const { fullStream } = streamText({
      model: ollama('llama3.2'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
      
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'stream-error-handling-test',
      },
    });

    console.log('\n[Streaming Output]:\n');

    // Iterate over the detailed stream parts
    for await (const part of fullStream) {
      switch (part.type) {
        // 1. Handle normal text chunks flowing in
        case 'text-delta': {
          // Changed from part.textDelta to part.text
          process.stdout.write(part.text); 
          break;
        }

        // 2. Handle a mid-stream failure (e.g., Ollama crashes mid-sentence)
        case 'error': {
          const error = part.error;
          console.error('\n\n[Stream Error Intercepted]:', error);
          break;
        }

        // 3. Handle a forced termination (e.g., abortSignal triggered)
        case 'abort': {
          console.error('\n\n[Stream Aborted]: The connection was violently severed.');
          break;
        }

        // 4. Handle tool execution failures (if you were using AI tools)
        case 'tool-error': {
          const error = part.error;
          console.error(`\n\n[Tool Error Intercepted (${part.toolName})]:`, error);
          break;
        }

        // 5. Clean finish
        case 'finish': {
          console.log('\n\n[Stream Finished Successfully]');
          break;
        }
      }
    }

  } catch (error: unknown) {
    // This catches errors that happen before the stream even starts
    // (e.g., Ollama isn't running, or the port is blocked)
    if (error instanceof Error) {
      console.error('\n[Fatal Initialization Error]:', error.message);
    } else {
      console.error('\n[Unknown Error]:', error);
    }
  } finally {
    // Flush the partial stream traces to Langfuse
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
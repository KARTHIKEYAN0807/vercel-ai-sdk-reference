import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// Initialize Langfuse observability
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Testing Error Handling ---');

  try {
    const { text } = await generateText({
      model: ollama('llama3.2'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
      
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'error-handling-test',
      },
    });

    console.log('\n[Model Output]:\n');
    console.log(text);

  } catch (error: unknown) {
    // 1. Handle the error gracefully without crashing the application
    if (error instanceof Error) {
      console.error('\n[Error Caught]:', error.name);
      console.error('[Message]:', error.message);
      
      // 2. The AI SDK often attaches the underlying network or parsing issue to the 'cause' property
      if ('cause' in error && error.cause) {
        console.error('[Cause]:', error.cause);
      }
    } else {
      console.error('\n[Unknown Error]:', error);
    }
  } finally {
    // 3. Ensure traces are sent even if an error is thrown
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
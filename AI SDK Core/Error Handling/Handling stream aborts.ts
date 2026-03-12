import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse observability
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Testing Stream Callbacks (onFinish / onAbort) ---');

  try {
    const { textStream } = streamText({
      model: ollama('llama3.2'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
      
      // 2. The Abort Callback: Fires if the connection drops or you trigger an AbortSignal
      onAbort: ({ steps }) => {
        console.log('\n\n[Callback Triggered]: Stream aborted after', steps.length, 'steps');
      },
      
      // 3. The Finish Callback: Fires when the model successfully completes the response
      onFinish: ({ usage }) => {
        console.log('\n\n[Callback Triggered]: Stream completed normally!');
        // You also get access to token usage metadata right here!
        console.log(`Total Tokens Used: ${usage.totalTokens}`);
      },

      experimental_telemetry: {
        isEnabled: true,
        functionId: 'stream-callbacks-test',
      },
    });

    console.log('\n[Streaming Output]:\n');

    // Iterate over the simple text stream (just the words, no metadata)
    for await (const textPart of textStream) {
      process.stdout.write(textPart);
    }

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    // Flush telemetry to Langfuse
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
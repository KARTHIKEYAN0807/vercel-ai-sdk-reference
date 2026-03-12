import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse via standard OpenTelemetry
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Testing AbortSignal (Traced by Langfuse) ---');

  try {
    const result = await generateText({
      model: ollama('llama3.2'),
      // Asking for a massive response to guarantee it takes a long time
      prompt: 'Write a comprehensive, 10-page essay on the history of video games.',
      
      // 2. The Kill Switch: Aborts the request if it exceeds 3000 milliseconds (3 seconds).
      abortSignal: AbortSignal.timeout(3000),
      
      // 3. Vercel AI SDK automatically detects Langfuse running
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'abort-signal-langfuse',
      },
    });

    console.log('\n--- Model Response ---');
    console.log(result.text);

  } catch (error: any) {
    // 4. Catching the timeout gracefully
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.error('\n[System Warning]: Generation was violently aborted because it exceeded the 3-second limit.');
    } else {
      console.error('\n[Error]:', error.message);
    }
  } finally {
    // 5. Perfectly flush the aborted trace data before shutting down
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
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
  console.log('--- Generating with Custom Headers (Traced by Langfuse) ---');

  try {
    const result = await generateText({
      model: ollama('llama3.2'),
      prompt: 'Invent a new holiday and describe its traditions.',
      
      // The Headers: These are injected directly into the underlying HTTP POST request.
      // Useful for tracking, routing through proxies, or sending organization IDs.
      headers: {
        'Prompt-Id': 'holiday-generator-v1',
        'X-App-Platform': 'Windows-Laptop-Dev',
      },
      
      // 2. Vercel AI SDK automatically detects OpenTelemetry running in the background!
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'headers-langfuse-test',
      },
    });

    console.log('\n--- Model Response ---');
    console.log(result.text);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    // 3. Flushes exactly what is needed to Langfuse, then closes cleanly
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
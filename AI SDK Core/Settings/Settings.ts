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
  console.log('--- Generating with Advanced Settings (Traced by Langfuse) ---');

  try {
    const result = await generateText({
      model: ollama('llama3.2'),
      
      // The Cap: Keeps the model from rambling and saves local system memory
      maxOutputTokens: 512, 
      
      // The Focus: Makes the model highly deterministic and predictable
      temperature: 0.3, 
      
      // The Safety Net: Automatically retries if the local connection drops
      maxRetries: 5, 
      
      prompt: 'Invent a new holiday and describe its traditions.',
      
      // 2. Vercel AI SDK detects OpenTelemetry and attaches the data automatically
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'holiday-settings-langfuse',
      },
    });

    console.log('\n--- Model Response ---');
    console.log(result.text);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    // 3. Gracefully flush and shut down so the script doesn't exit before sending data
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
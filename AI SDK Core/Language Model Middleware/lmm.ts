import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText, wrapLanguageModel, defaultSettingsMiddleware } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Testing Language Model Middleware ---');

  // 1. Wrap the model with valid model-level settings only
  const lockedOllamaModel = wrapLanguageModel({
    model: ollama('llama3.2'),
    middleware: defaultSettingsMiddleware({
      settings: {
        temperature: 0.1,       // Valid: Sent to the model
        maxOutputTokens: 250,   // Valid: Sent to the model
      }
    })
  });

  try {
    const result = await generateText({
      model: lockedOllamaModel, 
      prompt: 'What are the specs of a PC with an AMD Ryzen 7 5800X and RTX 4060 Ti?',
      
      // 2. Execution-level settings must stay here!
      maxRetries: 3, 
      
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'ollama-middleware-test',
      },
    });

    console.log('\n[Model Output]:\n');
    console.log(result.text);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
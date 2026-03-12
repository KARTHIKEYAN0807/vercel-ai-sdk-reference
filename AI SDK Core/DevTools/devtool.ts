import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText, wrapLanguageModel } from 'ai';
// Import the DevTools middleware
import { devToolsMiddleware } from '@ai-sdk/devtools';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse for Cloud/Production Observability
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- DevTools + Langfuse + Ollama ---');

  // 2. Wrap the local Ollama model with the DevTools middleware
  // This intercepts the request before it hits Ollama and logs it to the local UI
  const localModel = wrapLanguageModel({
    model: ollama('llama3.2'),
    middleware: devToolsMiddleware(),
  });

  try {
    // 3. Execute the AI call using the wrapped model
    const result = await generateText({
      model: localModel, 
      prompt: 'Write a short, professional email to a client named Sarah, thanking her for the recent meeting about the Q3 marketing strategy.',
      
      // Langfuse will still capture this simultaneously via OpenTelemetry
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'draft-client-email',
      },
    });

    console.log('\n[Generated Email]:\n');
    console.log(result.text);

    console.log('\n[Tip] Open a new terminal and run `npx @ai-sdk/devtools` to view this trace locally!');

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
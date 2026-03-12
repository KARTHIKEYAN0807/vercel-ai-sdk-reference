import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { 
  generateText, 
  customProvider, 
  createProviderRegistry, 
  wrapLanguageModel, 
  defaultSettingsMiddleware 
} from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

// ====================================================================
// 1. CREATE A CUSTOM PROVIDER FOR YOUR LAPTOP
// ====================================================================
const myLocalProvider = customProvider({
  // Only the models listed here will be accessible to the app!
  languageModels: {
    // Alias 1: "fast" -> Just the standard Llama 3.2 model
    'fast': ollama('llama3.2'),

    // Alias 2: "strict" -> Llama 3.2, but strictly wrapped with middleware!
    'strict': wrapLanguageModel({
      model: ollama('llama3.2'),
      middleware: defaultSettingsMiddleware({
        settings: {
          temperature: 0.1,
          maxOutputTokens: 100, // Keep responses very short
        }
      })
    })
  },
  // If we ask for a model that isn't listed above, fall back to default Ollama
  fallbackProvider: ollama, 
});

// ====================================================================
// 2. CREATE THE CENTRAL REGISTRY
// ====================================================================
const registry = createProviderRegistry({
  // We register our custom provider under the prefix "local"
  local: myLocalProvider,
});


async function main() {
  console.log('--- Testing Provider Registry ---');

  try {
    // ====================================================================
    // 3. USE THE REGISTRY IN YOUR APP
    // ====================================================================
    // Notice how clean this is! We just ask for "local:strict". 
    // We don't have to import Ollama or configure temperatures here.
    
    const result = await generateText({
      model: registry.languageModel('local:strict'), 
      prompt: 'Name the 3 best PC cases for airflow in 2026. Be extremely brief.',
      
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'provider-registry-test',
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
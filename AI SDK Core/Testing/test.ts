import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText, LanguageModel } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import type { LanguageModelV3GenerateResult } from '@ai-sdk/provider';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function generateStreamTitle(model: LanguageModel) {
  const { text } = await generateText({
    model: model,
    prompt: 'Generate a hype, click-worthy YouTube stream title for a Warzone Season 5 live stream. Keep it under 10 words.',
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'generate-stream-title',
    },
  });
  return text;
}

async function main() {
  console.log('\n--- 🧪 STEP 1: Running the Automated Test (Mock) ---');

  const testModel = new MockLanguageModelV3({
    doGenerate: async (): Promise<LanguageModelV3GenerateResult> => ({
      content: [{ type: 'text', text: 'TEST TITLE: Warzone Season 5 LIVE!' }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage: {
        inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
        outputTokens: { total: 10, text: 10, reasoning: 0 }
      },
      warnings: [],
      // rawCall has been deleted!
    }),
  });

  try {
    const testResult = await generateStreamTitle(testModel);
    
    if (testResult === 'TEST TITLE: Warzone Season 5 LIVE!') {
      console.log('✅ UNIT TEST PASSED: Application logic handles AI output correctly.');
    } else {
      console.error('❌ UNIT TEST FAILED: Unexpected output.');
    }

    console.log('\n--- 🚀 STEP 2: Running the Production Code (Ollama) ---');
    console.log('Pinging local Llama 3.2 model. Please wait...\n');
    
    const prodResult = await generateStreamTitle(ollama('llama3.2'));
    
    console.log('✅ PRODUCTION RESULT:');
    console.log(prodResult);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
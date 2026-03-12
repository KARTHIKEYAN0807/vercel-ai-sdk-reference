import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse for Telemetry
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

// Mock function to simulate a MongoDB database operation in a MERN backend
async function saveToDatabase(document: any) {
  console.log('\n[MongoDB] Asynchronously saving record to database...');
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  console.log('[MongoDB] Successfully saved 1 document into "interview_prep" collection.');
}

async function main() {
  console.log('--- Event Listeners (Ollama + Langfuse) ---');

  try {
    // 2. Execute the AI call with an Event Listener
    const { text } = await generateText({
      model: ollama('llama3.2'),
      prompt: 'Explain the concept of the Virtual DOM in React in 2 short sentences. This is for a technical interview preparation tool.',
      
      // 3. The Event Listener
      onFinish: async (event) => {
        console.log('\n[Event Triggered]: onFinish callback activated!');
        
        // FIX: Handle both Legacy and V3 Specification token counts gracefully
        const legacyUsage = event.usage as any;
        const v3Usage = event.usage as any;

        const dbRecord = {
          // If the provider uses the new V3 inputTokens object, use that. Otherwise fallback.
          promptTokens: v3Usage.inputTokens?.total ?? legacyUsage.promptTokens ?? 0,
          completionTokens: v3Usage.outputTokens?.total ?? legacyUsage.completionTokens ?? 0,
          finishReason: event.finishReason,
          generatedText: event.text,
          timestamp: new Date().toISOString()
        };

        // Fire off the background database save
        await saveToDatabase(dbRecord);
      },

      experimental_telemetry: {
        isEnabled: true,
        functionId: 'react-virtual-dom-explanation',
      },
    });

    // 4. Main Thread Execution
    console.log('\n[Main Thread]: AI generation complete. Sending to user UI...');
    console.log(`[Response]: ${text}`);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    setTimeout(async () => {
      console.log('\n[System] Flushing telemetry to Langfuse...');
      await sdk.shutdown();
    }, 1500);
  }
}

main().catch(console.error);
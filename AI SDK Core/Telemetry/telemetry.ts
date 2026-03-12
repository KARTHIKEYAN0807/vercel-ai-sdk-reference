import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse Observability via OpenTelemetry
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Advanced Telemetry (Ollama + Langfuse) ---');

  try {
    // 2. Execute the AI call with advanced tracking
    const result = await generateText({
      model: ollama('llama3.2'),
      prompt: 'Generate one technical interview question for a MERN stack developer focused on optimizing React performance. Provide the question and a brief expected answer.',
      
      // 3. Telemetry Configuration
      experimental_telemetry: { 
        isEnabled: true,
        // The unique identifier to find this specific operation
        functionId: 'mern-interview-generator', 
        
        // Custom metadata that gets sent to Langfuse for filtering and analytics
        metadata: {
          environment: 'production',
          developerLevel: 'mid-level',
          framework: 'React',
          department: 'engineering-hiring'
        },
      },
    });

    console.log('\n[Generated Content]:\n');
    console.log(result.text);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    // 4. Ensure traces are completely exported before shutdown
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { Laminar, getTracer } from '@lmnr-ai/lmnr';

// This grabs the key you just generated
Laminar.initialize({ projectApiKey: process.env.LMNR_PROJECT_API_KEY });

async function main() {
  console.log('--- Generating Stream (Traced by Laminar) ---');

  const result = streamText({
    model: ollama('llama3.2'),
    prompt: 'Invent a new holiday and describe its traditions.',
    
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'invent-holiday-stream',
      tracer: getTracer(),
    },
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  
  console.log(); 
  
  // FIX: Give the background process 2 seconds to send the trace to Laminar before shutting down
  console.log('\n[System] Flushing telemetry to Laminar...');
  await new Promise(resolve => setTimeout(resolve, 2000));
}

main().catch(console.error);
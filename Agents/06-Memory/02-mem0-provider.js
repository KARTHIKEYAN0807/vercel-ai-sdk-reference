import { createMem0 } from '@mem0/vercel-ai-provider';
import { ToolLoopAgent } from 'ai';
import 'dotenv/config';

async function runMem0Provider() {
  console.log("Starting Memory: Mem0 Provider Wrapper...\n");

  // We wrap the standard OpenAI provider inside Mem0
  const mem0 = createMem0({
    provider: 'openai',
    mem0ApiKey: process.env.MEM0_API_KEY,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Notice we pass the User ID directly into the model wrapper. 
  // Mem0 will automatically read/write to this user's cloud memory profile!
  const agent = new ToolLoopAgent({
    model: mem0('gpt-4o', { user_id: 'user_9942' }),
  });

  console.log("Prompt: 'I just moved to Chennai. Remember that.'");

  const result = await agent.generate({
    prompt: 'I just moved to Chennai. Remember that.',
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

// runMem0Provider(); // Requires Mem0 API Key
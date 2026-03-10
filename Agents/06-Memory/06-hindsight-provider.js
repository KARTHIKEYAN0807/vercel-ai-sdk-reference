import { HindsightClient } from '@vectorize-io/hindsight-client';
import { createHindsightTools } from '@vectorize-io/hindsight-ai-sdk';
import { ToolLoopAgent, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import 'dotenv/config';

async function runHindsightProvider() {
  console.log("Starting Memory: Hindsight Provider...\n");

  // Initialize the connection to Hindsight's servers
  const client = new HindsightClient({ 
    baseUrl: process.env.HINDSIGHT_API_URL 
  });

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    stopWhen: stepCountIs(10),
    instructions: 'You are a helpful assistant with long-term memory.',
    
    // We create the tools and pass the specific User ID (bankId) 
    tools: createHindsightTools({ 
      client, 
      bankId: 'user-123' 
    }),
  });

  console.log("Prompt: 'Remember that I am learning the Vercel AI SDK.'");

  const result = await agent.generate({
    prompt: 'Remember that I am learning the Vercel AI SDK.',
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

// runHindsightProvider(); // Requires @vectorize-io/hindsight packages and API Key
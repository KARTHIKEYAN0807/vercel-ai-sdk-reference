import { ToolLoopAgent } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runDynamicModel() {
  console.log("Starting Call Options: Dynamic Model Selection...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'), // Default model
    
    callOptionsSchema: z.object({
      complexity: z.enum(['simple', 'complex']),
    }),

    prepareCall: ({ options, ...settings }) => {
      const selectedModel = options.complexity === 'simple' 
        ? google('gemini-2.5-flash') 
        : google('gemini-3.1-pro');
      
      console.log(`[Configuring Agent] Task is ${options.complexity}. Selected model: ${selectedModel.modelId}`);
      
      return {
        ...settings,
        model: selectedModel,
      };
    },
  });

  // Test the simple route
  console.log("Running simple task...");
  await agent.generate({
    prompt: 'What is 2+2?',
    options: { complexity: 'simple' },
  });

  // Test the complex route (Note: this might fail on free tier if Pro is locked to 0)
  console.log("\nRunning complex task...");
  try {
    await agent.generate({
      prompt: 'Explain quantum entanglement in 1 sentence.',
      options: { complexity: 'complex' },
    });
  } catch(e) {
    console.log("(Expected rate limit error for Pro model on free tier)");
  }
}

runDynamicModel();
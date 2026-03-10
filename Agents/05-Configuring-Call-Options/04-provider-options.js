import { ToolLoopAgent } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runProviderOptions() {
  console.log("Starting Call Options: Provider-Specific Settings...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    callOptionsSchema: z.object({
      taskDifficulty: z.enum(['low', 'high']),
    }),

    prepareCall: ({ options, ...settings }) => {
      // If the task is hard, we turn the temperature way down so it doesn't hallucinate
      const temperature = options.taskDifficulty === 'high' ? 0.0 : 0.8;
      console.log(`[Configuring Agent] Difficulty: ${options.taskDifficulty}. Setting temperature to: ${temperature}`);
      
      return {
        ...settings,
        // We can override standard settings like temperature here
        temperature: temperature,
        
        
      };
    },
  });

  await agent.generate({
    prompt: 'Write a quick poem.',
    options: { taskDifficulty: 'low' }, // Will use high temperature for creativity
  });
  
  console.log("\nTask Complete.");
}

runProviderOptions();
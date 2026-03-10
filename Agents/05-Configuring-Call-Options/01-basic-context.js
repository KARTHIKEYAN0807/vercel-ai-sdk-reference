import { ToolLoopAgent } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runBasicContext() {
  console.log("Starting Call Options: Basic Context Injection...\n");

  const supportAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    instructions: 'You are a helpful customer support agent.',
    
    // 1. Define exactly what variables this agent requires at runtime
    callOptionsSchema: z.object({
      userId: z.string(),
      accountTier: z.enum(['free', 'premium', 'enterprise']),
    }),

    // 2. Intercept those variables and rewrite the instructions
    prepareCall: ({ options, ...settings }) => {
      console.log(`[Configuring Agent] User ID: ${options.userId} | Tier: ${options.accountTier}`);
      return {
        ...settings,
        instructions: settings.instructions + 
          `\n\nUser Context:` +
          `\n- User ID: ${options.userId}` +
          `\n- Account Tier: ${options.accountTier}` +
          `\n\nCRITICAL: If they are a 'premium' user, address them as 'VIP' and offer priority support.`
      };
    },
  });

  // 3. We pass the 'options' object alongside the prompt!
  const result = await supportAgent.generate({
    prompt: 'How do I reset my password?',
    options: {
      userId: 'user_9942',
      accountTier: 'premium',
    },
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

runBasicContext();
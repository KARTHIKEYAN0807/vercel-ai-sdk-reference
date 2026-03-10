import { ToolLoopAgent, Output, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runStructuredAgent() {
  console.log("Initializing the Structured Output Agent...\n");

  const analysisAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    // 1. We force the agent to return this EXACT JSON structure, never plain text.
    output: Output.object({
      schema: z.object({
        sentiment: z.enum(['positive', 'neutral', 'negative']),
        summary: z.string(),
        keyPoints: z.array(z.string()),
      }),
    }),
    
    stopWhen: stepCountIs(5),

    tools: {
      fetchCustomerReviews: tool({
        description: 'Get recent reviews for a product',
        inputSchema: z.object({
          productName: z.string(),
        }),
        execute: async ({ productName }) => {
          console.log(`[Tool] Fetching reviews for ${productName}...`);
          return { 
            reviews: [
              "The battery life is terrible, it died in 2 hours.",
              "Screen is nice but it gets really hot.",
              "I regret buying this phone."
            ] 
          };
        },
      }),
    }
  });

  console.log("Prompt: 'Analyze customer feedback for the new XYZ Phone'\n");

  // Notice we destructure { output } instead of { text } here
  const { output } = await analysisAgent.generate({
    prompt: 'Analyze customer feedback for the new XYZ Phone',
  });

  console.log("--- Final Structured JSON Output ---");
  // The result is a perfect JavaScript object, ready to be saved to a database
  console.log(JSON.stringify(output, null, 2));
}

runStructuredAgent();
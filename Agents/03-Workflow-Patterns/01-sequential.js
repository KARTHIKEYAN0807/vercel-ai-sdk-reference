import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runSequentialPattern() {
  console.log("Starting Sequential Workflow...\n");
  const model = google('gemini-2.5-flash');

  // STEP 1: Generate the initial copy
  console.log("Step 1: AI is writing the marketing copy...");
  const { text: copy } = await generateText({
    model,
    prompt: `Write persuasive marketing copy for: A new smart coffee mug.`,
  });
  console.log("\nDraft Copy:\n", copy);

  // STEP 2: A second AI analyzes the output of the first AI
  console.log("\nStep 2: A second AI is evaluating the copy...");
  const { output: qualityMetrics } = await generateText({
    model,
    output: Output.object({
      schema: z.object({
        hasCallToAction: z.boolean(),
        emotionalAppeal: z.number().min(1).max(10),
        clarity: z.number().min(1).max(10),
      }),
    }),
    prompt: `Evaluate this marketing copy. 
    Copy: ${copy}`,
  });

  console.log("\nFinal Quality Check:", qualityMetrics);
}

runSequentialPattern();

import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runEvaluatorPattern() {
  console.log("Starting Evaluator-Optimizer Workflow...\n");
  const model = google('gemini-2.5-flash');
  
  let currentDraft = "The restaurant was okay. I ate food.";
  let iterations = 0;
  const MAX_ITERATIONS = 3;

  console.log(`Initial Draft: "${currentDraft}"\n`);

  while (iterations < MAX_ITERATIONS) {
    console.log(`--- Iteration ${iterations + 1} ---`);
    
    // STEP 1: The Evaluator grades the draft
    const { output: evaluation } = await generateText({
      model,
      system: 'You are a strict English Professor grading a restaurant review.',
      output: Output.object({
        schema: z.object({
          score: z.number().min(1).max(10),
          isDescriptive: z.boolean(),
          criticism: z.string(),
        }),
      }),
      prompt: `Grade this review. Is it highly descriptive and engaging? \nReview: ${currentDraft}`,
    });

    console.log(`[Evaluator] Score: ${evaluation.score}/10. Criticism: ${evaluation.criticism}`);

    // STEP 2: The Loop Condition
    if (evaluation.score >= 8 && evaluation.isDescriptive) {
      console.log("\n[Success] Draft passed quality control!");
      break; 
    }

    console.log("[Optimizer] Rewriting based on feedback...\n");
    
    // STEP 3: The Optimizer rewrites it based on the criticism
    const { text: improvedDraft } = await generateText({
      model,
      system: 'You are a professional food critic.',
      prompt: `Rewrite this review to be better, incorporating this feedback: "${evaluation.criticism}". 
      Original Draft: ${currentDraft}`,
    });

    currentDraft = improvedDraft;
    iterations++;
  }

  console.log("\n--- Final Published Review ---");
  console.log(currentDraft);
}

runEvaluatorPattern();
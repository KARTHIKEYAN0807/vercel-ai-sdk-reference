import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runRoutingPattern(customerQuery) {
  console.log(`Analyzing Customer Query: "${customerQuery}"\n`);
  
  // We use our fast, cheap model just to act as the "Router"
  const routerModel = google('gemini-2.5-flash');

  // STEP 1: The Router AI (Classifies the intent AND the complexity)
  const { output: classification } = await generateText({
    model: routerModel,
    output: Output.object({
      schema: z.object({
        reasoning: z.string(),
        department: z.enum(['sales', 'tech_support', 'refunds']),
        complexity: z.enum(['simple', 'complex']), // <--- Adding complexity!
      }),
    }),
    prompt: `Classify this customer query. Decide if it is a simple question or a complex technical issue: "${customerQuery}"`,
  });

  console.log(`[Router Decision] Department: ${classification.department.toUpperCase()}`);
  console.log(`[Router Decision] Complexity: ${classification.complexity.toUpperCase()}`);
  console.log(`[Router Reasoning] ${classification.reasoning}\n`);

  // STEP 2: Dynamically select the ACTUAL model based on the complexity
  let selectedWorkerModel;
  if (classification.complexity === 'simple') {
    console.log("-> Routing to fast/cheap model (Gemini Flash)...");
    selectedWorkerModel = google('gemini-2.5-flash');
  } else {
    console.log("-> Routing to advanced/expensive model (Gemini Pro)...");
    selectedWorkerModel = google('gemini-3.1-pro');
  }

  // Set the specific system prompt based on the department
  let specificSystemPrompt = "";
  if (classification.department === 'sales') {
    specificSystemPrompt = "You are a friendly salesperson. Convince the user to buy the premium tier.";
  } else if (classification.department === 'tech_support') {
    specificSystemPrompt = "You are a tech wizard. Provide step-by-step troubleshooting.";
  } else {
    specificSystemPrompt = "You are a strict refund agent. Quote the 30-day return policy.";
  }

  // STEP 3: The Specialized Worker AI (using the dynamically chosen model) generates the response
  const { text: finalResponse } = await generateText({
    model: selectedWorkerModel, // <--- Here is where we swap the model!
    system: specificSystemPrompt,
    prompt: customerQuery,
  });

  console.log("\n--- Final Specialized Response ---");
  console.log(finalResponse);
}

// Try a complex query
runRoutingPattern("My screen is completely black, and when I plug it in, the motherboard LED flashes red 3 times and beeps.");
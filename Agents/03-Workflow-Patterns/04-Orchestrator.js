import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runOrchestratorPattern() {
  console.log("Starting Orchestrator-Worker Workflow...\n");
  const model = google('gemini-2.5-flash');

  const featureRequest = "Create a login form with email and password fields, and a styling file.";

  console.log("Step 1: The Orchestrator (Manager) creates a plan...");
  
  // The Manager AI creates a strict plan of action
  const { output: plan } = await generateText({
    model,
    system: 'You are a Software Architect planning a new feature.',
    output: Output.object({
      schema: z.object({
        filesToCreate: z.array(
          z.object({
            filename: z.string(),
            purpose: z.string(),
          })
        ),
      }),
    }),
    prompt: `Analyze this feature request and create a file plan: ${featureRequest}`,
  });

  console.log("\n--- The Manager's Plan ---");
  console.log(plan.filesToCreate);
  console.log("\nStep 2: Assigning workers to build each file...\n");

  // The Manager assigns a Worker AI to build each file based on the plan
  const completedWork = await Promise.all(
    plan.filesToCreate.map(async (fileTask) => {
      const { text: code } = await generateText({
        model,
        system: "You are an expert frontend developer. Only output code, no explanations.",
        prompt: `Write the code for ${fileTask.filename}. The purpose is: ${fileTask.purpose}`,
      });
      return { file: fileTask.filename, code };
    })
  );

  console.log("--- Final Project Delivered by Workers ---");
  completedWork.forEach(work => {
    console.log(`\n// --- ${work.file} ---`);
    console.log(work.code.substring(0, 150) + "... [Code Truncated]");
  });
}

runOrchestratorPattern();
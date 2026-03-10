import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runParallelPattern() {
  console.log("Starting Parallel Workflow...\n");
  const model = google('gemini-2.5-flash');
  
  const badCode = `
    function checkUser(user) {
      if(user.password == '1234') { return true; }
      while(true) { console.log('loading'); }
    }
  `;

  console.log("Analyzing code for Security, Performance, and Quality SIMULTANEOUSLY...\n");

  // We fire all three API calls at the exact same time using Promise.all
  const [securityReview, performanceReview, qualityReview] = await Promise.all([
    
    // AI 1: Security Expert
    generateText({
      model,
      system: 'You are a strict code security expert.',
      output: Output.object({
        schema: z.object({ vulnerabilities: z.array(z.string()) }),
      }),
      prompt: `Review this code for security flaws: ${badCode}`,
    }),

    // AI 2: Performance Expert
    generateText({
      model,
      system: 'You are a performance optimization expert.',
      output: Output.object({
        schema: z.object({ bottlenecks: z.array(z.string()) }),
      }),
      prompt: `Review this code for infinite loops or slow operations: ${badCode}`,
    }),

    // AI 3: Clean Code Expert
    generateText({
      model,
      system: 'You are a clean code advocate.',
      output: Output.object({
        schema: z.object({ improvements: z.array(z.string()) }),
      }),
      prompt: `Review this code for readability and variable naming: ${badCode}`,
    })
  ]);

  console.log("--- Security Findings ---");
  console.log(securityReview.output.vulnerabilities);
  
  console.log("\n--- Performance Findings ---");
  console.log(performanceReview.output.bottlenecks);
  
  console.log("\n--- Quality Findings ---");
  console.log(qualityReview.output.improvements);
}

runParallelPattern();
import { generateText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runManualLoop() {
  console.log("Starting Loop Control: The Manual While Loop...\n");
  
  const model = google('gemini-2.5-flash');
  
  // 1. Manually maintain the conversation history array
  const messages = [{ role: 'user', content: 'What is 10 plus 5?' }];
  
  let step = 0;
  const maxSteps = 5;

  // 2. Build the manual while loop
  while (step < maxSteps) {
    console.log(`[Manual Loop] Running step ${step}...`);

    const result = await generateText({
      model,
      messages,
      tools: {
        calculator: tool({
          description: 'Add two numbers',
          inputSchema: z.object({ a: z.number(), b: z.number() }),
          execute: async ({ a, b }) => ({ sum: a + b }),
        }),
      },
    });

    // 3. Manually push the AI's response (and tool calls) into the history array
    messages.push(...result.response.messages);

    // 4. Manual Stop Condition: If the AI replied with normal text, the job is done
    if (result.text) {
      console.log("\n--- Final Manual Loop Output ---");
      console.log(result.text);
      break; 
    }

    step++;
  }
}

runManualLoop();
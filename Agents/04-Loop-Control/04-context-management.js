import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runContextManagement() {
  console.log("Starting Loop Control: Context Management...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    stopWhen: stepCountIs(5),
    
    // Intercept the memory array before the next step starts
    prepareStep: async ({ messages }) => {
      // If the conversation history is getting too long (over 10 messages)
      if (messages.length > 10) {
        console.log(`[Memory Manager] Trimming memory from ${messages.length} down to 6 messages to save tokens.`);
        return {
          messages: [
            messages[0], // ALWAYS keep the system prompt at index 0!
            ...messages.slice(-5), // Only keep the 5 most recent messages
          ],
        };
      }
      return {};
    },

    tools: {
      fetchData: tool({
        description: 'Fetch some data',
        inputSchema: z.object({}),
        execute: async () => ({ data: "Here is some data." }),
      })
    }
  });

  const result = await agent.generate({ prompt: 'Fetch data repeatedly.' });
  console.log("\nTask Complete. Steps:", result.steps.length);
}

runContextManagement();
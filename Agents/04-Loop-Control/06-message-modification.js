import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runMessageModification() {
  console.log("Starting Loop Control: Message Modification...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    stopWhen: stepCountIs(2),
    
    prepareStep: async ({ messages }) => {
      // Look through the history for massive tool responses
      const processedMessages = messages.map(msg => {
        if (msg.role === 'tool' && msg.content && JSON.stringify(msg.content).length > 100) {
          console.log("\n[Interceptor] Huge tool response detected! Truncating it to save tokens...");
          // Truncate the massive payload before the AI sees it
          return {
            ...msg,
            content: "Data was too large. Summary: It contains user logs.", 
          };
        }
        return msg;
      });

      return { messages: processedMessages };
    },

    tools: {
      getMassiveLogs: tool({
        description: 'Get server logs',
        inputSchema: z.object({}),
        execute: async () => ({ 
          // Pretend this is a massive 10MB string that would crash the AI
          logs: "ERROR 1 ERROR 2 ERROR 3 ERROR 4 ".repeat(50) 
        }),
      })
    }
  });

  await agent.generate({ prompt: 'Get the server logs.' });
  console.log("\nTask Complete.");
}

runMessageModification();
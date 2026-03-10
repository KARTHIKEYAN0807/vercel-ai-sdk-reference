import { ToolLoopAgent, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

// Our "Fake Database"
const userDatabase = {
  'user_123': ["User's name is Karthik.", "User is learning Vercel AI SDK."],
};

async function runCustomMemory() {
  console.log("Starting Memory: Custom Built Tool...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    stopWhen: stepCountIs(5),
    
    instructions: `You are an assistant with a memory database. 
    CRITICAL RULES:
    1. If the user tells you a fact, you MUST immediately call the 'saveMemory' tool.
    2. If the user asks a question about themselves, you MUST immediately call the 'readMemory' tool.`,
    
    callOptionsSchema: z.object({ userId: z.string() }),

    // THE FIX: We define the tools INSIDE prepareCall so they have access to options.userId!
    prepareCall: ({ options, ...settings }) => {
      return {
        ...settings,
        tools: {
          readMemory: tool({
            description: 'Read known facts about the user from the database.',
            inputSchema: z.object({}), 
            execute: async () => {
              const memories = userDatabase[options.userId] || [];
              console.log(`\n[Database] AI read memory for ${options.userId}: ${memories.join(' | ')}`);
              return { facts: memories };
            },
          }),

          saveMemory: tool({
            description: 'Save a new fact about the user to the database.',
            inputSchema: z.object({
              fact: z.string().describe("The fact to remember"),
            }),
            execute: async ({ fact }) => {
              // Now options.userId works perfectly!
              if (!userDatabase[options.userId]) userDatabase[options.userId] = [];
              userDatabase[options.userId].push(fact);
              console.log(`\n[Database] AI saved new memory: "${fact}"`);
              return { status: "Saved." };
            },
          }),
        }
      };
    }
  });

  console.log("--- Conversation Turn 1 ---");
  const turn1 = await agent.generate({
    prompt: 'Hi, I just bought an Ant Esports GM320 wired mouse. Can you remember that for me?',
    options: { userId: 'user_123' }
  });
  console.log("Agent replied:", turn1.text);

  console.log("\n--- Conversation Turn 2 ---");
  const turn2 = await agent.generate({
    prompt: 'What kind of mouse do I own?',
    options: { userId: 'user_123' }
  });

  console.log("\n--- Final Output ---");
  console.log(turn2.text);
}

runCustomMemory();
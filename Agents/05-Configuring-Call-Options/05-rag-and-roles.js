import { ToolLoopAgent, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

// Simulating a Vector Database Search (RAG)
async function mockVectorSearch(query) {
  console.log(`[RAG Database] Fetching documents matching: "${query}"...`);
  return "Policy: Refunds are only allowed within 30 days of purchase.";
}

async function runRagAndRoles() {
  console.log("Starting Call Options: RAG & Security Roles...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    callOptionsSchema: z.object({
      userRole: z.enum(['admin', 'guest']),
      query: z.string(),
    }),

    tools: {
      readDatabase: tool({
        description: 'Read from the database',
        inputSchema: z.object({}),
        execute: async () => ({ data: "Reading allowed." }),
      }),
      deleteDatabaseRecord: tool({
        description: 'Delete a user from the database',
        inputSchema: z.object({ id: z.string() }),
        execute: async () => ({ status: "Deleted." }),
      }),
    },

    // Notice this prepareCall is async! We can await database calls here.
    prepareCall: async ({ options, ...settings }) => {
      console.log(`[Configuring Agent] Role: ${options.userRole.toUpperCase()}`);
      
      // 1. Fetch RAG Context
      const documents = await mockVectorSearch(options.query);
      
      // 2. Set Tool Permissions (Guests cannot delete records)
      const allowedTools = options.userRole === 'admin' 
        ? ['readDatabase', 'deleteDatabaseRecord'] 
        : ['readDatabase'];
      
      if (options.userRole !== 'admin') {
        console.log(`[Security] User is Guest. Disabling 'deleteDatabaseRecord' tool.`);
      }

      // 3. Inject Context into Instructions
      return {
        ...settings,
        activeTools: allowedTools,
        instructions: `You are a helpful assistant. Answer using ONLY this context: \n\n${documents}`
      };
    },
  });

  console.log("\n--- Sending Prompt ---");
  const result = await agent.generate({
    prompt: 'What is the refund policy? Also, delete user ID 55.',
    options: { 
      userRole: 'guest', 
      query: 'refund policy' 
    },
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

runRagAndRoles();
import { ToolLoopAgent, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runForcedTool() {
  console.log("Starting Loop Control: Forced Tool Pattern...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    // Force the model to ALWAYS call a tool. It is not allowed to just output text.
    toolChoice: 'required', 

    tools: {
      searchInternet: tool({
        description: 'Search the internet for facts',
        inputSchema: z.object({ query: z.string() }),
        execute: async () => ({ fact: 'The sky is blue.' }),
      }),
      
      // The "Done" Tool Pattern
      done: tool({
        description: 'Signal that you have found the final answer',
        inputSchema: z.object({
          finalAnswer: z.string().describe('The final answer to the user query'),
        }),
        // Notice there is NO 'execute' function here!
        // Calling a tool without an execute function immediately breaks the loop.
      }),
    },
  });

  const result = await agent.generate({
    prompt: 'Research the color of the sky and provide the final answer.',
  });

  // Because we forced it to use the 'done' tool, the final answer isn't in result.text.
  // It is trapped inside the unexecuted tool call!
  const finalToolCall = result.staticToolCalls[0]; 
  
  console.log("\n--- Extracted Final Data ---");
  if (finalToolCall?.toolName === 'done') {
    console.log("Final Answer:", finalToolCall.input.finalAnswer);
  } else {
    console.log("Agent failed to call the 'done' tool.");
  }
}

runForcedTool();
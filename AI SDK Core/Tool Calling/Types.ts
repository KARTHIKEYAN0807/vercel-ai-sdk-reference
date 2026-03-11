import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

const myToolSet = {
  // FIX 1: Rename the tools to semantic actions. 
  // Small models rely heavily on the tool's actual property name!
  greetUser: tool({
    description: 'Use this tool to greet the user by name.',
    parameters: z.object({ 
      name: z.string().describe("The user's name, e.g., Alice") 
    }),
    execute: async (args: any) => {
      console.log(`\n[Tool Executing] Greeting for: ${args.name}`);
      return `Hello, ${args.name}!`;
    },
  } as any), 
  
  tellAge: tool({
    description: 'Use this tool to tell the user their age.',
    parameters: z.object({ 
      age: z.number().describe("The user's age as a number") 
    }),
    execute: async (args: any) => {
      console.log(`\n[Tool Executing] Age for: ${args.age}`);
      return `You are ${args.age} years old!`;
    },
  } as any),
};

async function main() {
  const result = await generateText({
    model: ollama('llama3.2'),
    // Increased steps so if it messes up, it has room to try again
    stopWhen: stepCountIs(5), 
    tools: myToolSet as any, 
    
    // FIX 2: Explicitly forbid raw JSON output in the system prompt
    system: 'You are a helpful assistant. You MUST use the provided tools to perform actions. DO NOT output raw JSON or tool definitions in your text response. Only output conversational text to the user.',
    prompt: 'Say hello to Alice and tell her she is 28.',
  });

  console.log('\n--- Final Text ---');
  console.log(result.text);

  console.log('\n--- Tool Calls History ---');
  const allToolCalls = result.steps.flatMap(step => step.toolCalls);
  
  (allToolCalls as any[]).forEach(call => {
    const inputData = call.input || call.args; 
    console.log(`-> ${call.toolName} called with data:`, inputData);
  });
}

main().catch(console.error);
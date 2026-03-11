import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

const myToolSet = {
  firstTool: tool({
    description: 'Greets the user by name.',
    parameters: z.object({ name: z.string() }),
    execute: async (args: any) => {
      console.log(`\n[Tool Executing] Greeting for: ${args.name}`);
      return `Hello, ${args.name}!`;
    },
  } as any),
  
  secondTool: tool({
    description: 'Tells the user their age.',
    parameters: z.object({ age: z.number() }),
    execute: async (args: any) => {
      console.log(`\n[Tool Executing] Age for: ${args.age}`);
      return `You are ${args.age} years old!`;
    },
  } as any),
};

async function main() {
  console.log('Sending prompt: "Say hello to Alice and tell her she is 28."');
  console.log('Active Tools permitted: ["firstTool"]\n');

  const result = await generateText({
    model: ollama('llama3.2'),
    tools: myToolSet as any, 
    
    // This hides 'secondTool' entirely from the model
    activeTools: ['firstTool'], 
    
    stopWhen: stepCountIs(3),
    prompt: 'Say hello to Alice and tell her she is 28.',
  });

  console.log('\n--- Final Text ---');
  console.log(result.text);

  console.log('\n--- Tool Calls History ---');
  const allToolCalls = result.steps.flatMap(step => step.toolCalls);
  
  (allToolCalls as any[]).forEach(call => {
    console.log(`-> Model successfully used: ${call.toolName}`);
  });
}

main().catch(console.error);
import { 
  generateText, 
  generateObject, 
  tool, 
  stepCountIs, 
  NoSuchToolError 
} from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

const myTools = {
  tellAge: tool({
    description: 'Tells the user their age. You MUST use the parameter "age".',
    parameters: z.object({ 
      age: z.number().describe("The user's age as a strict number") 
    }),
    
    execute: async (args: any) => {
      // 1. Force a crash if the model sends a string instead of a true number
      if (typeof args.age !== 'number') {
        throw new Error(`Schema validation failed: 'age' must be a number, but received ${typeof args.age}.`);
      }

      // 2. If it makes it here, the data is perfect!
      console.log(`\n[Tool Executing] Age processed: ${args.age} (Type: ${typeof args.age})`);
      return `You are ${args.age} years old!`;
    },
  } as any),
};

async function main() {
  const result = await generateText({
    model: ollama('llama3.2'),
    // 3. Bypass the provider tools type mismatch
    tools: myTools as any, 
    
    prompt: 'Tell Alice she is twenty-eight years old.', 
    stopWhen: stepCountIs(5),
    
    // --- The Modern Self-Healing Loop ---
    experimental_repairToolCall: async ({
      toolCall,
      tools,
      inputSchema,
      error,
    }) => {
      console.log(`\n⚠️ [Repair Triggered] Model messed up: ${toolCall.toolName}`);
      console.log(`-> Error:`, error.message);

      if (NoSuchToolError.isInstance(error)) {
        console.log(`-> Tool doesn't exist. Skipping repair.`);
        return null; 
      }

      console.log(`-> Asking model to fix its JSON payload...`);

      const { object: repairedArgs } = await generateObject({
        model: ollama('llama3.2'), 
        
        // Zod v4 fix: Define both the key type and the value type
        schema: z.record(z.string(), z.any()), 
        
        prompt: [
          `You are a JSON repair bot. The model tried to call the tool "${toolCall.toolName}"`,
          `with the following invalid inputs:`,
          JSON.stringify(toolCall.input),
          `The tool STRICTLY accepts the following JSON schema:`,
          JSON.stringify(inputSchema(toolCall)),
          `Please fix the inputs so they match the schema exactly (e.g., convert text strings like "twenty-eight" into actual numbers like 28).`,
        ].join('\n'),
      });

      console.log(`-> ✅ Fixed args:`, repairedArgs);

      return { ...toolCall, input: JSON.stringify(repairedArgs) };
    },
  });

  console.log('\n--- Final Text ---');
  console.log(result.text);
}

main().catch(console.error);
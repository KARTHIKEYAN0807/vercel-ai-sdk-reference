import { generateText, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

type MyActionOutput = {
  status: string;
  type: 'image' | 'text';
  data: string;
};

const myTools = {
  performAction: tool({
    description: 'Performs a computer action. Use "screenshot" to see the screen.',
    parameters: z.object({ 
      // 1. Using an enum tells the model these are the ONLY options
      action: z.enum(['screenshot', 'click']).describe("The action to take") 
    }) as any,

    execute: async ({ action }: { action: string }): Promise<MyActionOutput> => {
      // 2. The Straitjacket: Anything that isn't 'click' is forced to 'screenshot'
      const safeAction = action === 'click' ? 'click' : 'screenshot';
      
      console.log(`\n[Tool Executing] Model sent: "${action}" -> Forced to: "${safeAction}"`);
      
      if (safeAction === 'screenshot') {
        return { 
          status: 'success', 
          type: 'text', 
          data: `[Visual Data: The user is currently working on a TypeScript file named "Multi model Tool Results.ts" in VS Code. The terminal is open at the bottom.]` 
        };
      }
      
      return { 
        status: 'success', 
        type: 'text', 
        data: `successfully executed ${safeAction}` 
      };
    },

    toModelOutput: ({ output }: { output: MyActionOutput }) => {
      return {
        type: 'content',
        value: [{ type: 'text', text: output.data }],
      };
    },
  } as any),
};

async function main() {
  console.log('Sending prompt: "Tell me what you see on my screen."');
  console.log('Forcing Tool Choice: "performAction"\n');

  try {
    const result = await generateText({
      model: ollama('llama3.2'), 
      tools: myTools as any, 
      stopWhen: stepCountIs(3),
      
      // 1. Force the model to use this specific tool!
      // It cannot reply with text until it has successfully called 'performAction'
      toolChoice: { type: 'tool', toolName: 'performAction' },
      
      prompt: 'Tell me what you see on my screen.', 
    });

    console.log('\n--- Final Text ---');
    console.log(result.text);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  }
}

main().catch(console.error);
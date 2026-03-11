import { generateText, tool } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';
import { execSync } from 'child_process';

async function main() {
  console.log('--- Laptop Terminal Assistant Active ---');

  const result = await generateText({
    model: ollama('llama3.2'),
    temperature: 0, 
    system: 'You are a terminal assistant. Always summarize the results of the command you run.',
    tools: {
      myTool: tool({
        description: 'Execute a terminal command',
        inputSchema: z.object({
          command: z.string().describe('The command to run'),
        }) as any,
        execute: async ({ command }: { command: any }) => {
          // 1. THE REPAIR SHOP: Strips [ ] ' " and spaces
          // This fixes "['ls']", "[ls]", and "'ls'" all at once
          const cleanCommand = String(command)
            .replace(/[\[\]'"]/g, '') 
            .trim();
          
          console.log(`\n[Laptop System] Cleaned command: ${cleanCommand}`);
          
          try {
            // 2. Windows mapping for your D: drive
            const winCommand = cleanCommand === 'ls' ? 'dir' : cleanCommand;
            const output = execSync(winCommand, { encoding: 'utf8' });
            return output;
          } catch (e: any) {
            return `Execution failed: ${e.message}`;
          }
        },
      } as any),
    },
    prompt: 'Execute the ls command to see the files in this directory.',
  });

  console.log('\n--- Raw Tool Results ---');
  result.steps.forEach((step) => {
    step.toolResults.forEach((res: any) => {
      console.log(res.result || "No output from command.");
    });
  });

  console.log('\n--- Final Summary ---');
  console.log(result.text || "I ran the command, but I don't have a text summary. Check the raw results above!");
}

main().catch(console.error);
import { type ModelMessage, generateText, tool } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const messages: ModelMessage[] = [
    { role: 'user', content: 'Remove the most recent file' },
  ];

  const result = await generateText({
    model: ollama('llama3.2'),
    tools: {
      runCommand: tool({
        description: 'Run a shell command on the local system',
        parameters: z.object({
          command: z.string().describe('The shell command to execute'),
        }),
        needsApproval: true,
        execute: async ({ command }: { command: string }) => {
          return { status: 'success', output: `Deleted: ${command}` };
        },
      } as any),
    },
    messages,
  });

  messages.push(...result.response.messages);

  for (const part of result.content) {
    if (part.type === 'tool-approval-request') {
      console.log('--- ACTION REQUIRED ---');
      console.log('Approval ID:', part.approvalId);
      
      // FIX: Use .input instead of .args
      const toolInput = part.toolCall.input as { command: string };
      console.log('Model wants to run:', toolInput.command);
      
      const userApproved = true; 

      messages.push({
        role: 'tool',
        content: [
          {
            type: 'tool-approval-response',
            approvalId: part.approvalId,
            approved: userApproved,
          },
        ],
      });

      console.log('\n[USER] Approved command. Continuing...');

      const finalResult = await generateText({
        model: ollama('llama3.2'),
        tools: {
          runCommand: tool({
            parameters: z.object({ command: z.string() }),
            execute: async ({ command }: { command: string }) => {
              return { status: 'success', output: `Executed: ${command}` };
            },
          } as any),
        },
        messages,
      });

      console.log('\nFinal Model Response:', finalResult.text);
    }
  }
}

main();
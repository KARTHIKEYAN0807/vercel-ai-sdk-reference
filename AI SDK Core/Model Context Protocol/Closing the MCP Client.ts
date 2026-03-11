import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { createMCPClient, type MCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import path from 'path';
import fs from 'fs';

async function main() {
  const projectRoot = 'D:\\vercel ai sdk';
  const serverPath = path.join(projectRoot, 'node_modules', '@modelcontextprotocol', 'server-filesystem', 'dist', 'index.js');

  let mcpClient: MCPClient | undefined;

  try {
    const transport = new Experimental_StdioMCPTransport({
      command: 'cmd',
      args: ['/c', 'node', serverPath, projectRoot],
    });

    console.log('[System] Connecting to Filesystem MCP Server...');
    mcpClient = await createMCPClient({ transport });
    const tools = await mcpClient.tools();

    const result = streamText({
      model: ollama('llama3.2'),
      tools: tools as any,
      maxSteps: 5, 
      system: 'You are a helpful assistant. Always explain what you are doing before calling a tool.',
      prompt: `Look at the directory "${projectRoot}/AI SDK Core/Tool Calling". Read the file "Types.ts" and summarize it.`,

      // FIX: Explicitly type the parameters to clear the 7006 errors
      onStepFinish: (step: any) => {
        if (step.toolCalls && step.toolCalls.length > 0) {
          const toolNames = step.toolCalls.map((c: any) => c.toolName).join(', ');
          console.log(`\n[Llama Step] Calling tools: ${toolNames}`);
        }
      },

      onFinish: async () => {
        console.log('\n\n[System] Task complete. Closing MCP...');
        if (mcpClient) await mcpClient.close();
      },
    } as any);

    console.log('--- Llama 3.2 Analysis ---');
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
    if (mcpClient) await mcpClient.close();
  }
}

main().catch(console.error);
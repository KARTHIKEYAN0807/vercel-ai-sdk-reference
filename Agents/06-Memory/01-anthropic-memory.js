import { anthropic } from '@ai-sdk/anthropic';
import { ToolLoopAgent } from 'ai';
import 'dotenv/config';

async function runAnthropicMemory() {
  console.log("Starting Memory: Anthropic Native Tool...\n");

  // Anthropic provides the schema, we just provide the database logic
  const memoryTool = anthropic.tools.memory_20250818({
    execute: async (action) => {
      console.log(`\n[Database Action] Claude requested to: ${action.command}`);
      
      // In a real app, you would connect to a database here.
      if (action.command === 'create') {
        console.log(`-> Saving file: /memories/${action.path}`);
        console.log(`-> Content: ${action.content}`);
        return "Memory saved successfully.";
      }
      
      if (action.command === 'view') {
        console.log(`-> Reading file: /memories/${action.path}`);
        return "User prefers dark mode and uses Neovim.";
      }

      return "Action completed.";
    },
  });

  const agent = new ToolLoopAgent({
    model: anthropic('claude-3-5-sonnet-latest'),
    tools: { memory: memoryTool },
  });

  console.log("Prompt: 'Remember that my favorite editor is VS Code.'");
  
  // The agent will automatically call the 'create' action on the memory tool!
  const result = await agent.generate({
    prompt: 'Remember that my favorite editor is VS Code.',
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
} 

// runAnthropicMemory(); // Requires Anthropic API Key

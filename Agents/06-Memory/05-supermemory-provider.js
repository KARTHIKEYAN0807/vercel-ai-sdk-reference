import { supermemoryTools } from '@supermemory/tools/ai-sdk';
import { ToolLoopAgent } from 'ai';
import { google } from '@ai-sdk/google';
import 'dotenv/config';

async function runSupermemoryProvider() {
  console.log("Starting Memory: Supermemory Provider...\n");

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    // We pass the Supermemory API key directly into their tool generator
    tools: supermemoryTools(process.env.SUPERMEMORY_API_KEY),
  });

  console.log("Prompt: 'Remember that my favorite editor is Neovim'");

  const result = await agent.generate({
    prompt: 'Remember that my favorite editor is Neovim',
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

// runSupermemoryProvider(); // Requires @supermemory/tools and API Key
import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';
import { ToolLoopAgent } from 'ai';
import 'dotenv/config';

async function runLettaProvider() {
  console.log("Starting Memory: Letta Provider...\n");

  const agent = new ToolLoopAgent({
    model: lettaCloud(),
    
    // You can also expose Letta's explicit memory tools to the AI
    tools: {
      core_memory_append: lettaCloud.tool('core_memory_append'),
      memory_insert: lettaCloud.tool('memory_insert'),
      memory_replace: lettaCloud.tool('memory_replace'),
    },

    providerOptions: {
      letta: {
        agent: { id: 'your-letta-agent-id-from-their-dashboard' },
      },
    },
  });

  console.log("Prompt: 'What do you remember about me?'");
  
  const result = await agent.generate({
    prompt: 'What do you remember about me?',
  });

  console.log("\n--- Final Output ---");
  console.log(result.text);
}

// runLettaProvider(); // Requires @letta-ai/vercel-ai-sdk-provider and API Key
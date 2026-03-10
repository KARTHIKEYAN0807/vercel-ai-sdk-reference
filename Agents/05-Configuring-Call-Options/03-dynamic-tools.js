import { ToolLoopAgent } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runDynamicTools() {
  console.log("Starting Call Options: Dynamic Tool Configuration...\n");

  const newsAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    // 1. Define the dynamic options we expect at runtime
    callOptionsSchema: z.object({
      userCity: z.string().optional(),
      userRegion: z.string().optional(),
    }),

    // 2. Add the tool to the agent.
    // We start with the default Google Search tool.
    tools: {
      webSearch: google.tools.googleSearch(),
    },

    // 3. Intercept the call and reconfigure the tool with the runtime options
    prepareCall: ({ options, ...settings }) => {
      console.log(`[Configuring Agent] Setting search location to: ${options.userCity}, ${options.userRegion}`);
      
      return {
        ...settings,
        tools: {
          // We overwrite the default tool with a dynamically configured version
          webSearch: google.tools.googleSearch({
            // Many provider tools allow you to pass specific configuration options.
            // Note: The specific configuration options (like 'searchContextSize' or 'userLocation') 
            // vary by provider (OpenAI vs. Google). This example demonstrates the structure 
            // shown in the Vercel docs, adapted for the concept.
            userLocation: {
              type: 'approximate',
              city: options.userCity,
              region: options.userRegion,
              country: 'IN', // Defaulting to India for this example
            },
          }),
        },
      };
    },
  });

  console.log("Prompt: 'What are the top local news stories today?'");
  console.log(`Options passed: { userCity: 'Chennai', userRegion: 'Tamil Nadu' }\n`);

  // 4. Execute the agent, passing the options
  const result = await newsAgent.generate({
    prompt: 'What are the top local news stories today?',
    options: {
      userCity: 'Chennai',
      userRegion: 'Tamil Nadu',
    },
  });

  console.log("--- Final Output ---");
  console.log(result.text);
}

runDynamicTools();
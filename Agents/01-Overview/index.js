import { ToolLoopAgent, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import 'dotenv/config';

async function runAgentOverview() {
  console.log("Starting the Autonomous Agent...\n");

  
  const myAgent = new ToolLoopAgent({
    model: google('gemini-2.5-flash'),
    
    
    tools: {
      getWeather: tool({
        description: 'Get the current weather temperature for a location in Celsius',
        inputSchema: z.object({
          location: z.string().describe('The city or location name'),
        }),
        execute: async ({ location }) => {
          console.log(`[Agent Action] Tool used: getWeather for ${location}...`);
          
          return { location, temperature: 35, unit: 'Celsius' };
        },
      }),
      
      convertCelsiusToFahrenheit: tool({
        description: 'Convert a temperature from Celsius to Fahrenheit',
        inputSchema: z.object({
          celsius: z.number().describe('The temperature in Celsius'),
        }),
        execute: async ({ celsius }) => {
          console.log(`[Agent Action] Tool used: convertCelsiusToFahrenheit for ${celsius}°C...`);
          
          const fahrenheit = Math.round((celsius * 9/5) + 32);
          return { fahrenheit };
        },
      }),
    },
  });

  console.log("Prompt: What is the weather in Chennai? Please give me the answer in Fahrenheit.\n");
  
  const result = await myAgent.generate({
    prompt: 'What is the weather in Chennai? Please give me the answer in Fahrenheit.',
  });

  console.log("\n--- Final Agent Response ---");
  console.log(result.text);
  
  
  console.log(`\n(The agent took ${result.steps.length} steps to figure this out)`);
}

runAgentOverview();
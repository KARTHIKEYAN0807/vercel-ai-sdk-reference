import { generateText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import 'dotenv/config';

async function runToolExample() {
  const model = google('gemini-2.5-flash');

  console.log("Asking the AI about the weather...");

  const { text, steps } = await generateText({
    model,
    prompt: "What is the weather like in Chennai right now?",
    
    
    stopWhen: stepCountIs(3), 
    
    tools: {
      getWeather: tool({
        description: 'Get the current weather for a specific city.',
        
        
        inputSchema: z.object({
          location: z.string().describe('The name of the city, e.g. Chennai'),
        }),
        
        execute: async ({ location }) => {
          console.log(`\n[System Log] Tool triggered! Fetching weather for: ${location}...`);
          
          return {
            location: location,
            temperature: 34,
            unit: 'Celsius',
            condition: 'Humid and partly cloudy'
          };
        },
      }),
    },
  });

  console.log("\nFinal AI Response:");
  console.log(text);

  console.log(`\n(This took ${steps.length} steps to complete)`);
}

runToolExample();
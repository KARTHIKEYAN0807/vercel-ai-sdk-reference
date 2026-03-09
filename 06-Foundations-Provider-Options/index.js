import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import 'dotenv/config';

async function runProviderOptionsExample() {
  const model = google('gemini-2.5-flash');

  console.log("Sending a prompt with custom Google provider options...\n");

  const { text } = await generateText({
    model,
    prompt: "Write a polite, professional response declining a job offer.",
    
    // This is the escape hatch. It allows us to pass settings that only Google understands.
    // If we changed the model to OpenAI tomorrow, the SDK would just ignore this block 
    // instead of crashing.
    providerOptions: {
      google: {
        // safetySettings is specific to the Google provider API
        safetySettings: [
          { 
            category: 'HARM_CATEGORY_HARASSMENT', 
            threshold: 'BLOCK_ONLY_HIGH' 
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }
    }
  });

  console.log("AI Response:\n");
  console.log(text);
}


runProviderOptionsExample();
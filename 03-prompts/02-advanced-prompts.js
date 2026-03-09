import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import 'dotenv/config';

async function runAdvancedPrompts() {
  const model = google('gemini-2.5-flash');

  console.log("--- Example 5: Provider Options (Granular Control) ---");
  const { text: providerOptionsResponse } = await generateText({
    model,
    prompt: "Write a haiku about coding.",
    providerOptions: {
      google: {
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      }
    }
  });
  console.log("Response:", providerOptionsResponse);

  console.log("\n--- Example 6: File Parts (PDF Example) ---");
  try {
    const dummyPdfBuffer = Buffer.from("dummy pdf data");
    
    const { text: fileResponse } = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Summarize this document.' },
            {
              type: 'file',
              mediaType: 'application/pdf',
              data: dummyPdfBuffer, 
            },
          ],
        },
      ],
    });
    console.log("File upload successful, model responded.");
  } catch (error) {
    console.log("File example skipped or failed (expected if dummy buffer is rejected).");
  }

  console.log("\n--- Example 7: Simulating Tool Messages ---");
  const { text: toolResponse } = await generateText({
    model,
    messages: [
      {
        role: 'user',
        content: 'How many calories are in an apple?'
      },
      {
        role: 'assistant',
        content: [
          {
            type: 'tool-call',
            toolCallId: 'call_123',
            toolName: 'getNutrition',
            input: { food: 'apple' }
          }
        ]
      },
      {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'call_123',
            toolName: 'getNutrition',
            output: { type: 'json', value: { calories: 95 } } 
          }
        ]
      }
    ]
  });
  console.log("Response:", toolResponse);
}

runAdvancedPrompts();
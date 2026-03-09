import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import fs from "fs";
import 'dotenv/config';

async function runAllPromptExamples() {
  const model = google('gemini-2.5-flash');

  console.log("--- Example 1: Basic Text Prompt ---");
  const techStack = "MERN stack";
  const { text: textResponse } = await generateText({
    model,
    prompt: `Explain why the ${techStack} is popular for web development in one sentence.`,
  });
  console.log("Response:", textResponse);


  console.log("\n--- Example 2: System Prompt + Text Prompt ---");
  const { text: systemResponse } = await generateText({
    model,
    system: "You are a sarcastic, grumpy senior developer. Give short, blunt answers.",
    prompt: "How do I center a div?",
  });
  console.log("Response:", systemResponse);


  console.log("\n--- Example 3: Message Array (Chat History) ---");
  const { text: messageResponse } = await generateText({
    model,
    messages: [
      { role: "system", content: "You are a helpful coding tutor." },
      { role: "user", content: "Hi, I am learning JavaScript." },
      { role: "assistant", content: "That is great! What concept are you struggling with?" },
      { role: "user", content: "Can you explain what a Promise is simply?" }
    ],
  });
  console.log("Response:", messageResponse);


  console.log("\n--- Example 4: Multi-part Content (Text + Image URL) ---");
  const { text: multiModalResponse } = await generateText({
    model,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What is the main color of this logo?" },
          { 
            type: "image", 
            image: "https://github.com/vercel/ai/blob/main/examples/ai-functions/data/comic-cat.png?raw=true" 
          }
        ],
      }
    ],
  });
  console.log("Response:", multiModalResponse);


  console.log("\n--- Example 5: Provider Options (Granular Control) ---");
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
    console.log("File example skipped or failed (expected if dummy buffer is rejected by API).");
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

runAllPromptExamples();
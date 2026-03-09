import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import 'dotenv/config';

async function runBasicPrompts() {
  const model = google('gemini-2.5-flash');

  console.log("--- Example 1: Basic Text Prompt ---");
  const { text: textResponse } = await generateText({
    model,
    prompt: "Explain why the MERN stack is popular for web development in one sentence.",
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

  console.log("\n--- Example 4: Multi-part Content (Text + Image) ---");
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
}

runBasicPrompts();
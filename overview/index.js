import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import 'dotenv/config';

async function runModel() {
  console.log("Generating response...");
  
  const { text } = await generateText({
    model: google('gemini-2.5-flash'), // Updated to the newer, active model
    prompt: "What is love? Answer in one short sentence.",
  });

  console.log("\n🤖 AI Response:\n");
  console.log(text);
}

runModel();
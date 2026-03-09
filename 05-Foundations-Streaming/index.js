import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import 'dotenv/config';

async function runStreamingExample() {
  const model = google('gemini-2.5-flash');

  console.log("Asking the AI to explain streaming...\n");

  
  const { textStream } = await streamText({
    model,
    prompt: "Explain why streaming text in a chat application is a better user experience than waiting for the whole response. Keep it to one short paragraph.",
  });

  
  for await (const textPart of textStream) {
    
    
    process.stdout.write(textPart);
  }
  
  
  console.log("\n\n[Stream Completed]");
}

runStreamingExample();
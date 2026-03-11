import { config } from 'dotenv';
config({ path: 'D:/vercel ai sdk/.env' });

// Now you can safely import the AI SDK, and it will find the API key
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

async function main() {
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt: 'Write a short poem about coding in TypeScript.',
  });

  console.log(text);
}

main();
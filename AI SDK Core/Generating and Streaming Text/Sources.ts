import { config } from 'dotenv';
import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';

config({ path: 'D:/vercel ai sdk/.env' });

async function main() {
  console.log('--- 1. Testing generateText ---');
  const genResult = await generateText({
    model: google('gemini-2.5-flash'),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    prompt: 'List 2 recent news events in San Francisco.',
  });

  console.log(genResult.text);
  console.log('\n[generateText Sources]:');
  for (const source of genResult.sources ?? []) {
    if (source.sourceType === 'url') {
      console.log('Title:', source.title);
      console.log('URL:', source.url);
    }
  }

  console.log('\n\n--- 2. Testing streamText ---');
  const streamResult = streamText({
    model: google('gemini-2.5-flash'),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    prompt: 'List 2 recent news events in San Francisco.',
  });

  for await (const part of streamResult.fullStream) {
    if (part.type === 'text-delta') {
      process.stdout.write(part.text);
    } 
    else if (part.type === 'source' && part.sourceType === 'url') {
      console.log('\n[Streamed Source Found]:');
      console.log('Title:', part.title);
      console.log('URL:', part.url);
      console.log('---');
    }
  }
  
  console.log();
}

main();
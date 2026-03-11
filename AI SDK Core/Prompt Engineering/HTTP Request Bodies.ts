import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  const result = await generateText({
    model: ollama('llama3.2'),
    prompt: 'Hello, world!',
  });

  console.log('--- Inspecting the Outgoing Request ---');
  
  const body = result.request.body;

  if (body) {
    // FIX: Check if it's already a string or an object to avoid TS2345
    if (typeof body === 'string') {
      try {
        console.log(JSON.stringify(JSON.parse(body), null, 2));
      } catch (e) {
        console.log(body); // Log raw if it's not JSON
      }
    } else {
      // If it's already an object, just stringify it directly
      console.log(JSON.stringify(body, null, 2));
    }
  } else {
    console.log('No request body found.');
  }

  console.log('\n--- Model Response ---');
  console.log(result.text);
}

main().catch(console.error);
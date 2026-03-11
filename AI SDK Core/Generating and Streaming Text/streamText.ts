import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  const result = streamText({
    model: ollama('llama3.2'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  // process.stdout.write is used here instead of console.log 
  // so the streamed words print smoothly on the same line.
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  
  console.log(); // Adds a clean new line at the very end
}

main();
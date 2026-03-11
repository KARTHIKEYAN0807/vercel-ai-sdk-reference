import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  const result = streamText({
    model: ollama('llama3.2'),
    prompt: 'Invent a new holiday and describe its traditions.',
    onError({ error }) {
      console.error('\n[Stream Error]:', error); 
    },
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  
  console.log(); 
}

main();
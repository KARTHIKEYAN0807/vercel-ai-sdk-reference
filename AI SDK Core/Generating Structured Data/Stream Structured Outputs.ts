import { streamObject } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const { partialObjectStream } = streamObject({
    model: ollama('llama3.2'),
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({ name: z.string(), amount: z.string() }),
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt: 'Generate a lasagna recipe.',
  });

  for await (const partialObject of partialObjectStream) {
    // Clear console and show the object building in real-time
    console.clear();
    console.dir(partialObject, { depth: null });
  }
}

main();
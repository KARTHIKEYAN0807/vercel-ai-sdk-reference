import { generateText, Output } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const result = await generateText({
    // You need a reasoning model like deepseek-r1 to see reasoningText
    model: ollama('deepseek-r1:7b'), 
    
    // Enable reasoning mode for providers that support it
    providerOptions: {
      ollama: { think: true }
    },

    output: Output.object({
      schema: z.object({
        recipe: z.object({
          name: z.string(),
          ingredients: z.array(
            z.object({
              name: z.string(),
              amount: z.string(),
            }),
          ),
          steps: z.array(z.string()),
        }),
      }),
    }),
    prompt: 'Generate a lasagna recipe.',
  });

  // This will show the "thinking" process (e.g., DeepSeek's <think> tokens)
  console.log('--- REASONING ---');
  console.log(result.reasoningText);

  console.log('\n--- FINAL RECIPE ---');
  console.log(result.output.recipe.name);
}

main();
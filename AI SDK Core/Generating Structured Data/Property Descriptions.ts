import { generateText, Output } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  const { output } = await generateText({
    model: ollama('llama3.2'),
    output: Output.object({
      schema: z.object({
        name: z.string().describe('The name of the recipe'),
        ingredients: z
          .array(
            z.object({
              name: z.string(),
              amount: z
                .string()
                .describe('The amount of the ingredient (grams or ml)'),
            }),
          )
          .describe('List of ingredients with amounts'),
        steps: z.array(z.string()).describe('Step-by-step cooking instructions'),
      }),
    }),
    prompt: 'Generate a lasagna recipe.',
  });

  console.log('Recipe:', output.name);
  console.log('\nIngredients:');
  output.ingredients.forEach((ing) => console.log(`- ${ing.amount} ${ing.name}`));
  console.log('\nSteps:');
  output.steps.forEach((step, i) => console.log(`${i + 1}. ${step}`));
}

main();
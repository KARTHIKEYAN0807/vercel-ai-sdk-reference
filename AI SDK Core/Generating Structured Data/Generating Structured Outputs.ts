import { generateObject } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  console.log('Generating structured lasagna recipe...');

  const { object } = await generateObject({
    model: ollama('llama3.2'),
    // The schema defines exactly how the JSON should look
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({ 
            name: z.string(), 
            amount: z.string() 
          }),
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt: 'Generate a classic lasagna recipe.',
  });

  // Access your data directly as a typed object
  console.log('Recipe Name:', object.recipe.name);
  console.log('\nIngredients:');
  object.recipe.ingredients.forEach(ing => {
    console.log(`- ${ing.amount} of ${ing.name}`);
  });
}

main();
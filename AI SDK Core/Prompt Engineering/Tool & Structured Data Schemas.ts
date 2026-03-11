import { generateObject } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';

async function main() {
  console.log('--- Generating Structured Data (2000 Events) ---');

  try {
    const { object } = await generateObject({
      model: ollama('llama3.2'),
      // 1. We define the schema here
      schema: z.object({
        events: z.array(
          z.object({
            event: z.string().describe('A short description of the historical event'),
            // 2. Note: Local models struggle with .date() transformations during generation
            // It is safer to receive a string and transform it afterward.
            date: z.string().describe('The date in YYYY-MM-DD format'),
          }),
        ),
      }),
      prompt: 'List 5 important events from the year 2000.',
    });

    // 3. Now we apply the transformation to real Date objects in TypeScript
    const formattedEvents = object.events.map(e => ({
      ...e,
      dateObject: new Date(e.date)
    }));

    console.table(formattedEvents);

    console.log('\n--- Sample Event Check ---');
    if (formattedEvents[0]) {
      console.log(`First Event: ${formattedEvents[0].event}`);
      console.log(`Parsed Date: ${formattedEvents[0].dateObject.toDateString()}`);
    }

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  }
}

main().catch(console.error);
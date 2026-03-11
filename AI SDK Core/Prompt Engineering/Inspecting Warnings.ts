import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  console.log('--- Inspecting Ollama Warnings ---');

  try {
    const result = await generateText({
      model: ollama('llama3.2'),
      prompt: 'Hello, world!',
      // We'll pass a setting that local models sometimes warn about
      frequencyPenalty: 0.5, 
    });

    // Check for warnings using the type-safe 'any' approach to avoid TS2339
    if (result.warnings && result.warnings.length > 0) {
      console.log('\n[System] Ollama reported the following adjustments:');
      result.warnings.forEach((warning: any, index: number) => {
        console.log(`\nWarning #${index + 1}:`);
        console.log(`- Type: ${warning.type}`);
        // Log the whole object so we can see if it uses 'feature', 'setting', or 'details'
        console.log(`- Data: ${JSON.stringify(warning)}`);
      });
    } else {
      console.log('\n[System] No warnings. Llama 3.2 accepted all settings.');
    }

    console.log('\n--- Model Response ---');
    console.log(result.text);

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  }
}

main().catch(console.error);
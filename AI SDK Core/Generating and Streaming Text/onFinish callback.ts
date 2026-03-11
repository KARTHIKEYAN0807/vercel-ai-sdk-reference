import { generateText } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

async function main() {
  console.log('Asking Llama 3.2 to invent a holiday...');

  const result = await generateText({
    model: ollama('llama3.2'),
    prompt: 'Invent a new holiday and describe it in a few sentences.',
    
    onFinish(event) {
      console.log('\n--- onFinish Callback Triggered ---');
      console.log('Finish Reason:', event.finishReason);
      // Changed to the AI SDK's universal property names
      console.log('Prompt Tokens:', event.usage.inputTokens); 
      console.log('Completion Tokens:', event.usage.outputTokens); 
      console.log('Total Tokens:', event.usage.totalTokens);
    },
  });

  console.log('\nFinal Text Generated:\n', result.text);
}

main();
import { smoothStream, streamText, type TextStreamPart, type ToolSet } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';

const upperCaseTransform = <TOOLS extends ToolSet>() =>
  (options: { tools: TOOLS; stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        controller.enqueue(
          chunk.type === 'text-delta'
            ? { ...chunk, text: chunk.text.toUpperCase() }
            : chunk,
        );
      },
    });

const stopWordTransform = <TOOLS extends ToolSet>() =>
  ({ stopStream }: { stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        if (chunk.type !== 'text-delta') {
          controller.enqueue(chunk);
          return;
        }

        if (chunk.text.includes('STOP')) {
          stopStream();

          // Mocking the finish-step event
          controller.enqueue({
            type: 'finish-step',
            finishReason: 'stop',
            usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
            response: { id: 'response-id', modelId: 'mock-model-id', timestamp: new Date(0) },
            isContinued: false,
          } as any);

          // Mocking the finish event
          controller.enqueue({
            type: 'finish',
            finishReason: 'stop',
            usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
          } as any);

          return;
        }

        controller.enqueue(chunk);
      },
    });

async function main() {
  const result = streamText({
    model: ollama('llama3.2'),
    prompt: 'Write a short story about the ocean. In the middle of the story, write the word STOP in capital letters, then keep writing.',
    
    experimental_transform: [
      upperCaseTransform(),
      stopWordTransform(),
      smoothStream(),
    ],
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  
  console.log('\n\n[Stream Halted by Transform]');
}

main();
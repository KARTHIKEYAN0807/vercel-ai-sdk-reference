# AI SDK Core: Image Generation

The AI SDK provides the `generateImage` function to generate images based on a given prompt using an image model.

## 🚀 Basic Usage
You can generate an image by passing a model and a prompt to the `generateImage` function:
```typescript
import { generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});
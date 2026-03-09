# 06 - Foundations: Provider Options

## The Big Picture
The Vercel AI SDK is great because it gives you a universal, standardized way to talk to any AI model. However, sometimes you need to use a feature that is entirely unique to one specific company. 

For example, Anthropic has a special "Thinking" budget for Claude, and OpenAI has a "Reasoning Effort" dial for their newer models. These aren't standard features across all AIs, so they don't have top-level properties in the SDK. 

To access these unique features without breaking the universal standard, you use `providerOptions`.

## Core Concepts
* **Namespacing:** You pass an object called `providerOptions` into your generation function. Inside that object, you create a key for the specific provider (e.g., `openai: {}`, `anthropic: {}`, or `google: {}`). 
* **Safe Fallbacks:** The beauty of namespacing is that if you swap your model from OpenAI to Google later, the SDK will just silently ignore the `openai` provider options. It won't crash your app.
* **Type Safety:** You can import types like `OpenAILanguageModelResponsesOptions` from the provider packages and use the `satisfies` keyword in TypeScript/JSDoc to get autocomplete for that specific company's features.

## Examples from the Docs
While we are using Google Gemini for our code, the docs highlight some powerful options for other providers:
* **OpenAI (`reasoningEffort`):** You can set this to 'low', 'medium', or 'high' to tell models like `o3` how hard to think before answering. Lower is faster/cheaper, higher is more thorough.
* **Anthropic (`thinking`):** You can explicitly give Claude a `budgetTokens` limit, which allows it to "think" internally up to a certain token cost before outputting text.

## What I Learned (Key Takeaways)
* `providerOptions` is the "escape hatch" of the Vercel AI SDK. It lets you use the unified API 99% of the time, but still access the hyper-specific, cutting-edge features of individual companies when you need to.

---

## Running the Code

Since our setup uses Google Gemini, this example demonstrates how to use `providerOptions` to pass Google-specific safety settings to the model.

Make sure your terminal is in the root directory of the project, then run:

node 06-Foundations-Provider-Options/index.js
# 01 - Foundations: Overview

This folder covers the absolute basics of the Vercel AI SDK. 

The whole point of this SDK is to stop writing different boilerplate code for every single AI provider out there (OpenAI, Anthropic, Google, etc.). It gives us one unified API. Write the logic once, swap the model string, and you're good to go.

## Core Concepts

Before writing actual code, the docs break down three main things:

1. **Generative AI:** The overarching category. These models ingest massive amounts of training data, look for patterns, and then predict/generate new stuff based on probability. (e.g., audio -> transcript, text -> image).
2. **Large Language Models (LLMs):** A specific type of Generative AI that only deals with text. You give it words, and it calculates the math to predict the most logical next words. 
   * *The catch:* Because it's just predicting sequences and isn't a database of facts, if it doesn't know something, it will confidently make it up. This is what a "hallucination" is.
3. **Embedding Models:** These are entirely different. They *do not* generate text. Instead, they take complex data (like a paragraph of text) and convert it into a dense vector (a long list of numbers). We use these numbers to measure how conceptually similar two pieces of text are to each other.

## 🧠 Key Takeaways / What I Learned

* **It's a Universal Adapter:** I don't need to learn a dozen different APIs anymore. I just learn Vercel's SDK and can hook it up to whatever model I want.
* **Embeddings vs. Generation:** Huge difference. Generative models make new content. Embedding models just turn existing content into math so the computer can understand context and relationships. 
* **Always use Google's free API for code:** While learning and building this out locally, relying on `@ai-sdk/google` is the move. The Gemini API has a solid free tier, so I don't burn cash just testing out basic SDK features.
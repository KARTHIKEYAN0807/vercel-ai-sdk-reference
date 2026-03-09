# 02 - Foundations: Providers and Models

## The Big Picture
This section is entirely conceptual and explains the core architectural problem the Vercel AI SDK solves: **Vendor Lock-in**.

Companies like OpenAI, Anthropic, and Google all offer Large Language Models (LLMs), but they each have their own unique APIs. Usually, switching from one provider to another means rewriting a massive chunk of your backend code. 

To fix this, AI SDK Core uses a standardized **Language Model Specification**. It provides a unified interface, meaning you write your logic once and can seamlessly swap between providers without changing your core application code.

## 🔌 The Provider Architecture

The SDK uses a modular plugin architecture. You install the core `ai` package, and then install specific provider packages depending on what you need:

1. **Official Providers:** Built for the SDK (e.g., `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `@ai-sdk/mistral`).
2. **Community Providers:** The specification is open-source, so the community has built adapters for tools like Ollama, Cloudflare Workers AI, and more.
3. **OpenAI Compatible:** Many open-source and self-hosted models copy OpenAI's API structure. You can use the standard OpenAI provider to connect to these third-party endpoints (like LM Studio or Heroku).
4. **Self-Hosted Models:** You aren't forced to use cloud APIs. You can run models locally on your own machine using Ollama, LM Studio, or Baseten.

## 🧠 What I Learned (Key Takeaways)

* **Separation of Provider and Model:** The "Provider" is the company hosting the API (like Google), and the "Model" is the specific AI engine (like `gemini-2.5-flash`). 
* **Not all models are equal:** The docs feature a massive table showing that while the SDK standardizes the *code*, the *models themselves* have different physical capabilities. Some support Image Input, Object Generation, and Tool Streaming, while others only process basic text. 
* **Modularity:** I don't need to bloat my `node_modules` folder with SDKs for every AI company. I only install the specific provider packages I am actively using.
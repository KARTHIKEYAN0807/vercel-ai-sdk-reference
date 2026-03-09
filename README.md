# Vercel AI SDK Reference Guide

A personal learning repository and reference guide for the **Vercel AI SDK (Version 6)**. This project breaks down the core concepts of the SDK into isolated, easy-to-understand examples using Node.js and the Google Gemini provider.

## Folder Structure: Foundations

This repository is organized sequentially, starting with the basic building blocks of the AI SDK:

* **`overview`**: Basic setup and the absolute minimum code needed to generate text.
* **`02-providers-and-models`**: How to configure providers (like Google) and select specific models.
* **`03-prompts`**: Different ways to talk to the AI, including text, system instructions, and chat history.
* **`04-Foundations-Tools`**: How to give the AI access to external functions (function calling) so it can interact with the real world.
* **`05-Foundations-Streaming`**: How to stream responses chunk-by-chunk for a better, ChatGPT-style user experience.
* **`06-Foundations-Provider-Options`**: How to use the escape hatch to pass provider-specific settings (like Google's safety filters) to the model.

## Setup & Installation

To run these examples locally:

1. Clone the repository.
2. Run `npm install` to install the dependencies (Vercel AI SDK, Google provider, Zod, and dotenv).
3. Create a `.env` file in the root directory and add your Google API key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
# AI SDK Core: Language Model Middleware

Middleware acts as a "middleman" between your application code and the AI model. It intercepts requests before they hit the model, and intercepts responses before they come back to your code.

## 🚀 Why is this useful?
Normally, if you want a specific `temperature` or `maxRetries`, you have to declare it inside every single `generateText` or `streamText` call. If you have 20 different files in your application, updating settings becomes a nightmare.

With Middleware, you wrap the model **once** at the top of your app. Every time you use that wrapped model, your default settings are automatically injected!

## 🛠️ Key Concepts

1. **`wrapLanguageModel`**: The core AI SDK function. It takes a raw model (like `ollama('llama3.2')`) and a middleware object, and returns a new "upgraded" model.
2. **`defaultSettingsMiddleware`**: A built-in AI SDK middleware that applies default parameters (like temperature, tokens, or retries) to every call.
3. **Custom Middleware**: You can write your own middleware to intercept and log requests, cache responses to save processing power, or filter out bad words before they hit your app.
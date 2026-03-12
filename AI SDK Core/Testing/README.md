1️⃣ What is it? (Definition)
Testing in the AI SDK is a system that uses the mockLanguageModel and mockEmbeddingModel utilities to simulate AI responses without making real API calls to Ollama or cloud providers.

2️⃣ Why do we need it? (Purpose)
It allows you to verify that your application logic (like prompts and tool calls) works correctly without spending money on tokens, waiting for slow local generation, or needing an internet connection.

3️⃣ Where is it used? (Real usage)
In CI/CD pipelines (like GitHub Actions) and automated test suites, where you need to prove that a new code change didn't break the way your app handles an AI's response.

4️⃣ Where should it NOT be used? (Limitations)
It should not be used to test the quality or "smartness" of the AI. Since you are providing the "mock" answer yourself, a test cannot tell you if Llama 3.2 is better than Gemini at writing a specific script.

5️⃣ What was used before this? (Older approach)
Before these native mock tools, developers had to use complex "Network Interceptors" (like Nock or MSW) to catch outgoing HTTP requests or spend a lot of money running real models during every single code test.


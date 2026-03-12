# 🧠 Generating and Streaming Text in AI SDK

### 1️⃣ What is it? (Definition)
Generating and streaming text is the core process of producing AI responses (like text or code) and sending them to the client snippet-by-snippet in real-time as they are being created.

### 2️⃣ Why do we need it? (Purpose)
It dramatically improves the user experience by reducing perceived latency. Instead of looking at a loading spinner for several seconds while a long AI response is generated, users can start reading the output immediately as it streams in.

### 3️⃣ Where is it used? (Real usage)
It is used in modern AI interfaces like chatbots (e.g., ChatGPT-style UIs), real-time summaries, and AI writing assistants. In the AI SDK, this is handled using functions like `streamText`, which also support lifecycle hooks (`onStart`, `onChunk`, `onFinish`) and stream transformations to process or filter data on the fly.

### 4️⃣ Where should it NOT be used? (Limitations)
Streaming is not suitable when your application needs the completely finished AI response before taking the next step. For example, if you are generating a structured JSON object that needs to be fully parsed, or running a background automated task where no human is waiting to read the text, standard non-streaming generation (like `generateText`) is better and simpler.

### 5️⃣ What was used before this? (Older approach)
Before streaming became standard for AI, applications used standard blocking HTTP request-response cycles. The client would send a request and wait synchronously (often 5-20 seconds) until the entire text was generated before displaying anything to the user, leading to a clunky, unresponsive experience.

---

## 📂 Directory Contents

- **`streamText.ts`** – basic streaming example.
- **`genrate text advanced prompts.ts`** – advanced prompt‑engineering techniques when generating text.
- **`Sources.ts`** – utilities for working with prompt sources.
- **`Stream transformation.ts`** – modifying or filtering chunks as they arrive.
- **`Lifecycle callbacks (experimental).ts`** – examples of hooks like `onStart`, `onChunk`, `onFinish`.
- **`onFinish callback.ts`** – post‑processing after a stream completes.
- **`onError callback.ts`** – handling errors during a stream.
- **`fullStream property.ts`** – shows how to access the `fullStream` field on a streaming response.

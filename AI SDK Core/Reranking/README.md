# AI SDK Core: Reranking

If Embeddings are the "fast net" that scoops up hundreds of vaguely related documents from a database, **Reranking** is the magnifying glass that perfectly sorts those documents from best to worst.

## 🧠 Bi-Encoders vs. Cross-Encoders
* **Embeddings (Bi-Encoders):** Fast and cheap. They calculate the math of the search query and the math of the document separately, then see if the numbers match. (Sometimes misses context).
* **Rerankers (Cross-Encoders):** Slower and highly accurate. The model reads the query and the document *at the exact same time*, deeply understanding the context before giving it a relevance score (0.0 to 1.0).

## 🚀 Key Concepts in the AI SDK

* **`rerank`**: The core function. You pass it a `model`, a `query`, and an array of `documents`.
* **`topN`**: A setting that tells the reranker to only return the absolute best matches (e.g., `topN: 2` will drop all the low-scoring junk).
* **Object Support**: You don't just have to pass strings. You can pass raw JSON objects (like rows from a database), and the reranker will read the text inside them and sort the actual objects!

## Supported Providers
Because Reranking requires a specialized API endpoint, you typically use cloud providers for this specific task:
* **Cohere** (Industry standard: `rerank-v3.5`)
* **Together.ai** (Open-source hosted: `Salesforce/Llama-Rank-v1`)
* **Amazon Bedrock**
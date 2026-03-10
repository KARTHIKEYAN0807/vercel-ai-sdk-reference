# Agents: Memory

## The Big Picture
By default, Large Language Models are stateless. They don't remember what you said yesterday. To build an assistant that feels truly personalized, you have to give the Agent a "Memory" tool.

## Three Approaches to Memory
1. **Provider-Defined Tools:** Using built-in memory systems (e.g., Anthropic's Claude).
2. **Memory Providers (Third-Party Services):** Using specialized database startups (Mem0, Letta, Supermemory, Hindsight) that automatically inject past facts into the AI's brain.
3. **Custom Tools:** Building your own database/file-system tool from scratch.

---

## Code Reference Files

*Note: Files 01, 02, 04, 05, and 06 are architectural reference files. They require paid API keys and specific package installations to run successfully.*

**1. Provider-Defined**
* `01-anthropic-memory.js` (Requires Anthropic API Key)

**2. Third-Party Memory Providers**
* `02-mem0-provider.js` (Requires Mem0 API Key)
* `04-letta-provider.js` (Requires Letta API Key)
* `05-supermemory-provider.js` (Requires Supermemory API Key)
* `06-hindsight-provider.js` (Requires Hindsight API Key)

**3. Custom Built Solutions**
* `03-custom-memory.js` (**RUN THIS ONE!** Uses Gemini and a local fake database).
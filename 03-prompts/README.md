# 03 - Foundations: Prompts

## The Big Picture
Prompts are the instructions we send to the Large Language Model (LLM). The clearer the instruction, the better the output. The Vercel AI SDK simplifies the often complex process of prompting by breaking it down into three main categories: Text Prompts, System Prompts, and Message Prompts.

## Core Concepts

1. **Text Prompts:**
   The simplest form of prompting. It is a basic string passed to the `prompt` property. This is ideal for straightforward generation tasks where you don't need back-and-forth conversation history. You can easily use template literals to inject dynamic variables into the prompt string.

2. **System Prompts:**
   This acts as the overarching instruction manual for the AI. Passed via the `system` property, it tells the model how it should behave, what its persona is, and sets constraints on its answers. It works alongside regular text prompts or message arrays.

3. **Message Prompts:**
   This is an array of objects representing a conversation timeline. It is essential for chat interfaces. Each object in the array has a `role` and `content`.
   * **Roles:** `system`, `user`, `assistant`, or `tool`.
   * **Content:** Can be simple text, or an array of "parts" (which enables multi-modal inputs like mixing text and images).

## Multi-modal Inputs
The SDK allows you to send more than just text. By structuring the `content` property as an array of objects, you can send:
* **Image Parts:** Supported as URLs, base64 strings, or raw binary buffers.
* **File Parts:** Such as PDFs or audio files (though model support varies heavily for files).

## Granular Control: Provider Options
Sometimes you need to send instructions that only apply to one specific provider (like turning on a specific caching feature in Anthropic, or setting image detail levels in OpenAI). You can pass a `providerOptions` object at three different levels depending on how specific you need to be:
1. Function Call Level (Applies to the whole generation)
2. Message Level (Applies to a specific message in the array)
3. Message Part Level (Applies to a specific item, like a single image within a message)

## What I Learned (Key Takeaways)
* **Structuring History:** The message array is incredibly powerful for maintaining context. By feeding the AI an array of past `user` and `assistant` messages, it remembers what we just talked about.
* **Standardizing Multi-modal:** Handling file uploads and base64 images is usually a pain with raw APIs. The SDK standardizes this into simple `type: 'image'` or `type: 'file'` blocks inside the message content array. 

---

## Running the Code

I ended up splitting the code into two separate files. Google's free Gemini tier has a pretty strict rate limit, and running all 7 of these examples back-to-back in one file was throwing a `429 Quota Exceeded` error. 

To test these out without getting blocked by the API, make sure your terminal is in the root project folder and run them one at a time:

**1. For standard text, system, and chat prompts:**
```bash
node 03-prompts/01-basic-prompts.js

2. For advanced features (provider options, files, and simulated tools):

node 03-prompts/02-advanced-prompts.js
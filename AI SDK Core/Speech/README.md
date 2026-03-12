# AI SDK Core: Speech Generation (Experimental)

The AI SDK provides an `experimental_generateSpeech` function (often aliased as `generateSpeech`) to generate audio from text using Text-to-Speech (TTS) models.

## 🚀 Key Concepts

1. **`experimental_generateSpeech`**: The core function that takes a text prompt and returns playable audio.
2. **`voice`**: Most providers let you pick a specific voice (e.g., `'alloy'`, `'echo'`, or a custom voice ID).
3. **The Output**: The function returns the audio data in two formats:
   - `audio.uint8Array`: Binary format, perfect for saving directly to an `.mp3` file on your hard drive.
   - `audio.base64`: A string format, perfect for sending directly to a web browser's `<audio>` tag.

## ☁️ Supported Providers
Because Ollama does not support audio generation, you must use cloud APIs that specialize in voice:
* **OpenAI** (`tts-1` or `tts-1-hd`)
* **ElevenLabs** (The industry leader for highly realistic AI voices)
* **LMNT**

## 🌐 Language Support
Some providers allow you to explicitly define the spoken language using an ISO 639-1 code (like `'en'` for English or `'es'` for Spanish), helping the AI pronounce words with the correct accent.
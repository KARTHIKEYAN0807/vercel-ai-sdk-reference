# AI SDK Core: Transcription (Experimental)

The AI SDK provides an `experimental_transcribe` function (aliased as `transcribe`) to convert audio files into text using Speech-to-Text models.

## 🚀 Key Concepts

1. **`experimental_transcribe`**: The core function used to read audio and return a text transcript.
2. **Audio Formats**: The `audio` property accepts a variety of formats:
   - A file buffer (using `fs.readFileSync`)
   - A `URL` (the SDK will automatically download the audio file, up to 2GB)
   - A base64 encoded string
3. **Rich Metadata**: Depending on the provider, the SDK doesn't just return the text. It can also return:
   - `transcript.text`: The full string ("Hello, world!")
   - `transcript.language`: The detected language ("en")
   - `transcript.segments`: Timestamps for exactly when each word was spoken!

## ☁️ Supported Providers
Because Ollama does not support audio models natively, you must use cloud providers or specialized local Whisper servers:
* **OpenAI** (`whisper-1`)
* **Groq** (`whisper-large-v3` - extremely fast and has a great free tier!)
* **Deepgram / AssemblyAI / ElevenLabs**
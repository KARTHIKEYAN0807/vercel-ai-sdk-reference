import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

// Note the "experimental" tag in the current SDK version
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';
import fs from 'fs';

async function main() {
  console.log('--- Generating Speech Audio ---');

  try {
    const { audio, warnings } = await generateSpeech({
      // We use openai.speech() to specify a TTS model
      model: openai.speech('tts-1'),
      
      // The script you want the AI to read
      text: 'Welcome back to Karthix Gaming! Today we are looking at the best loadouts for Warzone Season 5.',
      
      // OpenAI has specific built-in voices like 'alloy', 'echo', 'fable', 'onyx', 'nova', and 'shimmer'
      voice: 'onyx',
    });

    // If the provider gives us any warnings, log them
    if (warnings && warnings.length > 0) {
      console.log('\nWarnings:', warnings);
    }

    // Convert the binary uint8Array into a Node.js Buffer
    const audioBuffer = Buffer.from(audio.uint8Array);
    
    // Save the buffer as an MP3 file directly to your laptop
    fs.writeFileSync('./intro-voice.mp3', audioBuffer);

    console.log('\n[Success]: Audio saved as intro-voice.mp3 in your current folder!');

  } catch (error: any) {
    // Official error handling pattern for Speech
    if (error.name === 'NoSpeechGeneratedError') {
      console.error('\n[NoSpeechGeneratedError]: The provider failed to generate audio.');
      console.error('Cause:', error.cause);
    } else {
      console.error('\n[Error]:', error.message);
    }
  }
}

// main().catch(console.error);
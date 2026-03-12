import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

// Note the "experimental" tag for video generation in the current SDK
import { experimental_generateVideo as generateVideo } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';

async function main() {
  console.log('--- Generating Video ---');
  console.log('Please wait, video generation can take 1-5 minutes...');

  try {
    const { video, warnings } = await generateVideo({
      // Using Google's Veo 2.0 video model
      model: google.video('veo-2.0-generate-001'),
      
      prompt: 'A cinematic, slow-motion drone shot of a serene mountain landscape at sunset.',
      
      // Standard YouTube resolution and aspect ratio
      resolution: '1280x720',
      aspectRatio: '16:9',
      
      // Because video takes a long time, we set a 5-minute timeout (300,000 ms)
      abortSignal: AbortSignal.timeout(300000),
    });

    if (warnings && warnings.length > 0) {
      console.log('\nWarnings:', warnings);
    }

    // The AI SDK returns the binary data for the video file
    const videoBuffer = Buffer.from(video.uint8Array);
    
    // Save the buffer directly to an MP4 file on your hard drive
    fs.writeFileSync('./mountain-sunset.mp4', videoBuffer);

    console.log('\n[Success]: Video saved as mountain-sunset.mp4 in your current folder!');

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  }
}

// main().catch(console.error);
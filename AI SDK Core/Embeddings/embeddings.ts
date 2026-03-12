import dotenv from 'dotenv';
dotenv.config({ path: 'D:\\vercel ai sdk\\.env' });

import { embed, embedMany, cosineSimilarity } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// 1. Initialize Langfuse to track our Embeddings
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

async function main() {
  console.log('--- Generating Embeddings with Ollama & Langfuse ---');

  try {
    // -------------------------------------------------------------
    // PART 1: Embed a single value (e.g., a user's search query)
    // -------------------------------------------------------------
    const query = await embed({
      // Notice we use textEmbeddingModel instead of the normal ollama() call
      model: ollama.textEmbeddingModel('nomic-embed-text'), 
      value: 'How to build a gaming PC',
      
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'embed-single-query',
      },
    });

    console.log('\n[1] Single Embedding generated!');
    console.log(`Tokens used: ${query.usage?.tokens}`);
    // We only print the first 5 numbers of the array so we don't flood the terminal!
    console.log(`Vector Preview: ${query.embedding.slice(0, 5)}...`);

    // -------------------------------------------------------------
    // PART 2: Embed many values (e.g., your database of documents)
    // -------------------------------------------------------------
    const databaseDocs = [
      'The RTX 4060 Ti is a great GPU for 1080p gaming.', // Very similar to query
      'Call of Duty Warzone season 5 patch notes.',       // Somewhat related to gaming
      'The best recipe for homemade chocolate chip cookies.' // Completely unrelated
    ];

    const database = await embedMany({
      model: ollama.textEmbeddingModel('nomic-embed-text'),
      values: databaseDocs,
      maxParallelCalls: 2, // Speeds up laptop performance by doing 2 at a time
      
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'embed-database-batch',
      },
    });

    console.log(`\n[2] Batch Embeddings generated for ${database.embeddings.length} documents!`);

    // -------------------------------------------------------------
    // PART 3: Calculate Cosine Similarity (The Magic)
    // -------------------------------------------------------------
    console.log('\n[3] Calculating similarities to our query: "How to build a gaming PC"');
    
    for (let i = 0; i < databaseDocs.length; i++) {
      // cosineSimilarity compares the query's numbers against the document's numbers
      const similarityScore = cosineSimilarity(query.embedding, database.embeddings[i]);
      
      console.log(`\nDocument: "${databaseDocs[i]}"`);
      console.log(`Similarity Score: ${(similarityScore * 100).toFixed(2)}%`);
    }

  } catch (error: any) {
    console.error('\n[Error]:', error.message);
  } finally {
    // Flush the vector data to Langfuse before shutting down
    console.log('\n[System] Flushing telemetry to Langfuse...');
    await sdk.shutdown();
  }
}

main().catch(console.error);
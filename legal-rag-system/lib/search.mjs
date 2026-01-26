import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';
import { enhanceQuery } from './query-enhancer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cosine similarity calculation
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

class LegalSearchEngine {
  constructor(embeddingsPath) {
    this.embeddingsPath = embeddingsPath;
    this.data = null;
    this.embedder = null;
  }
  
  async initialize() {
    console.log('📄 Loading embeddings...');
    this.data = JSON.parse(fs.readFileSync(this.embeddingsPath, 'utf-8'));
    
    console.log('🤖 Loading embedding model...');
    this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    console.log('✅ Search engine ready\n');
    console.log(`   Document: ${this.data.document_id}`);
    console.log(`   Total chunks: ${this.data.total_chunks}`);
    console.log(`   Embedding model: ${this.data.embedding_model}`);
    console.log(`   Dimensions: ${this.data.embedding_dimensions}\n`);
  }
  
  async search(query, topK = 3, options = {}) {
    if (!this.embedder) {
      throw new Error('Search engine not initialized. Call initialize() first.');
    }
    
    // Stage 1.10: Deterministic query enhancement (optional)
    const enhancedQuery = options.skipEnhancement ? query : enhanceQuery(query);
    
    // Generate query embedding
    const output = await this.embedder(enhancedQuery, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(output.data);
    
    // Calculate similarities
    const results = this.data.chunks.map(chunk => ({
      chunk_id: chunk.chunk_id,
      page_number: chunk.page_number,
      text: chunk.text,
      char_count: chunk.char_count,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));
    
    // Sort by similarity (highest first)
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Return top K results
    return results.slice(0, topK);
  }
  
  async searchWithContext(query, topK = 3) {
    const results = await this.search(query, topK);
    
    return {
      query,
      results: results.map(r => ({
        chunk_id: r.chunk_id,
        page_number: r.page_number,
        similarity_score: r.similarity,
        text_preview: r.text.substring(0, 200) + '...',
        full_text: r.text
      }))
    };
  }
}

export { LegalSearchEngine, cosineSimilarity };

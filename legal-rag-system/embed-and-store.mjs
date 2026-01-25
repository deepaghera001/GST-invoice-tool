import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHUNKS_PATH = path.join(__dirname, 'parsed/income_tax/FINANCE_ACT_2024/chunks.json');
const OUTPUT_PATH = path.join(__dirname, 'vector-db/income_tax/FINANCE_ACT_2024/embeddings.json');

async function generateAndStoreEmbeddings() {
  console.log('🤖 Loading embedding model (Xenova/all-MiniLM-L6-v2)...');
  console.log('   (First run will download ~90MB model)');
  
  // Load the embedding model
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  console.log('✅ Model loaded\n');
  
  // Load chunks
  console.log('📄 Reading chunks.json...');
  const chunksData = JSON.parse(fs.readFileSync(CHUNKS_PATH, 'utf-8'));
  const chunks = chunksData.chunks;
  
  console.log(`📊 Found ${chunks.length} chunks to embed\n`);
  
  // Generate embeddings
  console.log('⚙️  Generating embeddings...');
  
  const embeddedChunks = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    // Generate embedding
    const output = await embedder(chunk.text, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);
    
    embeddedChunks.push({
      chunk_id: chunk.chunk_id,
      page_number: chunk.page_number,
      text: chunk.text,
      char_count: chunk.char_count,
      embedding: embedding
    });
    
    if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
      console.log(`   ✅ Processed ${i + 1}/${chunks.length} chunks`);
    }
  }
  
  // Create output structure
  const output = {
    document_id: chunksData.document_id,
    pdf_hash: chunksData.pdf_hash,
    page_count: chunksData.page_count,
    total_chunks: chunksData.total_chunks,
    embedding_model: 'Xenova/all-MiniLM-L6-v2',
    embedding_dimensions: embeddedChunks[0].embedding.length,
    embedded_at: new Date().toISOString(),
    chunks: embeddedChunks
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  
  console.log('\n✅ SUCCESS!');
  console.log(`📁 Output: ${OUTPUT_PATH}`);
  console.log(`📊 Chunks embedded: ${embeddedChunks.length}`);
  console.log(`📐 Embedding dimensions: ${output.embedding_dimensions}`);
  console.log(`🤖 Model: ${output.embedding_model}`);
  
  console.log('\n🧪 VALIDATION:');
  if (embeddedChunks.length === chunks.length) {
    console.log(`   ✅ All ${chunks.length} chunks embedded successfully`);
  } else {
    console.warn(`   ⚠️  Expected ${chunks.length} but embedded ${embeddedChunks.length}`);
  }
  
  // Check embedding dimensions
  const allSameSize = embeddedChunks.every(c => c.embedding.length === output.embedding_dimensions);
  if (allSameSize) {
    console.log(`   ✅ All embeddings have ${output.embedding_dimensions} dimensions`);
  } else {
    console.warn(`   ⚠️  Inconsistent embedding dimensions!`);
  }
  
  console.log('\n✅ STEP 1.5-1.6 COMPLETE - Embeddings generated and stored!');
  
  return output;
}

// Run
generateAndStoreEmbeddings().catch(console.error);

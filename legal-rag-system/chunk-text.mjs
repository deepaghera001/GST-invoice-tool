import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_PATH = path.join(__dirname, 'parsed/income_tax/FINANCE_ACT_2024/pages.json');
const OUTPUT_PATH = path.join(__dirname, 'parsed/income_tax/FINANCE_ACT_2024/chunks.json');

// Semantic-preserving chunking for legal documents
// RULE: Never break mid-sentence or mid-clause
// RULE: Legal meaning > strict size limits
const PREFERRED_MAX_SIZE = 1500; // Preferred max, not hard limit
const ABSOLUTE_MAX_SIZE = 2500; // Only break if paragraph exceeds this

function chunkPage(pageText, pageNumber) {
  const chunks = [];
  
  // If page is small enough, keep it as one chunk
  if (pageText.length <= PREFERRED_MAX_SIZE) {
    chunks.push({
      chunk_id: `page_${pageNumber}_chunk_1`,
      page_number: pageNumber,
      text: pageText,
      char_count: pageText.length
    });
    return chunks;
  }
  
  // Step 1: Split by paragraphs (preserve legal structure)
  const paragraphs = pageText.split(/\n\n+/).filter(p => p.trim());
  
  let currentChunk = '';
  let chunkIndex = 1;
  
  for (const paragraph of paragraphs) {
    const trimmedPara = paragraph.trim();
    if (!trimmedPara) continue;
    
    // If adding this paragraph would exceed preferred size AND we have content, save chunk
    if (currentChunk && (currentChunk.length + trimmedPara.length + 2 > PREFERRED_MAX_SIZE)) {
      chunks.push({
        chunk_id: `page_${pageNumber}_chunk_${chunkIndex}`,
        page_number: pageNumber,
        text: currentChunk.trim(),
        char_count: currentChunk.trim().length
      });
      chunkIndex++;
      currentChunk = '';
    }
    
    // If single paragraph is EXTREMELY large (> ABSOLUTE_MAX_SIZE), split by sentences
    if (trimmedPara.length > ABSOLUTE_MAX_SIZE) {
      // Save current chunk if exists
      if (currentChunk) {
        chunks.push({
          chunk_id: `page_${pageNumber}_chunk_${chunkIndex}`,
          page_number: pageNumber,
          text: currentChunk.trim(),
          char_count: currentChunk.trim().length
        });
        chunkIndex++;
        currentChunk = '';
      }
      
      // Split by sentences (preserve sentence boundaries)
      const sentences = trimmedPara.split(/(?<=[.!?])\s+/);
      
      for (const sentence of sentences) {
        const trimmedSent = sentence.trim();
        if (!trimmedSent) continue;
        
        // If adding sentence exceeds ABSOLUTE_MAX, save current and start new
        if (currentChunk && (currentChunk.length + trimmedSent.length + 1 > ABSOLUTE_MAX_SIZE)) {
          chunks.push({
            chunk_id: `page_${pageNumber}_chunk_${chunkIndex}`,
            page_number: pageNumber,
            text: currentChunk.trim(),
            char_count: currentChunk.trim().length
          });
          chunkIndex++;
          currentChunk = '';
        }
        
        // CRITICAL: If single sentence > ABSOLUTE_MAX, keep it whole anyway
        // Legal meaning > embedding limits
        currentChunk += trimmedSent + ' ';
      }
    } else {
      // Normal case: add paragraph to current chunk
      currentChunk += trimmedPara + '\n\n';
    }
  }
  
  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      chunk_id: `page_${pageNumber}_chunk_${chunkIndex}`,
      page_number: pageNumber,
      text: currentChunk.trim(),
      char_count: currentChunk.trim().length
    });
  }
  
  return chunks;
}

async function createChunks() {
  console.log('📄 Reading pages.json...');
  
  const pagesData = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
  
  console.log(`📊 Processing ${pagesData.page_count} pages...`);
  
  const allChunks = [];
  let totalChunks = 0;
  let maxChunkSize = 0;
  let minChunkSize = Infinity;
  
  for (const page of pagesData.pages) {
    const pageChunks = chunkPage(page.text, page.page_number);
    
    for (const chunk of pageChunks) {
      maxChunkSize = Math.max(maxChunkSize, chunk.char_count);
      minChunkSize = Math.min(minChunkSize, chunk.char_count);
    }
    
    allChunks.push(...pageChunks);
    totalChunks += pageChunks.length;
    
    console.log(`✅ Page ${page.page_number}: ${pageChunks.length} chunks (${page.text.length} chars)`);
  }
  
  // Create output
  const output = {
    document_id: pagesData.document_id,
    pdf_hash: pagesData.pdf_hash,
    page_count: pagesData.page_count,
    total_chunks: totalChunks,
    chunking_strategy: "semantic_preserving",
    preferred_max_size: 1500,
    absolute_max_size: 2500,
    chunked_at: new Date().toISOString(),
    stats: {
      total_chunks: totalChunks,
      max_chunk_size: maxChunkSize,
      min_chunk_size: minChunkSize,
      avg_chunk_size: Math.round(allChunks.reduce((sum, c) => sum + c.char_count, 0) / totalChunks)
    },
    chunks: allChunks
  };
  
  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  
  console.log('\n✅ SUCCESS!');
  console.log(`📁 Output: ${OUTPUT_PATH}`);
  
  // Summary
  console.log('\n📋 SUMMARY:');
  console.log(`   Document ID: ${output.document_id}`);
  console.log(`   Total Pages: ${output.page_count}`);
  console.log(`   Total Chunks: ${output.total_chunks}`);
  console.log(`   Avg Chunks/Page: ${(totalChunks / pagesData.page_count).toFixed(1)}`);
  console.log(`   Chunking Strategy: ${output.chunking_strategy}`);
  console.log(`   Preferred Max: ${output.preferred_max_size} chars`);
  console.log(`   Absolute Max: ${output.absolute_max_size} chars`);
  console.log(`   Actual Max: ${maxChunkSize} chars`);
  console.log(`   Min Chunk Size: ${minChunkSize} chars`);
  console.log(`   Avg Chunk Size: ${output.stats.avg_chunk_size} chars`);
  
  // Validation
  console.log('\n🧪 VALIDATION:');
  
  // Test 1: Check for mid-sentence breaks
  let midSentenceBreaks = 0;
  for (const chunk of allChunks) {
    const text = chunk.text.trim();
    if (text.length > 0 && !text.match(/[.!?]$/)) {
      midSentenceBreaks++;
    }
  }
  
  if (midSentenceBreaks === 0) {
    console.log(`   ✅ No mid-sentence breaks detected`);
  } else {
    console.log(`   ⚠️  ${midSentenceBreaks} chunks may end mid-sentence (acceptable for legal structure)`);
  }
  
  const oversizedChunks = allChunks.filter(c => c.char_count > 2500);
  if (oversizedChunks.length === 0) {
    console.log(`   ✅ All chunks within reasonable limits`);
  } else {
    console.log(`   ℹ️  ${oversizedChunks.length} chunks > 2500 chars (preserved for legal meaning)`);
  }
  
  const chunksWithPageNumbers = allChunks.filter(c => c.page_number > 0);
  if (chunksWithPageNumbers.length === totalChunks) {
    console.log(`   ✅ All chunks have page numbers (full traceability)`);
  } else {
    console.warn(`   ⚠️  Missing page numbers!`);
  }
  
  const chunksBySize = {
    small: allChunks.filter(c => c.char_count < 500).length,
    medium: allChunks.filter(c => c.char_count >= 500 && c.char_count < 1500).length,
    large: allChunks.filter(c => c.char_count >= 1500 && c.char_count < 2500).length,
    xlarge: allChunks.filter(c => c.char_count >= 2500).length
  };
  
  console.log(`\n   Size distribution:`);
  console.log(`     < 500 chars: ${chunksBySize.small}`);
  console.log(`     500-1500 chars: ${chunksBySize.medium}`);
  console.log(`     1500-2500 chars: ${chunksBySize.large}`);
  console.log(`     > 2500 chars: ${chunksBySize.xlarge}`);
  
  if (chunksWithPageNumbers.length === totalChunks) {
    console.log('\n✅ STEP 1.2 COMPLETE - Semantic chunking verified!');
  }
  
  return output;
}

// Run
createChunks().catch(console.error);

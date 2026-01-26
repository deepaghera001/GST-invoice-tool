# OpenRouter Setup (Free Tier)

## 1. Get Free API Key

1. Go to https://openrouter.ai/
2. Sign up (free, no credit card)
3. Get your API key from dashboard
4. Free tier: ~25 requests/day (enough for testing)

## 2. Set Environment Variable

```bash
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
```

Or add to `.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## 3. Test

```bash
cd legal-rag-system
EXTRACTION_PROVIDER=openrouter node test-extract-tax-slabs.mjs
```

## Available Models (Free Tier)

- `anthropic/claude-3.5-sonnet` - **BEST for legal text** ✅
- `openai/gpt-4o-mini` - Good, faster
- `google/gemini-pro` - Alternative

## Why OpenRouter for Legal RAG?

✅ **Claude Sonnet** - Best at following schemas + legal reasoning
✅ **Free tier sufficient** - 25 req/day = plenty for Stage 2-3 testing
✅ **Standard API** - OpenAI-compatible, easy integration
✅ **Pay-as-you-go** - Only pay if you scale (very cheap)
✅ **Multiple models** - Can compare Claude vs GPT vs Gemini

## Cost (if you upgrade)

- Claude Sonnet: ~$3 per 1M input tokens
- For 100 extractions: ~$0.30
- **Stage 2-3 total cost: < $5**

## Alternative: Google AI Studio (Gemini - Free)

If OpenRouter free tier runs out:

1. Go to https://aistudio.google.com/
2. Get free API key
3. Use Gemini API (generous free tier)

```bash
export GOOGLE_AI_API_KEY="your-key"
```

Good at structured output, different API style.

## Recommendation

**Start with OpenRouter** because:
- Claude Sonnet is THE BEST at legal schemas
- Free tier covers all testing
- Minimal code changes (already implemented)
- If it works, production cost is tiny (~$5-10/month)

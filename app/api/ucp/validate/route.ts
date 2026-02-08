import { NextRequest, NextResponse } from 'next/server';
import { validateUCP } from '@/lib/ucp/validator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { manifest, mode = 'json', url } = body;

    let manifestToValidate = manifest;

    // Handle URL mode - fetch manifest server-side to avoid CORS issues
    if (mode === 'url' && url) {
      let fetchUrl = url.trim();

      // Auto-detect protocol if missing
      if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
        fetchUrl = `https://${fetchUrl}`;
      }

      // Auto-append .well-known/ucp if only a domain is provided
      try {
        const parsedUrl = new URL(fetchUrl);
        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') {
          fetchUrl = new URL('/.well-known/ucp', fetchUrl).toString();
        }
      } catch (e) {
        // Fallback to original URL if parsing fails
      }

      try {
        const response = await fetch(fetchUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'UCP-Validator/1.0',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
          return NextResponse.json(
            {
              error: `Failed to fetch URL: HTTP ${response.status} ${response.statusText}`,
              details: `The server at ${url} returned an error response.`
            },
            { status: 400 }
          );
        }

        // Check content type
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
          console.warn(`[API] Non-JSON content type from ${url}: ${contentType}`);
        }

        manifestToValidate = await response.text();

        if (!manifestToValidate) {
          return NextResponse.json(
            { error: 'Empty response from URL' },
            { status: 400 }
          );
        }
      } catch (fetchError) {
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
        console.error('[API] URL fetch error:', errorMessage);

        return NextResponse.json(
          {
            error: 'Failed to fetch manifest from URL',
            details: errorMessage.includes('aborted')
              ? 'Request timed out after 10 seconds'
              : errorMessage
          },
          { status: 400 }
        );
      }
    }

    if (!manifestToValidate) {
      return NextResponse.json(
        { error: 'Manifest is required' },
        { status: 400 }
      );
    }

    // Ensure we pass a string to the validator (it expects JSON text)
    if (typeof manifestToValidate !== 'string') {
      try {
        manifestToValidate = JSON.stringify(manifestToValidate);
      } catch (err) {
        return NextResponse.json(
          { error: 'Manifest must be valid JSON', details: err instanceof Error ? err.message : String(err) },
          { status: 400 }
        );
      }
    }

    // Validate the manifest (pass the actual mode provided)
    const result = validateUCP(manifestToValidate, mode as 'json' | 'url');

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Validation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate manifest',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

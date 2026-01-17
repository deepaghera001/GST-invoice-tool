# Font Download Instructions

To ensure consistent PDF rendering across all environments, download these fonts:

## Required Fonts

### Inter Font Family
Download from: https://fonts.google.com/specimen/Inter

**Required files:**
- `Inter-Regular.woff2` (font-weight: 400)
- `Inter-SemiBold.woff2` (font-weight: 600)
- `Inter-Bold.woff2` (font-weight: 700)

### Noto Sans (for ₹ symbol support)
Download from: https://fonts.google.com/specimen/Noto+Sans

**Required file:**
- `NotoSans-Regular.woff2` (font-weight: 400)

## Quick Download Steps

### Option 1: Google Fonts (Recommended)

1. Visit https://fonts.google.com/specimen/Inter
2. Click "Get font" → "Download all"
3. Extract and find the `woff2` files in `static/` folder
4. Copy Inter-Regular.woff2, Inter-SemiBold.woff2, Inter-Bold.woff2 to this folder

5. Visit https://fonts.google.com/specimen/Noto+Sans
6. Click "Get font" → "Download all"
7. Extract and find NotoSans-Regular.woff2
8. Copy to this folder

### Option 2: Direct Download (Faster)

Use `google-webfonts-helper`:

```bash
# From this directory, run:

# Download Inter
curl -o Inter-Regular.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
curl -o Inter-SemiBold.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2"
curl -o Inter-Bold.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2"

# Download Noto Sans
curl -o NotoSans-Regular.woff2 "https://fonts.gstatic.com/s/notosans/v36/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A9-0.woff2"
```

## Verify Files

After downloading, this folder should contain:

```
public/fonts/
  ├── Inter-Regular.woff2
  ├── Inter-SemiBold.woff2
  ├── Inter-Bold.woff2
  ├── NotoSans-Regular.woff2
  └── DOWNLOAD_FONTS.md (this file)
```

Total size: ~400KB (optimized for invoices & documents)

## Why These Fonts?

- **Inter**: Professional, readable, excellent for business documents
- **Noto Sans**: Unicode coverage for ₹, €, £ and other currency symbols
- **WOFF2**: Modern format, smallest file size, supported by Chromium/Playwright

Once downloaded, the fonts will be:
1. Bundled with your app
2. Loaded deterministically in PDFs
3. Identical in local dev and production
4. Independent of OS-installed fonts

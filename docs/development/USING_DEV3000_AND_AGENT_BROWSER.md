# Using dev3000 and agent-browser for Development

This guide explains how to use **dev3000** and **agent-browser** for enhanced development and testing workflows.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [dev3000 - AI-Enabled Development Browser](#dev3000---ai-enabled-development-browser)
- [agent-browser - Browser Automation CLI](#agent-browser---browser-automation-cli)
- [Integration with AI Coding Assistants](#integration-with-ai-coding-assistants)
- [Common Workflows](#common-workflows)
- [Files to Git Ignore](#files-to-git-ignore)

---

## Overview

### dev3000
An AI-enabled browser for development that captures:
- **Server logs** (timestamped)
- **Browser events** (logs, errors, user interactions)
- **Network requests** (complete HTTP requests & responses)
- **Screenshots** (on errors & navigation)

All data is available through MCP (Model Context Protocol) for AI assistants.

### agent-browser
A headless browser automation CLI for AI agents with:
- 50+ commands for navigation, forms, screenshots, network, storage
- Accessibility tree with unique refs (@e1, @e2) for deterministic element selection
- Fast Rust CLI with Node.js fallback

---

## Installation

Both tools are already installed globally for this project:

```bash
# Already installed globally
npm i -g dev3000
npm i -g agent-browser
agent-browser install  # Downloads Chromium
```

**Verify installation:**
```bash
command -v d3k && command -v dev3000 && command -v agent-browser
```

---

## dev3000 - AI-Enabled Development Browser

### Starting dev3000

**Basic usage:**
```bash
# Navigate to project directory
cd pdf-generation-tool-4

# Start dev3000 (automatically detects Next.js)
d3k

# Or with specific options
d3k --no-tui          # Disable TUI mode
d3k --debug           # Enable debug logging
d3k --port 3000       # Specify port
```

**What happens:**
1. Starts your Next.js dev server
2. Launches a monitored Chrome browser
3. Starts MCP server on port 3684
4. Captures all events in a unified timeline

### Accessing dev3000 Resources

When dev3000 is running, you can access:

- **Your App**: http://localhost:3000
- **MCP Server**: http://localhost:3684
- **Visual Timeline**: http://localhost:3684/logs?project=my-v0-project-6a84a0

### MCP Server Endpoints

The MCP server provides AI assistants with real-time access to:
- Server logs from Next.js
- Browser console logs and errors
- Network request/response data
- Screenshots on navigation and errors
- User interaction events

### Configuration Files

dev3000 creates several configuration files for AI assistant integration:

- `.cursor/mcp.json` - For Cursor IDE
- `.mcp.json` - General MCP configuration
- `opencode.json` - For OpenCode IDE
- `.agents/skills/` - AI skills and best practices

**These files are auto-generated and should NOT be committed** (already added to .gitignore).

### Stopping dev3000

Press `Ctrl+C` in the terminal to stop:
- Dev server
- Browser
- MCP server

---

## agent-browser - Browser Automation CLI

### Basic Usage

agent-browser provides a CLI for automating browser interactions.

**Core workflow:**
```bash
# 1. Open a page
agent-browser open http://localhost:3000

# 2. Get interactive elements (with refs)
agent-browser snapshot -i

# 3. Interact using refs from snapshot
agent-browser click @e1
agent-browser fill @e2 "test value"

# 4. Take screenshot
agent-browser screenshot /tmp/page.png

# 5. Close browser
agent-browser close
```

### Common Commands

**Navigation:**
```bash
agent-browser open <url>
agent-browser back
agent-browser forward
agent-browser reload
```

**Interaction:**
```bash
agent-browser click @e1              # Click by ref
agent-browser fill @e2 "text"        # Fill input
agent-browser type @e3 "text"        # Type text
agent-browser press Enter            # Press key
agent-browser hover @e1              # Hover element
```

**Information:**
```bash
agent-browser snapshot               # Get accessibility tree
agent-browser snapshot -i            # Interactive elements only
agent-browser get text @e1           # Get element text
agent-browser get url                # Get current URL
agent-browser screenshot page.png    # Take screenshot
```

**Advanced:**
```bash
agent-browser wait @e1                    # Wait for element
agent-browser wait --text "Success"       # Wait for text
agent-browser wait --url "**/dashboard"   # Wait for URL pattern
agent-browser network requests            # View network requests
```

### Example: Testing Salary Slip Form

```bash
# Start browser and navigate
agent-browser open http://localhost:3000/salary-slip

# Get form elements
agent-browser snapshot -i

# Fill form (example output shows refs)
agent-browser fill @e6 "EMP12345"           # Employee ID
agent-browser fill @e7 "John Doe"           # Name
agent-browser fill @e8 "Software Engineer"  # Designation

# Take screenshot
agent-browser screenshot /tmp/salary-form.png

# Close browser
agent-browser close
```

---

## Integration with AI Coding Assistants

### How AI Assistants Use These Tools

When dev3000 is running, AI assistants (like me) can:

1. **Query the MCP server** for real-time development data
2. **See server logs** when debugging backend issues
3. **View browser console errors** when debugging frontend
4. **Inspect network requests** to debug API calls
5. **View screenshots** to understand UI state
6. **See the complete timeline** of events

### Example AI Debugging Workflow

```
User: "The salary slip form isn't submitting"

AI can:
1. Query MCP for recent browser errors
2. Check network requests to see if API is being called
3. View screenshots to see current UI state
4. Check server logs for backend errors
5. Provide targeted debugging suggestions
```

---

## Common Workflows

### Workflow 1: Development with Full Monitoring

```bash
# Terminal 1: Start dev3000
cd pdf-generation-tool-4
d3k

# This opens Chrome with your app at localhost:3000
# Interact with the app normally in the browser
# AI assistants can see everything happening
```

### Workflow 2: Automated Testing

```bash
# Terminal 1: Start regular dev server in background
cd pdf-generation-tool-4
npm run dev > /tmp/nextjs-dev.log 2>&1 &

# Terminal 2: Run automated tests
agent-browser open http://localhost:3000/salary-slip
agent-browser snapshot -i
agent-browser fill @e6 "TEST001"
agent-browser fill @e7 "Test User"
agent-browser screenshot /tmp/test.png
agent-browser close
```

### Workflow 3: Debugging Specific Feature

```bash
# Start dev3000 for full monitoring
d3k

# In the opened browser:
1. Navigate to the feature
2. Reproduce the issue
3. Ask AI: "What's happening with the form submission?"

# AI can now:
- Check browser console logs
- Inspect network requests
- View screenshots
- See server logs
- Provide specific debugging help
```

---

## Files to Git Ignore

The following files are generated by dev3000/agent-browser and **should NOT be committed**:

```gitignore
# dev3000 / MCP files
.agents/
.cursor/mcp.json
.mcp.json
opencode.json
```

These files are already added to `.gitignore` for you.

### Why Not Commit These Files?

- **`.agents/skills/`** - Contains AI skills that dev3000 downloads, project-specific configuration
- **`.cursor/mcp.json`** - IDE-specific, contains local port configurations
- **`.mcp.json`** - Same as above
- **`opencode.json`** - IDE-specific configuration

These files are auto-generated and may contain local paths or configurations specific to your machine.

---

## Troubleshooting

### dev3000 Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Remove lock file
rm -f /var/folders/*/T/dev3000-my-v0-project-*.lock
```

**tmux warning:**
```bash
# Install tmux (optional, for split-screen mode)
brew install tmux
```

### agent-browser Issues

**Browser not found:**
```bash
# Reinstall Chromium
agent-browser install
```

**Connection refused:**
```bash
# Make sure dev server is running
npm run dev

# Wait a few seconds for server to start
```

---

## Additional Resources

- **dev3000 Documentation**: https://dev3000.ai/
- **agent-browser Documentation**: https://agent-browser.dev/
- **dev3000 GitHub**: https://github.com/vercel-labs/dev3000
- **agent-browser GitHub**: https://github.com/vercel-labs/agent-browser
- **MCP Protocol**: https://modelcontextprotocol.io/

---

## Quick Reference

### dev3000 Commands
```bash
d3k                    # Start with auto-detection
d3k --debug            # Debug mode
d3k --no-tui          # No TUI mode
d3k --port 3000       # Specify port
d3k --kill-mcp        # Kill MCP server
```

### agent-browser Commands
```bash
agent-browser open <url>                # Open page
agent-browser snapshot -i               # Get interactive elements
agent-browser click @e1                 # Click element
agent-browser fill @e2 "text"          # Fill input
agent-browser screenshot page.png       # Screenshot
agent-browser close                     # Close browser
```

### MCP Server URLs
```
App: http://localhost:3000
MCP: http://localhost:3684
Timeline: http://localhost:3684/logs?project=my-v0-project-6a84a0
```

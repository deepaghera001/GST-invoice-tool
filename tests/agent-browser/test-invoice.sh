#!/bin/bash
# Test Invoice Form with agent-browser

set -e

echo "🧪 Testing Invoice Form..."

# Open invoice page
agent-browser open http://localhost:3000/invoice

# Get interactive elements (needed for refs)
agent-browser snapshot -i > /dev/null

# Fill company details
agent-browser fill @e4 "Acme Corporation Pvt Ltd"
agent-browser fill @e5 "123 Business Park, Mumbai, Maharashtra 400001"
agent-browser fill @e6 "27AAAAA0000A1Z5"

# Fill customer details
agent-browser fill @e7 "Tech Solutions Ltd"
agent-browser fill @e8 "456 Tech Tower, Bangalore, Karnataka 560001"
agent-browser fill @e9 "29BBBBB0000B1Z6"

# Generate invoice number and fill date
agent-browser click @e12
agent-browser fill @e11 "2026-01-23"

# Fill line items
agent-browser fill @e13 "Web Development Services"
agent-browser fill @e14 "1"
agent-browser fill @e15 "50000"

# Select 18% GST
agent-browser click @e21

# Take screenshot
agent-browser screenshot ~/Downloads/invoice-test.png

# Download PDF
agent-browser click @e25

# Wait for PDF generation
sleep 3

# Close browser
agent-browser close

echo "✅ Invoice test completed! Check ~/Downloads/invoice-test.png"

#!/bin/bash
# Run all agent-browser tests

set -e

echo "🚀 Starting all agent-browser tests..."
echo ""

# Make scripts executable
chmod +x tests/agent-browser/*.sh

# Run invoice test
echo "📝 Running Invoice Test..."
./tests/agent-browser/test-invoice.sh
echo ""

# Wait between tests
sleep 2

# Run salary slip test
echo "💰 Running Salary Slip Test..."
./tests/agent-browser/test-salary-slip.sh
echo ""

echo "✅ All tests completed successfully!"

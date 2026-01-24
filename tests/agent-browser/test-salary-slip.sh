#!/bin/bash
# Test Salary Slip Form with agent-browser

set -e

echo "🧪 Testing Salary Slip Form..."

# Open salary slip page
agent-browser open http://localhost:3000/salary-slip

# Fill employee details
agent-browser fill @e6 "EMP001"
agent-browser fill @e7 "Rahul Sharma"
agent-browser fill @e8 "Senior Developer"
agent-browser fill @e9 "Engineering"
agent-browser fill @e10 "2020-01-15"
agent-browser fill @e11 "ABCDE1234F"

# Fill company details
agent-browser fill @e13 "Tech Corp Pvt Ltd"
agent-browser fill @e14 "123 Tech Park, Bangalore"
agent-browser fill @e15 "AAACT1234D"

# Fill salary components
agent-browser fill @e18 "50000"  # Basic Salary
agent-browser fill @e20 "15000"  # HRA
agent-browser fill @e23 "6000"   # PF

# Fill bank details
agent-browser fill @e27 "HDFC Bank"
agent-browser fill @e28 "Rahul Sharma"
agent-browser fill @e29 "123456789012"
agent-browser fill @e30 "HDFC0001234"

# Take screenshot
agent-browser screenshot ~/Downloads/salary-slip-test.png

# Download PDF
agent-browser snapshot -i | grep -i "download" | head -1

# Close browser
agent-browser close

echo "✅ Salary slip test completed! Check ~/Downloads/salary-slip-test.png"

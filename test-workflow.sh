#!/bin/bash

echo "🧪 Testing Complete Resume Matcher Workflow"
echo "==========================================="

# 1. Health check NLP service
echo -e "\n1️⃣ Testing NLP Service..."
curl -s http://localhost:8000/health | jq

# 2. Health check Next.js
echo -e "\n2️⃣ Testing Next.js API..."
curl -s http://localhost:3000/api/health | jq

echo -e "\n✅ Basic health checks complete!"
echo -e "\n📝 Manual testing steps:"
echo "1. Upload a resume at http://localhost:3000/upload"
echo "2. Create a job at http://localhost:3000/jobs"
echo "3. Click 'Auto-Match All' in dashboard"
echo "4. View results at http://localhost:3000/dashboard"
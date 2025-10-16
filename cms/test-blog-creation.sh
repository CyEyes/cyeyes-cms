#!/bin/bash

echo "🧪 Testing Blog Creation"
echo "========================"
echo ""

# Get token
echo "1️⃣  Logging in..."
TOKEN=$(docker exec cyeyes-cms-backend node -e '
const http = require("http");
const data = JSON.stringify({email: "admin@cyeyes.com", password: "Admin123!"});
const options = {hostname: "localhost", port: 3000, path: "/api/auth/login", method: "POST", headers: {"Content-Type": "application/json"}};
const req = http.request(options, res => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log(JSON.parse(body).accessToken));
});
req.write(data);
req.end();
' 2>&1 | tail -1)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:30}..."
echo ""

# Test create blog
echo "2️⃣  Creating blog post..."
RESPONSE=$(docker exec cyeyes-cms-backend node -e "
const http = require('http');
const data = JSON.stringify({
  slug: 'test-blog-' + Date.now(),
  titleEn: 'Test Blog Post',
  titleVi: 'Bài viết thử nghiệm',
  contentEn: 'This is test content',
  contentVi: 'Đây là nội dung thử nghiệm',
  status: 'draft'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/blogs/admin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $TOKEN'
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', err => console.error('Error:', err.message));
req.write(data);
req.end();
" 2>&1)

echo "$RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"message":"Blog post created successfully"'; then
  echo "✅ Blog created successfully!"
else
  echo "❌ Blog creation failed!"
  echo ""
  echo "Checking database state..."
  docker exec cyeyes-cms-backend node -e '
const Database = require("better-sqlite3");
const db = new Database("/app/database/cyeyes.db");
console.log("Users:", db.prepare("SELECT id, email FROM users").all());
console.log("Blogs:", db.prepare("SELECT id, slug, author_id FROM blog_posts LIMIT 5").all());
db.close();
'
fi

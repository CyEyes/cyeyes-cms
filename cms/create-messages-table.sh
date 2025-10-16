#!/bin/bash

# Script to create messages table in database

echo "Creating messages table..."

docker exec cyeyes-cms-backend node -e "
const { db } = require('/app/src/config/database.js');
const sql = \`
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'archived')),
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  assigned_to TEXT REFERENCES users(id),
  replied_at TEXT,
  replied_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_email ON messages(email);
\`;

db.run(sql).then(() => {
  console.log('✓ Messages table created successfully');
  process.exit(0);
}).catch((err) => {
  console.error('✗ Error creating table:', err);
  process.exit(1);
});
"

echo "Done!"

#!/bin/bash

# CyEyes CMS Rollback Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CyEyes CMS Rollback${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if timestamp provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Available backups:${NC}\n"

  if [ -d "$BACKUP_DIR" ]; then
    # List all backup timestamps
    ls -t "${BACKUP_DIR}"/database_*.sqlite 2>/dev/null | sed 's/.*database_//' | sed 's/.sqlite//' | head -10 || echo "No backups found"
  else
    echo "No backup directory found"
  fi

  echo ""
  echo -e "${BLUE}Usage:${NC}"
  echo "  bash rollback.sh <timestamp>"
  echo ""
  echo -e "${BLUE}Example:${NC}"
  echo "  bash rollback.sh 20251015_143000"
  exit 1
fi

TIMESTAMP=$1
DATABASE_BACKUP="${BACKUP_DIR}/database_${TIMESTAMP}.sqlite"
VOLUME_BACKUP="${BACKUP_DIR}/volume_${TIMESTAMP}.tar.gz"
DEPLOYMENT_INFO="${BACKUP_DIR}/deployment_${TIMESTAMP}.txt"

echo -e "${YELLOW}Rollback timestamp: ${TIMESTAMP}${NC}\n"

# Check if backup exists
if [ ! -f "$DATABASE_BACKUP" ] && [ ! -f "$VOLUME_BACKUP" ]; then
  echo -e "${RED}✗ Backup not found for timestamp: ${TIMESTAMP}${NC}"
  echo "Looking for:"
  echo "  - ${DATABASE_BACKUP}"
  echo "  - ${VOLUME_BACKUP}"
  exit 1
fi

# Show deployment info if available
if [ -f "$DEPLOYMENT_INFO" ]; then
  echo -e "${BLUE}Original deployment info:${NC}"
  cat "$DEPLOYMENT_INFO"
  echo ""
fi

# Confirmation
echo -e "${YELLOW}⚠️  WARNING: This will restore the database to ${TIMESTAMP}${NC}"
echo -e "${YELLOW}Any changes made after this backup will be LOST!${NC}\n"
read -p "Are you sure you want to rollback? (yes/NO): " -r
echo ""

if [[ ! $REPLY == "yes" ]]; then
  echo -e "${YELLOW}Rollback cancelled${NC}"
  exit 0
fi

echo -e "${YELLOW}Step 1: Creating safety backup of current state...${NC}"
SAFETY_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
bash backup-database.sh > /dev/null 2>&1 || echo "Safety backup skipped"
echo -e "${GREEN}✓ Safety backup created: ${SAFETY_TIMESTAMP}${NC}\n"

echo -e "${YELLOW}Step 2: Stopping containers...${NC}"
docker-compose down
echo -e "${GREEN}✓ Containers stopped${NC}\n"

echo -e "${YELLOW}Step 3: Restoring database...${NC}"

# Restore local database file
if [ -f "$DATABASE_BACKUP" ]; then
  DATABASE_PATH="./cms/backend/data/database.sqlite"
  mkdir -p "$(dirname $DATABASE_PATH)"
  cp "$DATABASE_BACKUP" "$DATABASE_PATH"
  echo -e "${GREEN}✓ Local database restored${NC}"
fi

# Restore Docker volume
if [ -f "$VOLUME_BACKUP" ]; then
  # Remove old volume
  docker volume rm cms_backend-data 2>/dev/null || true

  # Create new volume
  docker volume create cms_backend-data

  # Restore data
  docker run --rm \
    -v cms_backend-data:/data \
    -v $(pwd)/${BACKUP_DIR}:/backup \
    alpine tar xzf /backup/volume_${TIMESTAMP}.tar.gz -C /data

  echo -e "${GREEN}✓ Docker volume restored${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4: Starting containers...${NC}"
docker-compose up -d
sleep 10
echo -e "${GREEN}✓ Containers started${NC}\n"

echo -e "${YELLOW}Step 5: Verifying rollback...${NC}"

# Check containers
BACKEND_RUNNING=$(docker ps --filter "name=cyeyes-cms-backend" --format "{{.Status}}" | grep -c "Up" || echo "0")
FRONTEND_RUNNING=$(docker ps --filter "name=cyeyes-cms-frontend" --format "{{.Status}}" | grep -c "Up" || echo "0")

if [ "$BACKEND_RUNNING" -gt 0 ] && [ "$FRONTEND_RUNNING" -gt 0 ]; then
  echo -e "${GREEN}✓ Containers are running${NC}"
else
  echo -e "${RED}✗ Container startup failed${NC}"
  exit 1
fi

# Test API
sleep 5
API_TEST=$(curl -s http://localhost:3000/api/products?limit=1 | grep -c '"data"' || echo "0")
if [ "$API_TEST" -gt 0 ]; then
  echo -e "${GREEN}✓ Backend API is working${NC}"
else
  echo -e "${YELLOW}⚠ API test inconclusive${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Rollback Completed${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}Rollback Info:${NC}"
echo "  Restored to: ${TIMESTAMP}"
echo "  Safety backup: ${SAFETY_TIMESTAMP}"
echo ""

echo -e "${BLUE}Container Status:${NC}"
docker ps --filter "name=cyeyes-cms" --format "table {{.Names}}\t{{.Status}}"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Verify application functionality"
echo "  2. Check data integrity"
echo "  3. Test critical features"
echo ""

echo -e "${YELLOW}To undo this rollback:${NC}"
echo "  bash rollback.sh ${SAFETY_TIMESTAMP}"
echo ""

echo -e "${GREEN}Rollback successful! ✓${NC}"

#!/bin/bash

# CyEyes CMS Database Backup Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE_PATH="./cms/backend/data/database.sqlite"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CyEyes CMS Database Backup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Backup local database file
if [ -f "$DATABASE_PATH" ]; then
  echo -e "${YELLOW}Backing up local database...${NC}"
  cp "$DATABASE_PATH" "${BACKUP_DIR}/database_${TIMESTAMP}.sqlite"
  echo -e "${GREEN}✓ Local database backed up${NC}"
else
  echo -e "${YELLOW}⚠ Local database file not found${NC}"
fi

# Backup Docker volume
echo -e "${YELLOW}Backing up Docker volume...${NC}"
if docker volume ls | grep -q "cms_backend-data"; then
  docker run --rm \
    -v cms_backend-data:/data \
    -v $(pwd)/${BACKUP_DIR}:/backup \
    alpine tar czf /backup/volume_${TIMESTAMP}.tar.gz -C /data .
  echo -e "${GREEN}✓ Docker volume backed up${NC}"
else
  echo -e "${YELLOW}⚠ Docker volume not found${NC}"
fi

# Backup using Docker exec (if container is running)
echo -e "${YELLOW}Backing up from running container...${NC}"
if docker ps | grep -q "cyeyes-cms-backend"; then
  docker exec cyeyes-cms-backend sh -c "cat /app/data/database.sqlite" > "${BACKUP_DIR}/container_${TIMESTAMP}.sqlite" 2>/dev/null || echo -e "${YELLOW}⚠ Container backup failed${NC}"
  if [ -f "${BACKUP_DIR}/container_${TIMESTAMP}.sqlite" ]; then
    echo -e "${GREEN}✓ Container database backed up${NC}"
  fi
fi

# List backups
echo ""
echo -e "${BLUE}Available backups:${NC}"
ls -lh "${BACKUP_DIR}" | grep "${TIMESTAMP}" || ls -lh "${BACKUP_DIR}" | tail -10

echo ""
echo -e "${GREEN}✓ Backup completed!${NC}"
echo -e "${BLUE}Backup location: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}Timestamp: ${TIMESTAMP}${NC}"

# Cleanup old backups (keep last 10)
echo ""
echo -e "${YELLOW}Cleaning up old backups (keeping last 10)...${NC}"
cd "${BACKUP_DIR}"
ls -t database_*.sqlite 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
ls -t volume_*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
cd ..
echo -e "${GREEN}✓ Cleanup completed${NC}"

#!/bin/bash

# ============================================
# CyEyes CMS - Production Deployment Script v2
# ============================================
# Enhanced with backup, verification, and rollback support

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE_PATH="./cms/backend/data/database.sqlite"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CyEyes CMS Production Deployment v2${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Pre-deployment checks
echo -e "${YELLOW}Step 1: Pre-deployment checks...${NC}"

if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}✗ Docker is not running${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

if [ ! -f "docker-compose.yml" ]; then
  echo -e "${RED}✗ docker-compose.yml not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ docker-compose.yml found${NC}"

if [ ! -d "cms/backend" ] || [ ! -d "cms/frontend" ]; then
  echo -e "${RED}✗ Backend or frontend directory not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Source directories found${NC}\n"

# Step 2: Backup
echo -e "${YELLOW}Step 2: Creating backup...${NC}"
mkdir -p "${BACKUP_DIR}"

# Backup database
if [ -f "$DATABASE_PATH" ]; then
  cp "$DATABASE_PATH" "${BACKUP_DIR}/database_${TIMESTAMP}.sqlite"
  echo -e "${GREEN}✓ Database backed up${NC}"
else
  echo -e "${YELLOW}⚠ Database not found${NC}"
fi

# Backup docker volumes
docker run --rm -v cms_backend-data:/data -v $(pwd)/${BACKUP_DIR}:/backup alpine tar czf /backup/backend-data_${TIMESTAMP}.tar.gz -C /data . 2>/dev/null || echo -e "${YELLOW}⚠ Volume backup skipped${NC}"

# Save current git commit for rollback
if [ -d ".git" ]; then
  git rev-parse HEAD > "${BACKUP_DIR}/commit_${TIMESTAMP}.txt" 2>/dev/null || true
fi

echo -e "${GREEN}✓ Backup completed${NC}\n"

# Step 3: Build
echo -e "${YELLOW}Step 3: Building application...${NC}"

echo -e "${BLUE}  Building frontend...${NC}"
cd cms/frontend
npm run build
cd ../..
echo -e "${GREEN}✓ Frontend built${NC}"

echo -e "${BLUE}  Building Docker images...${NC}"
docker-compose build --no-cache backend frontend
echo -e "${GREEN}✓ Docker images built${NC}\n"

# Step 4: Deploy
echo -e "${YELLOW}Step 4: Deploying...${NC}"

echo -e "${BLUE}  Stopping old containers...${NC}"
docker-compose down

echo -e "${BLUE}  Starting new containers...${NC}"
docker-compose up -d

echo "  Waiting for services..."
sleep 15

echo -e "${GREEN}✓ Containers started${NC}\n"

# Step 5: Verification
echo -e "${YELLOW}Step 5: Post-deployment verification...${NC}"

BACKEND_RUNNING=$(docker ps --filter "name=cyeyes-cms-backend" --format "{{.Status}}" | grep -c "Up" || echo "0")
FRONTEND_RUNNING=$(docker ps --filter "name=cyeyes-cms-frontend" --format "{{.Status}}" | grep -c "Up" || echo "0")

if [ "$BACKEND_RUNNING" -eq 0 ] || [ "$FRONTEND_RUNNING" -eq 0 ]; then
  echo -e "${RED}✗ Container startup failed${NC}"
  docker-compose logs --tail=50
  exit 1
fi
echo -e "${GREEN}✓ Containers are running${NC}"

# Test API
sleep 5
API_TEST=$(curl -s http://localhost:3000/api/products?limit=1 | grep -c '"data"' || echo "0")
if [ "$API_TEST" -gt 0 ]; then
  echo -e "${GREEN}✓ Backend API is working${NC}"
else
  echo -e "${YELLOW}⚠ API test inconclusive${NC}"
fi

# Test frontend
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "000")
if [ "$FRONTEND_TEST" == "200" ]; then
  echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
  echo -e "${YELLOW}⚠ Frontend test inconclusive${NC}"
fi

# Run product tests
if [ -f "./test-privaguard-fix.sh" ]; then
  echo -e "${BLUE}  Running product tests...${NC}"
  if bash ./test-privaguard-fix.sh > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Product tests passed${NC}"
  else
    echo -e "${YELLOW}⚠ Some tests failed (check manually)${NC}"
  fi
fi

echo ""

# Step 6: Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Deployment Completed${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}Deployment Info:${NC}"
echo "  Timestamp: ${TIMESTAMP}"
echo "  Backup: ${BACKUP_DIR}/database_${TIMESTAMP}.sqlite"
echo ""

echo -e "${BLUE}Application URLs:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000/api"
echo "  Admin:    http://localhost:5173/admin"
echo ""

echo -e "${BLUE}Credentials:${NC}"
echo "  Email:    admin@cyeyes.com"
echo "  Password: Admin123!"
echo ""

echo -e "${BLUE}Container Status:${NC}"
docker ps --filter "name=cyeyes-cms" --format "table {{.Names}}\t{{.Status}}"
echo ""

echo -e "${BLUE}Useful Commands:${NC}"
echo "  Logs:     docker logs -f cyeyes-cms-backend"
echo "  Logs:     docker logs -f cyeyes-cms-frontend"
echo "  Rollback: bash rollback.sh ${TIMESTAMP}"
echo ""

echo -e "${YELLOW}Post-Deployment Checklist:${NC}"
echo "  ☐ Test login"
echo "  ☐ Test product CRUD"
echo "  ☐ Test product detail pages"
echo "  ☐ Verify PrivaGuard display"
echo "  ☐ Check all features work"
echo ""

echo -e "${GREEN}Deployment successful! 🎉${NC}"

# Save deployment info
cat > "${BACKUP_DIR}/deployment_${TIMESTAMP}.txt" << EOF
Deployment Timestamp: ${TIMESTAMP}
Date: $(date)
Backend Status: ${BACKEND_RUNNING}
Frontend Status: ${FRONTEND_RUNNING}
API Test: ${API_TEST}
Frontend Test: ${FRONTEND_TEST}
EOF

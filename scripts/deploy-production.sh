#!/bin/bash

# ============================================
# CyEyes CMS - Production Deployment Script
# ============================================
# This script builds and deploys the CMS with all brand changes

set -e

echo "🚀 ============================================"
echo "   CyEyes CMS Production Deployment"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running from correct directory
if [ ! -f "docker-compose.yml" ]; then
  echo -e "${RED}❌ Error: Must run from /cms directory${NC}"
  echo "   cd /Users/anhnlq/Downloads/webce/cms"
  exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
  echo -e "${YELLOW}⚠️  Warning: .env.production not found${NC}"
  echo "   Creating from template..."
  cp .env.production.example .env.production 2>/dev/null || echo "   Please create .env.production manually"
fi

echo -e "${BLUE}📋 Pre-deployment Checklist:${NC}"
echo ""
echo "Before deploying, ensure you have:"
echo "  ✓ Updated .env.production with production values"
echo "  ✓ Changed JWT_SECRET to a secure random string"
echo "  ✓ Changed ADMIN_PASSWORD to a strong password"
echo "  ✓ Set CORS_ORIGIN to your production domain"
echo "  ✓ Set VITE_API_URL to your API endpoint"
echo ""
read -p "Have you completed the checklist? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}⚠️  Deployment cancelled. Please complete the checklist first.${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || echo "No containers to stop"

echo ""
echo -e "${BLUE}Step 2: Cleaning up old images...${NC}"
docker-compose down --rmi local 2>/dev/null || echo "No images to clean"

echo ""
echo -e "${BLUE}Step 3: Building backend image (with brand changes)...${NC}"
docker-compose build --no-cache backend

echo ""
echo -e "${BLUE}Step 4: Building frontend image (with brand changes)...${NC}"
docker-compose build --no-cache frontend

echo ""
echo -e "${BLUE}Step 5: Starting containers...${NC}"
docker-compose --env-file .env.production up -d

echo ""
echo -e "${BLUE}Step 6: Waiting for services to be healthy...${NC}"
echo "   This may take 30-60 seconds..."

# Wait for backend health check
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if docker-compose ps | grep -q "healthy"; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  echo -n "."
  sleep 2
done
echo ""

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
  echo -e "${RED}❌ Services did not become healthy in time${NC}"
  echo "   Check logs: docker-compose logs"
  exit 1
fi

echo ""
echo -e "${BLUE}Step 7: Running database migrations...${NC}"
docker-compose exec -T backend npm run db:push || echo "Migration may have already run"

echo ""
echo -e "${BLUE}Step 8: Seeding initial data...${NC}"
docker-compose exec -T backend npm run db:seed || echo "Data may already exist"

echo ""
echo -e "${BLUE}Step 9: Seeding PrivaGuard product...${NC}"
docker-compose exec -T backend npm run db:seed:privaguard

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "============================================"
echo -e "${BLUE}🎉 CyEyes CMS is now running!${NC}"
echo "============================================"
echo ""
echo "Services:"
echo "  Frontend: http://localhost (port 80)"
echo "  Backend:  http://localhost:3000"
echo ""
echo "Login credentials:"
echo "  Email:    admin@cyeyes.com"
echo "  Password: (from .env.production)"
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart:       docker-compose restart"
echo "  Shell access:  docker-compose exec backend sh"
echo ""
echo "Brand changes included:"
echo "  ✓ Logo: CyEyes2025.1.4.png in header"
echo "  ✓ Contact: xinchao@cyeyes.io"
echo "  ✓ Team avatars: +16% larger"
echo "  ✓ Customer logos: +33% larger"
echo "  ✓ PrivaGuard: Full product data"
echo "  ✓ Hybrid UI: Neomorphic + Glassmorphism"
echo ""
echo "============================================"

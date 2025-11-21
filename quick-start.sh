#!/bin/bash

# ==============================================
# Restaurant-Hotel ERP - Quick Start Script
# ==============================================

set -e

echo "🚀 Restaurant-Hotel ERP - Quick Start"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Create .env file if not exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > .env << 'EOF'
# Database Configuration
DB_USERNAME=app
DB_PASSWORD=app_secure_password_please_change
DB_NAME=erp

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_change_in_production
JWT_EXPIRATION=1d

# CORS Configuration (empty = allow all origins)
CORS_ORIGINS=

# NextAuth Configuration
NEXTAUTH_SECRET=another_secret_key_for_nextauth_minimum_32_chars
NEXTAUTH_URL=http://localhost:3000

# API Base URLs
API_BASE=http://localhost:4000/api
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and change the secret keys!${NC}"
    echo ""
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
    echo ""
fi

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git pull origin dev || echo -e "${YELLOW}⚠️  Could not pull latest code (skipping)${NC}"
echo ""

# Build and start services
echo -e "${YELLOW}🔨 Building and starting services...${NC}"
echo "This may take several minutes on first run..."
echo ""

docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo -e "${GREEN}✅ Services are starting...${NC}"
echo ""

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy (this may take 1-2 minutes)...${NC}"
sleep 10

# Check health
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:4000/health/ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Waiting for backend... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Backend failed to start. Check logs with: docker compose -f docker-compose.prod.yml logs backend${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Deployment Successful!${NC}"
echo "======================================"
echo ""
echo "📍 Services are available at:"
echo ""
echo "  🔹 Backend API:        http://localhost:4000/api"
echo "  🔹 API Documentation:  http://localhost:4000/api/docs"
echo "  🔹 Frontend:           http://localhost:3001"
echo "  🔹 Admin Panel:        http://localhost:3000"
echo ""
echo "📊 Check service status:"
echo "  docker compose -f docker-compose.prod.yml ps"
echo ""
echo "📋 View logs:"
echo "  docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Stop services:"
echo "  docker compose -f docker-compose.prod.yml down"
echo ""
echo -e "${YELLOW}⚠️  Next steps:${NC}"
echo "  1. Create admin user via Swagger: http://localhost:4000/api/docs"
echo "     - Navigate to 'Auth' -> POST /api/v1/auth/register"
echo "  2. Run database migrations (if needed):"
echo "     docker exec -it hotel-pms-backend npm run migration:run"
echo ""
echo "======================================"

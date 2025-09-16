#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up TwinGrid development environment...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "❌ ${YELLOW}Node.js is not installed. Please install Node.js 16+ and try again.${NC}"
    exit 1
fi

echo -e "✅ Node.js is installed ($(node -v))"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "✅ pnpm is installed ($(pnpm -v))"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "❌ ${YELLOW}Python 3 is not installed. Please install Python 3.8+ and try again.${NC}"
    exit 1
fi

echo -e "✅ Python is installed ($(python3 --version))"

# Setup backend
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "\n${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    
    echo -e "\n${YELLOW}Installing Python dependencies...${NC}"
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo -e "\n✅ Python virtual environment already exists"
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
fi

# Setup frontend
cd ../frontend

# Install Node.js dependencies
echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
pnpm install

# Create .env file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "\n${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local file. Please update it with your configuration.${NC}"
fi

# Setup database
echo -e "\n${YELLOW}Setting up database...${NC}"
cd ../backend

# Run database migrations
echo -e "\n${YELLOW}Running database migrations...${NC}"
alembic upgrade head

# Create initial data
echo -e "\n${YELLOW}Creating initial data...${NC}"
python -m app.db.init_db

echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "\nTo start the development servers, run the following commands in separate terminals:"
echo -e "1. ${YELLOW}cd backend && uvicorn app.main:app --reload${NC}"
echo -e "2. ${YELLOW}cd frontend && pnpm dev${NC}"
echo -e "\nAccess the application at ${GREEN}http://localhost:3000${NC}"

exit 0

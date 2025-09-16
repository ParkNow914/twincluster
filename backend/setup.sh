#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up TwinGrid backend...${NC}\n"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "❌ ${YELLOW}Python 3 is not installed. Please install Python 3.8+ and try again.${NC}"
    exit 1
fi

echo -e "✅ Python is installed ($(python3 --version))"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "\n${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    
    echo -e "\n${YELLOW}Upgrading pip and setuptools...${NC}"
    pip install --upgrade pip setuptools wheel
    
    echo -e "\n${YELLOW}Installing Python dependencies...${NC}"
    pip install -r requirements.txt
    
    # Install development dependencies if in development mode
    if [ "$1" = "--dev" ]; then
        echo -e "\n${YELLOW}Installing development dependencies...${NC}"
        pip install -r requirements-dev.txt
    fi
else
    echo -e "\n✅ Python virtual environment already exists"
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file. Please update it with your configuration.${NC}"
fi

# Initialize the database
echo -e "\n${YELLOW}Setting up the database...${NC}"

# Run database migrations
echo -e "\n${YELLOW}Running database migrations...${NC}"
alembic upgrade head

# Create initial data if needed
if [ "$1" = "--dev" ]; then
    echo -e "\n${YELLOW}Creating initial development data...${NC}"
    python -m app.db.init_db
fi

echo -e "\n${GREEN}🎉 Backend setup completed successfully!${NC}"
echo -e "\nTo start the development server, run:${NC}"
echo -e "${YELLOW}source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate${NC}"
echo -e "${YELLOW}uvicorn app.main:app --reload${NC}"
echo -e "\nAccess the API documentation at ${GREEN}http://localhost:8000/docs${NC}"

exit 0

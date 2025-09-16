#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  create <message>  Create a new migration"
    echo "  upgrade [revision]  Upgrade to the latest or specified revision"
    echo "  downgrade [revision]  Downgrade to the specified revision"
    echo "  history  Show migration history"
    echo "  current  Show current revision"
    echo "  heads    Show available heads"
    echo "  check    Check if there are any new operations to generate migrations"
    echo ""
    exit 1
}

# Check if alembic.ini exists
if [ ! -f "alembic.ini" ]; then
    echo -e "${RED}Error: alembic.ini not found. Please run this script from the backend directory.${NC}"
    exit 1
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    elif [ -f "venv/Scripts/activate" ]; then
        source venv/Scripts/activate
    fi
fi

# Check if alembic is installed
if ! command -v alembic &> /dev/null; then
    echo -e "${RED}Error: Alembic is not installed. Please install it with 'pip install alembic'${NC}"
    exit 1
fi

# Execute commands based on the first argument
case "$1" in
    create)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Please provide a message for the migration${NC}"
            exit 1
        fi
        echo -e "${YELLOW}Creating new migration...${NC}"
        alembic revision --autogenerate -m "$2"
        ;;
    upgrade)
        echo -e "${YELLOW}Upgrading database...${NC}"
        if [ -z "$2" ]; then
            alembic upgrade head
        else
            alembic upgrade "$2"
        fi
        ;;
    downgrade)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Please specify a revision to downgrade to${NC}"
            echo -e "  Example: $0 downgrade -1"
            echo -e "  Example: $0 downgrade a1b2c3d4e5f6"
            exit 1
        fi
        echo -e "${YELLOW}Downgrading database...${NC}"
        alembic downgrade "$2"
        ;;
    history)
        echo -e "${YELLOW}Migration history:${NC}"
        alembic history
        ;;
    current)
        echo -e "${YELLOW}Current revision:${NC}"
        alembic current
        ;;
    heads)
        echo -e "${YELLOW}Available heads:${NC}"
        alembic heads
        ;;
    check)
        echo -e "${YELLOW}Checking for new operations...${NC}"
        alembic check
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}No new operations detected.${NC}"
        fi
        ;;
    *)
        usage
        ;;
esac

echo -e "${GREEN}Done!${NC}"

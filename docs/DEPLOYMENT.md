# TwinGrid Deployment Guide

This guide provides instructions for deploying the TwinGrid application in different environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
  - [Manual Deployment](#manual-deployment)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Backup and Recovery](#backup-and-recovery)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### For All Deployments

- Git
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL 15+
- Redis 7+
- pnpm (recommended) or npm

### For Production

- Domain name with DNS access
- SSL certificates (Let's Encrypt recommended)
- Server with at least 2GB RAM (4GB+ recommended)
- Docker and Docker Compose (for containerized deployment)

## Local Development

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/twingrid.git
   cd twingrid/backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the development server**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

## Production Deployment

### Manual Deployment

#### Backend

1. **Set up a production server**
   - Ubuntu 22.04 LTS recommended
   - Install required system packages:
     ```bash
     sudo apt update
     sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib nginx certbot python3-certbot-nginx
     ```

2. **Configure PostgreSQL**
   ```bash
   sudo -u postgres createuser twingrid
   sudo -u postgres createdb twingrid
   sudo -u postgres psql -c "ALTER USER twingrid WITH PASSWORD 'your_secure_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE twingrid TO twingrid;"
   ```

3. **Deploy the application**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/twingrid.git /opt/twingrid
   cd /opt/twingrid/backend
   
   # Set up virtual environment
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Configure environment variables
   cp .env.example .env
   nano .env  # Update with production values
   
   # Run migrations
   alembic upgrade head
   
   # Install Gunicorn
   pip install gunicorn
   
   # Create a systemd service
   sudo nano /etc/systemd/system/twingrid.service
   ```

   Example systemd service file:
   ```ini
   [Unit]
   Description=TwinGrid Backend
   After=network.target
   
   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/opt/twingrid/backend
   Environment="PATH=/opt/twingrid/backend/venv/bin"
   ExecStart=/opt/twingrid/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/twingrid
   ```
   
   Example Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Enable the site and start services**
   ```bash
   sudo ln -s /etc/nginx/sites-available/twingrid /etc/nginx/sites-enabled
   sudo nginx -t
   sudo systemctl restart nginx
   sudo systemctl enable twingrid
   sudo systemctl start twingrid
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   sudo systemctl restart nginx
   ```

#### Frontend

1. **Build the frontend**
   ```bash
   cd /opt/twingrid/frontend
   pnpm install
   pnpm build
   ```

2. **Serve with a static file server**
   ```bash
   pnpm add -g serve
   serve -s out -l 3000
   ```

### Docker Deployment

1. **Install Docker and Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   sudo systemctl enable docker
   sudo systemctl start docker
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/twingrid.git /opt/twingrid
   cd /opt/twingrid
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Update with production values
   ```

4. **Start the services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Environment Variables

### Backend (`.env`)

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/twingrid

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Email
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=noreply@example.com

# CORS
FRONTEND_URL=https://your-domain.com
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Scaling

### Horizontal Scaling

1. **Database**
   - Set up PostgreSQL replication
   - Consider using a managed database service (e.g., AWS RDS, Google Cloud SQL)

2. **Application**
   - Use a load balancer (e.g., Nginx, HAProxy)
   - Deploy multiple application instances
   - Use Redis for session storage

3. **Caching**
   - Implement Redis caching for frequently accessed data
   - Use CDN for static assets

## Monitoring

### Backend Monitoring

1. **Logging**
   - Configure Loguru for structured logging
   - Set up log rotation
   - Forward logs to a centralized logging system (e.g., ELK Stack, Graylog)

2. **Metrics**
   - Expose Prometheus metrics
   - Set up Grafana dashboards
   - Monitor key metrics (CPU, memory, request latency, error rates)

3. **Error Tracking**
   - Integrate Sentry for error tracking
   - Set up alerts for critical errors

## Backup and Recovery

### Database Backups

1. **Automated Backups**
   ```bash
   # Daily backup script
   pg_dump -U twingrid -d twingrid -f /backups/twingrid-$(date +%Y%m%d).sql
   
   # Keep backups for 30 days
   find /backups -type f -name "*.sql" -mtime +30 -delete
   ```

2. **Restore from Backup**
   ```bash
   psql -U twingrid -d twingrid -f /backups/twingrid-20230101.sql
   ```

### File Backups

1. **Backup Important Files**
   - Configuration files
   - Uploaded files
   - SSL certificates

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify database credentials
   - Check if PostgreSQL is running
   - Check connection limits in `pg_hba.conf`

2. **CORS Errors**
   - Verify CORS settings in the backend
   - Check frontend API URL configuration

3. **Performance Issues**
   - Check database queries with `EXPLAIN ANALYZE`
   - Monitor server resources
   - Optimize frontend assets

### Logs

- **Backend Logs**
  ```bash
  journalctl -u twingrid -f
  ```

- **Nginx Logs**
  ```bash
  tail -f /var/log/nginx/error.log
  tail -f /var/log/nginx/access.log
  ```

### Support

For additional support, please open an issue on our [GitHub repository](https://github.com/your-org/twingrid/issues).

#!/bin/bash
# =============================================================================
# VPS Setup Script for Vibe Trend Analyzer
# =============================================================================
#
# This script sets up the production environment on a VPS.
# Tested on Ubuntu 22.04 LTS
#
# Usage:
#   chmod +x setup-vps.sh
#   sudo ./setup-vps.sh

set -e

echo "=============================================="
echo "Vibe Trend Analyzer - VPS Setup"
echo "=============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo ./setup-vps.sh)"
    exit 1
fi

# Update system
echo ""
echo ">>> Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Docker
echo ""
echo ">>> Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    usermod -aG docker $SUDO_USER
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose
echo ""
echo ">>> Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose-plugin
fi

# Create application directory
echo ""
echo ">>> Setting up application directory..."
mkdir -p /opt/vibe
chown $SUDO_USER:$SUDO_USER /opt/vibe

# Clone/update repository (user should replace with their repo)
echo ""
echo ">>> Application directory created at /opt/vibe"
echo ">>> Next steps:"
echo "    1. Clone your repository to /opt/vibe"
echo "    2. Create .env file with your API keys"
echo "    3. Run: cd /opt/vibe && docker-compose -f infra/docker-compose.yml up -d"

# Install Nginx (optional, for reverse proxy)
echo ""
echo ">>> Installing Nginx..."
apt-get install -y nginx

# Create Nginx config
cat > /etc/nginx/sites-available/vibe << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /nlp {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/vibe /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Setup firewall
echo ""
echo ">>> Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "=============================================="
echo "VPS Setup Complete!"
echo "=============================================="
echo ""
echo "Services will be available at:"
echo "  - Frontend: http://YOUR_IP/"
echo "  - API:      http://YOUR_IP/api"
echo "  - NLP:      http://YOUR_IP/nlp"
echo ""
echo "Don't forget to:"
echo "  1. Set up SSL with Let's Encrypt"
echo "  2. Configure your .env file"
echo "  3. Set up automatic backups"

# IT Portal Deployment Guide
## Al Rayes Laundry - IT Management Portal

### Server Requirements
- Ubuntu Server 20.04+ / Debian 11+
- Node.js v20.x LTS
- PostgreSQL 14+
- Nginx
- PM2 (for process management)
- Minimum 2GB RAM, 20GB storage

---

## Part 1: Server Preparation

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

### 1.2 Install Node.js v20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x.x
```

### 1.3 Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.4 Configure PostgreSQL
```bash
sudo -u postgres psql -f /path/to/scripts/init-postgres.sql
# Or manually:
sudo -u postgres psql
CREATE DATABASE it_portal;
CREATE USER portal_user WITH ENCRYPTED PASSWORD 'Portal@123!';
GRANT ALL PRIVILEGES ON DATABASE it_portal TO portal_user;
\c it_portal
GRANT ALL ON SCHEMA public TO portal_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO portal_user;
```

### 1.5 Install PM2
```bash
sudo npm install -g pm2
pm2 startup
```

### 1.6 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Part 2: Application Deployment

### 2.1 Create Application Directory
```bash
sudo mkdir -p /var/www/it-portal
sudo chown -R $USER:$USER /var/www/it-portal
```

### 2.2 Copy Application Files
```bash
# Copy built application
cp -r .next/standalone/* /var/www/it-portal/
cp -r .next/static /var/www/it-portal/.next/
cp -r public /var/www/it-portal/
cp -r prisma /var/www/it-portal/
cp package.json /var/www/it-portal/
cp .env.production /var/www/it-portal/.env

# Use PostgreSQL schema for production
cp prisma/schema.postgresql.prisma /var/www/it-portal/prisma/schema.prisma
```

### 2.3 Install Dependencies
```bash
cd /var/www/it-portal
npm install --production prisma @prisma/client
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 2.4 Set Permissions
```bash
sudo chown -R www-data:www-data /var/www/it-portal
sudo chmod -R 755 /var/www/it-portal
```

---

## Part 3: Process Management

### 3.1 Start with PM2
```bash
cd /var/www/it-portal
pm2 start ecosystem.config.js
pm2 save
```

### 3.2 PM2 Commands
```bash
pm2 status              # View all processes
pm2 logs it-portal      # View logs
pm2 restart it-portal   # Restart application
pm2 stop it-portal      # Stop application
pm2 monit               # Monitor resources
```

---

## Part 4: Nginx Configuration

### 4.1 Configure Nginx
```bash
sudo cp scripts/nginx.conf /etc/nginx/sites-available/it-portal
sudo ln -s /etc/nginx/sites-available/it-portal /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 4.2 Firewall Configuration
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## Part 5: SSL Configuration (Optional)

### 5.1 Generate Self-Signed Certificate
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/it-portal.key \
  -out /etc/ssl/certs/it-portal.crt
```

### 5.2 Or use Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Part 6: Backup Configuration

### 6.1 Database Backup Script
```bash
#!/bin/bash
# /home/itadmin/backup-db.sh
BACKUP_DIR="/backup/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U portal_user it_portal > $BACKUP_DIR/it_portal_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete  # Keep 7 days
```

### 6.2 Add to Crontab
```bash
crontab -e
# Daily backup at 2 AM
0 2 * * * /home/itadmin/backup-db.sh
```

---

## Part 7: Monitoring

### 7.1 Application Logs
```bash
tail -f /var/log/it-portal/out.log
tail -f /var/log/it-portal/error.log
```

### 7.2 Nginx Logs
```bash
tail -f /var/log/nginx/it-portal-access.log
tail -f /var/log/nginx/it-portal-error.log
```

---

## Troubleshooting

### Check Application Status
```bash
pm2 status
pm2 logs it-portal --lines 100
```

### Check Database Connection
```bash
psql -U portal_user -d it_portal -h localhost
```

### Check Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Restart Everything
```bash
pm2 restart it-portal
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | Administrator |
| simon | Simon@123 | Administrator |
| irfan | Irfan@123 | User |
| hamza | Hamza@123 | User |
| abraham | Abraham@123 | User |
| arman | Arman@123 | User |
| demo | Demo@123 | User |

---

## Support

- IT Department: it@alrayes.com
- IT HOD: Simon Peter
- Portal Version: 4.0

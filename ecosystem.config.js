// PM2 Ecosystem Configuration for IT Portal
// Al Rayes Laundry - IT Management Portal

module.exports = {
  apps: [
    {
      name: 'it-portal',
      script: 'server.js',
      cwd: '/var/www/it-portal',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'postgresql://portal_user:Portal@123!@localhost:5432/it_portal?schema=public',
        NEXTAUTH_SECRET: 'it-portal-secret-key-2024-alrayes-qatar',
        NEXTAUTH_URL: 'http://172.16.1.95'
      },
      error_file: '/var/log/it-portal/error.log',
      out_file: '/var/log/it-portal/out.log',
      log_file: '/var/log/it-portal/combined.log',
      time: true
    }
  ]
};
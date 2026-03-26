# IT Management Portal
## Al Rayes Laundry, Doha, Qatar

![Version](https://img.shields.io/badge/version-4.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

A comprehensive IT Management Portal for managing IT operations, assets, tickets, visitors, meetings, and more.

---

## Features

### Core Modules
- **Dashboard** - System overview with statistics and quick actions
- **Asset Management** - Track computers, servers, printers, network equipment
- **Ticket System** - IT support ticket management with SLA tracking
- **Visitor Management** - Check-in/out system with badge printing
- **Meeting Scheduler** - Video conference integration (Jitsi, Teams, Zoom)
- **Calendar** - Maintenance schedules, warranty reminders, license renewals

### Sensitive Modules (Admin Only)
- **Password Vault** - Encrypted credential storage
- **License Management** - Software license tracking with expiry alerts
- **Backup Monitoring** - Backup job status and scheduling
- **Vendor Management** - Contract and SLA tracking
- **Budget Tracking** - IT budget allocation and expenses

### Critical Modules (Admin Only)
- **Activity Logs** - Audit trail of all actions
- **Access Control** - User role management
- **System Settings** - Portal configuration

---

## Quick Start

### Prerequisites
- Node.js v20.x LTS
- PostgreSQL 14+ (or SQLite for development)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd it-portal

# Install dependencies
npm install
# or
bun install

# Setup environment
cp .env.example .env

# Setup database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Access the Portal
Open http://localhost:3000 in your browser.

### Default Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | Administrator |
| demo | Demo@123 | User |
| simon | Simon@123 | Administrator |

---

## Project Structure

```
it-portal/
├── prisma/
│   ├── schema.prisma          # SQLite schema (development)
│   ├── schema.postgresql.prisma # PostgreSQL schema (production)
│   └── seed.ts                # Database seeding
├── public/                    # Static assets
├── scripts/
│   ├── deploy.sh             # Deployment script
│   ├── init-postgres.sql     # PostgreSQL setup
│   └── nginx.conf            # Nginx configuration
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication
│   │   │   ├── assets/       # Asset CRUD
│   │   │   ├── tickets/      # Ticket CRUD
│   │   │   ├── visitors/     # Visitor CRUD
│   │   │   └── ...           # Other endpoints
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main application
│   ├── components/
│   │   └── ui/               # UI components (shadcn/ui)
│   └── lib/
│       ├── api.ts            # API utilities
│       ├── db.ts             # Database client
│       └── utils.ts          # Utility functions
├── .env                      # Environment variables
├── ecosystem.config.js       # PM2 configuration
├── DEPLOYMENT.md             # Deployment guide
└── package.json
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Check session

### Data Endpoints (GET, POST, PUT, DELETE)
- `/api/assets` - IT assets
- `/api/tickets` - Support tickets
- `/api/visitors` - Visitor management
- `/api/meetings` - Meeting scheduler
- `/api/backups` - Backup jobs
- `/api/licenses` - Software licenses
- `/api/credentials` - Password vault
- `/api/checks` - Daily checks
- `/api/calendar` - Calendar events
- `/api/announcements` - Announcements
- `/api/knowledge` - Knowledge base
- `/api/notebook` - Notebook pages
- `/api/vendors` - Vendor management
- `/api/monitors` - Server monitoring
- `/api/alerts` - System alerts
- `/api/charters` - Programme charters
- `/api/budget` - Budget items
- `/api/notes` - Quick notes

### Dashboard
- `GET /api/dashboard` - Dashboard statistics

---

## Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Lucide icons

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL / SQLite

### Deployment
- PM2 process manager
- Nginx reverse proxy
- SSL/TLS certificates

---

## Development

### Commands

```bash
# Development
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint

# Database
npx prisma studio  # Open Prisma Studio
npx prisma db push # Push schema changes
npx prisma generate # Generate Prisma client
npx tsx prisma/seed.ts # Seed database
```

### Adding New Features

1. Update Prisma schema for new models
2. Create API route in `/src/app/api/`
3. Update frontend in `page.tsx`
4. Add types to TypeScript interfaces

---

## Security

### Implemented
- Password-protected authentication
- Role-based access control (Admin/User)
- Module-level permissions
- Input validation on all forms
- SQL injection protection (Prisma)

### Recommended for Production
- HTTPS encryption
- Rate limiting
- Session timeout
- Password hashing (bcrypt)
- Two-factor authentication
- Audit logging

---

## License

Proprietary - Al Rayes Laundry, Doha, Qatar

---

## Support

**IT Department**
- Email: it@alrayes.com
- IT HOD: Simon Peter

**Portal Version:** 4.0
**Last Updated:** March 2026

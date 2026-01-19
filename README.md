# Brothers That Pray (BTP)

A production-ready Next.js 14+ web application for a faith-based community platform. Built with the App Router, TypeScript, TailwindCSS, Prisma ORM, and NextAuth.

## Features

### Public Pages
- **Landing Page** (`/`) - Mission statement and call-to-action
- **Live Stream** (`/live`) - Embedded live stream with schedule
- **Sermons** (`/sermons`) - Searchable sermon archive
- **Events** (`/events`) - Upcoming and past events
- **Donate** (`/donate`) - Donation form (Stripe integration ready)

### Authenticated Pages
- **Prayer Wall** (`/prayer`) - Create requests, comment, and pray for others
- **Profile** (`/profile`) - User profile management

### Admin Pages (ADMIN role required)
- **Dashboard** (`/admin`) - Overview statistics
- **Live Stream** (`/admin/live`) - Configure stream embed and schedule
- **Sermons** (`/admin/sermons`) - Full CRUD for sermons
- **Events** (`/admin/events`) - Full CRUD for events
- **Users** (`/admin/users`) - User management, role promotion, invite codes
- **Donations** (`/admin/donations`) - View donation intents

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Credentials provider)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
cd BTP
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/btp?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"

# Invite Only Mode (optional)
INVITE_ONLY="false"
```

### 3. Database Setup

Generate Prisma client and push schema to database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Default Credentials

After seeding, you can log in with:

**Admin User:**
- Email: `admin@btp.app`
- Password: `Admin123!`

**Test User:**
- Email: `user@btp.app`
- Password: `Test123!`

## Invite-Only Mode

To enable invite-only registration:

1. Set `INVITE_ONLY="true"` in your `.env` file
2. Restart the server
3. Generate invite codes from the Admin > Users page
4. Share codes with users who need to register

Pre-seeded invite codes:
- `BTPWELCOME2024`
- `BROTHERSUNITE`

## Scripts

```bash
# Development
npm run dev          # Start development server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
BTP/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin pages
│   │   ├── auth/         # Auth pages (signin, signup)
│   │   ├── api/          # API routes
│   │   ├── donate/       # Donation page
│   │   ├── events/       # Events page
│   │   ├── live/         # Live stream page
│   │   ├── prayer/       # Prayer wall page
│   │   ├── profile/      # Profile page
│   │   ├── sermons/      # Sermons page
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Landing page
│   ├── actions/          # Server Actions
│   ├── components/       # React components
│   │   └── ui/           # UI primitives
│   ├── lib/              # Utilities
│   │   ├── auth.ts       # NextAuth config
│   │   ├── prisma.ts     # Prisma client
│   │   └── validations.ts # Zod schemas
│   └── types/            # TypeScript types
├── middleware.ts         # Route protection
├── .env.example          # Environment template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Stripe Integration (TODO)

The donation system is structured for Stripe integration. To complete:

1. Install Stripe:
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. Add environment variables:
   ```env
   STRIPE_SECRET_KEY="sk_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
   ```

3. Create a webhook endpoint at `/api/webhooks/stripe`

4. Update `src/actions/donations.ts` to create PaymentIntents

5. Add client-side Stripe Elements to the donation form

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:

```bash
npm run build
npm run start
```

Ensure your platform:
- Supports Node.js 18+
- Has PostgreSQL access
- Sets all environment variables

## Security Considerations

- Change `NEXTAUTH_SECRET` in production
- Use strong database passwords
- Enable HTTPS in production
- Regularly update dependencies
- Review and restrict CORS if using external APIs

## License

Private - All rights reserved

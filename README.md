# CEDB (Cold Email Database)

An internal dashboard for Revenx employees to manage cold email database records. Built with Next.js 16, React 19, Supabase, and shadcn/ui.

## Features

- 📊 View and manage database records in an interactive data table
- 📤 Upload CSV files to import contacts
- 📥 Download records as CSV files
- ✏️ Create, read, update, and delete contacts
- 🔒 Secure authentication with Supabase
- ⚡ Optimized for performance and fast load times

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Data Tables:** TanStack React Table
- **CSV Handling:** PapaParse
- **Package Manager:** Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cedb
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

Copy the `env.example` file to `.env.local`:

```bash
cp env.example .env.local
```

Then fill in your Supabase credentials in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

You can find these values in your [Supabase project settings](https://app.supabase.com/project/_/settings/api).

4. Run the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Client-side Supabase client
│   │   ├── server.ts       # Server-side Supabase client
│   │   ├── proxy.ts        # Session management
│   │   └── types.ts        # Database type definitions
│   └── utils.ts            # Utility functions
└── proxy.ts                # Next.js proxy (session refresh)
```

## Development Guidelines

- **Always use shadcn/ui components** - Never build custom base components
- **Use spaces for indentation** - No hard tabs
- **Server Components first** - Use 'use client' only when necessary
- **TypeScript strict mode** - Fully typed, avoid `any` types
- **Performance optimized** - Server-side pagination, virtual scrolling, debounced search

See `specs.md` for comprehensive technical specifications and `.cursorrules` for AI development rules.

## Available Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run start    # Start production server
bun run lint     # Run ESLint
```

## Environment Variables

Required environment variables (see `env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key (safe for browser)
- `SUPABASE_SECRET_KEY` - (Optional) Server-side secret key for admin operations

## Documentation

- [specs.md](./specs.md) - Complete technical specifications
- [.cursorrules](./.cursorrules) - AI development rules and patterns

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## License

Internal use only - Revenx employees.

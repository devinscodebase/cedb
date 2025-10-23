# CEDB (Cold Email Database) - Technical Specifications

## Project Overview

**Name:** CEDB (Cold Email Database)
**Purpose:** Internal dashboard for Revenx (revenx.com) employees to manage cold email database records
**Type:** Full-stack web application - visual interface layer over Supabase database
**Target Users:** Internal Revenx employees only

## Core Functionality

### Primary Features

1. **View Records** - Display database records in an interactive, searchable data table
2. **Upload CSV** - Import records from CSV files into the Supabase database
3. **Download CSV** - Export database records as CSV files
4. **CRUD Operations** - Create, Read, Update, Delete records through the UI

### Technical Stack

#### Framework & Runtime

- **Next.js 16.0.0** - React framework with App Router
  - Uses `proxy.ts` convention (replaces deprecated `middleware.ts`)
- **React 19.2.0** - UI library
- **TypeScript 5.x** - Type-safe development
- **Bun** - Package manager and runtime (use `bun run dev`, not npm)

#### Database & Backend

- **Supabase** - PostgreSQL database, authentication, real-time subscriptions, and storage
- **@supabase/supabase-js 2.76.1** - Official Supabase client

#### UI Components & Styling

- **shadcn/ui** - Pre-built, accessible component library (REQUIRED - always use these)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon system
- **class-variance-authority** - Component variant management
- **clsx + tailwind-merge** - Conditional className utilities

#### Data Management

- **@tanstack/react-table 8.21.3** - Powerful table/data grid library
- **papaparse 5.5.3** - CSV parsing and generation

## AI Development Guidelines

### Component Development

1. **ALWAYS use shadcn/ui components** - Never build custom base components when shadcn alternatives exist
2. **Refer to Context7 MCP** for up-to-date Next.js, React, and library documentation
3. **Refer to Supabase MCP** for database operations, queries, and Supabase best practices
4. **Use Svelte MCP** only if specifically building Svelte components (unlikely for this project)

### Code Standards

- **Indentation:** Use spaces, NEVER hard tabs (linting requirement)
- **TypeScript:** Fully typed - no `any` types without explicit justification
- **Server Components:** Default to React Server Components; use 'use client' only when necessary
- **Error Handling:** Comprehensive error boundaries and user-friendly error messages
- **Loading States:** Always implement skeleton loaders or loading indicators

### Performance Requirements

#### Load Time Targets

- **Initial Page Load:** < 2 seconds
- **CSV Upload Processing:** Real-time progress indication for files > 100KB
- **CSV Download:** < 1 second for datasets up to 10,000 rows
- **Table Rendering:** Virtualized rendering for > 100 rows
- **Database Queries:** Optimized with proper indexing, pagination

#### Optimization Strategies

1. **Use Next.js Image component** for all images
2. **Implement data pagination** - server-side pagination for large datasets
3. **Use React Server Components** for data fetching when possible
4. **Enable table virtualization** with TanStack Table for large datasets
5. **Implement debounced search** to reduce API calls
6. **Use Supabase Row Level Security (RLS)** for data protection
7. **Leverage Supabase real-time** only when necessary (can impact performance)
8. **Code splitting** - dynamic imports for heavy components

### Database Architecture

#### Supabase Setup

- **Authentication:** Supabase Auth for employee login
- **Row Level Security:** Enforce access control at database level
- **Indexing:** Index all columns used in WHERE clauses and sorting
- **Migrations:** Track all schema changes via Supabase migrations

#### Expected Tables

- Primary table: `contacts` or `leads` (to be defined during development)
- Fields likely include: email, name, company, status, created_at, updated_at
- Relationships: Consider campaign tracking, email status, etc.

### UI/UX Standards

#### Design Principles

1. **Simplicity First:** Clean, minimal interface - this is a data tool, not a marketing site
2. **Accessibility:** WCAG 2.1 AA compliance minimum
3. **Responsive:** Desktop-first (primary use case), but mobile-compatible
4. **Consistency:** Use shadcn/ui default styling with minimal customization

#### User Experience

- **Empty States:** Clear messaging and CTAs when no data exists
- **Feedback:** Toast notifications for success/error states
- **Confirmation:** Require confirmation for destructive actions (delete, bulk operations)
- **Search & Filter:** Debounced search with column-specific filtering
- **Sorting:** Multi-column sorting capability
- **Selection:** Bulk selection for batch operations

### Feature Specifications

#### Data Table View

- **Component:** TanStack React Table with shadcn/ui Table components
- **Features Required:**
  - Column sorting (asc/desc)
  - Global search
  - Column-specific filters
  - Pagination (server-side)
  - Row selection (single & bulk)
  - Virtual scrolling for large datasets
  - Responsive columns (hide on mobile)
  - Export selected rows
  - Refresh data button

#### CSV Upload

- **Component:** shadcn/ui Dialog with File Input
- **Features Required:**
  - Drag & drop zone
  - File validation (.csv only, max 10MB initial limit)
  - Preview first 5 rows before import
  - Column mapping interface (CSV columns → DB columns)
  - Duplicate detection options (skip, overwrite, create new)
  - Progress bar for large files
  - Error reporting (which rows failed and why)
  - Success summary (X rows imported, Y skipped, Z errors)

#### CSV Download

- **Component:** shadcn/ui Button with dropdown menu
- **Features Required:**
  - Download all records
  - Download filtered/searched results
  - Download selected rows only
  - Choose columns to include
  - Filename with timestamp (e.g., `cedb-export-2025-10-23.csv`)
  - Stream large exports (don't load all into memory)

#### CRUD Operations

- **Create:** Modal form with validation (shadcn/ui Dialog + Form)
- **Read:** Individual record view in modal or side panel
- **Update:** Inline editing or modal form
- **Delete:** Confirmation dialog, soft delete preferred

### Security Requirements

1. **Authentication Required:** All routes require Supabase authentication
2. **Email Domain Restriction:** Only @revenx.com email addresses
3. **Row Level Security:** Enforce at database level, not just application
4. **Input Validation:** Both client and server-side validation
5. **SQL Injection Prevention:** Use Supabase parameterized queries
6. **XSS Prevention:** Sanitize user inputs before display
7. **CSRF Protection:** Leverage Next.js built-in protections

### File Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx          # Main dashboard view
│   │   ├── layout.tsx         # Dashboard layout
│   │   └── loading.tsx        # Loading state
│   ├── api/                   # API routes if needed
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/
│   │   ├── data-table.tsx     # Main table component
│   │   ├── upload-dialog.tsx  # CSV upload
│   │   ├── export-menu.tsx    # CSV download options
│   │   ├── record-form.tsx    # Create/Edit form
│   │   └── filters.tsx        # Search & filter controls
│   └── providers/             # Context providers
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client setup
│   │   ├── server.ts          # Server-side Supabase
│   │   ├── proxy.ts           # Proxy session management
│   │   └── types.ts           # Database types
│   ├── csv/
│   │   ├── parser.ts          # CSV import logic
│   │   └── generator.ts       # CSV export logic
│   ├── utils.ts               # Utility functions
│   └── validations.ts         # Zod schemas
├── types/
│   └── index.ts               # TypeScript types
└── proxy.ts                   # Next.js proxy (session refresh)
```

### Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=     # Server-side only (optional)
```

### Testing Requirements

- **Unit Tests:** Critical business logic (CSV parsing, data validation)
- **Integration Tests:** Supabase operations
- **E2E Tests:** Core user flows (upload, download, CRUD)
- **Accessibility Tests:** Automated a11y checks

### Documentation Standards

- **Code Comments:** JSDoc for public functions and complex logic
- **README.md:** Setup instructions, environment variables, development workflow
- **Component Documentation:** Storybook or similar for component library
- **API Documentation:** Document any custom API routes

### Deployment Considerations

- **Platform:** Vercel (optimal for Next.js)
- **Environment:** Production, Staging, Development
- **Monitoring:** Error tracking (Sentry or similar)
- **Analytics:** Optional - usage analytics for internal tracking
- **Domain:** Internal subdomain (e.g., cedb.revenx.com or internal.revenx.com/cedb)

## MCP Server Integration

When developing, leverage available MCP servers through Cursor:

1. **Supabase MCP** - For all database operations, migrations, and Supabase-specific queries
2. **Context7 MCP** - For up-to-date documentation on Next.js, React, TanStack Table, and other libraries
3. **Svelte MCP** - (Not applicable for this Next.js/React project)

## Development Workflow

1. **Always check official documentation** via Context7 MCP before implementing
2. **Verify Supabase patterns** via Supabase MCP for database operations
3. **Use shadcn/ui components** - check available components before building custom ones
4. **Performance first** - measure before optimizing, but design with performance in mind
5. **Type safety** - leverage TypeScript fully, generate types from Supabase schema
6. **Progressive enhancement** - core functionality works without JavaScript when possible

## Success Metrics

- **User Efficiency:** Time to complete common tasks (upload CSV, find record, export data)
- **Performance:** Lighthouse scores > 90 across all metrics
- **Error Rates:** < 1% of operations result in errors
- **User Satisfaction:** Internal feedback from Revenx employees

## Future Considerations

- Bulk edit capabilities
- Advanced filtering (date ranges, multi-select)
- Record history/audit log
- Email campaign integration
- Automated data enrichment
- Export to other formats (Excel, JSON)
- API for programmatic access
- Webhook integrations

---

**Last Updated:** October 23, 2025
**Version:** 1.0.0
**Maintained By:** Revenx Development Team

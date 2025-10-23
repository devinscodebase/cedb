# Supabase Migrations

This directory contains database migrations for the CEDB project.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `migrations/001_create_contacts_table.sql`
4. Copy and paste the entire SQL content
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed locally:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push

# Or apply migration directly
supabase db execute migrations/001_create_contacts_table.sql
```

### Option 3: Using MCP Supabase Tool

If you're using the Supabase MCP server in Cursor:

The migration is ready to be applied via the MCP `apply_migration` tool.

## Migration Details

### `001_create_contacts_table.sql`

Creates the `contacts` table with the following structure:

**Required Fields:**
- `email` (TEXT, UNIQUE) - Contact email address
- `company_name` (TEXT) - Company name
- `industry` (TEXT) - Industry category
- `state` (TEXT) - US State (2-letter code)
- `status` (TEXT) - Contact status

**Optional Fields:**
- `first_name` (TEXT) - Contact first name
- `last_name` (TEXT) - Contact last name
- `job_title` (TEXT) - Job title
- `phone` (TEXT) - Phone number
- `website` (TEXT) - Website URL
- `notes` (TEXT) - Additional notes

**System Fields:**
- `id` (UUID) - Primary key
- `created_at` (TIMESTAMP) - Auto-generated creation timestamp
- `updated_at` (TIMESTAMP) - Auto-updated modification timestamp
- `deleted_at` (TIMESTAMP) - Soft delete timestamp

**Features:**
- ✅ Automatic UUID generation
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Indexes on frequently queried columns
- ✅ Row Level Security (RLS) enabled
- ✅ Policies for authenticated users
- ✅ Soft delete support

## Verifying Migration

After running the migration, verify it worked:

```sql
-- Check if table exists
SELECT * FROM contacts LIMIT 1;

-- Check table structure
\d contacts

-- Check indexes
\di contacts*

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'contacts';
```

## Next Steps

After running the migration:

1. ✅ Table is created and ready to use
2. ✅ The add contact form will work correctly
3. ✅ All field names match between form and database
4. Consider: Add auth restriction to @revenx.com domain once authentication is implemented


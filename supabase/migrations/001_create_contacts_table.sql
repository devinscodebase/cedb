-- Create contacts table with all required fields
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Required fields
  email TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  state TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Valid',
  
  -- Optional fields
  first_name TEXT,
  last_name TEXT,
  job_title TEXT,
  phone TEXT,
  website TEXT,
  notes TEXT,
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_industry ON contacts(industry);
CREATE INDEX IF NOT EXISTS idx_contacts_state ON contacts(state);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_name);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_deleted_at ON contacts(deleted_at) WHERE deleted_at IS NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- For now, allow all operations (since this is an internal tool without auth yet)
-- TODO: Restrict to @revenx.com domain once auth is implemented

-- Allow anonymous users (for development/internal tool without auth)
DROP POLICY IF EXISTS "Allow all operations for anon users" ON contacts;
CREATE POLICY "Allow all operations for anon users" ON contacts
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON contacts;
CREATE POLICY "Allow all operations for authenticated users" ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow all operations for service role" ON contacts;
CREATE POLICY "Allow all operations for service role" ON contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE contacts IS 'Cold email contacts database';
COMMENT ON COLUMN contacts.email IS 'Contact email address (unique)';
COMMENT ON COLUMN contacts.company_name IS 'Company name';
COMMENT ON COLUMN contacts.industry IS 'Industry category (Federal Government, Financial/Insurance, School District, State Government, University)';
COMMENT ON COLUMN contacts.state IS 'US State (2-letter code)';
COMMENT ON COLUMN contacts.status IS 'Contact status (Valid, Hard Bounce, Soft Bounce, Unsubscribe, Do Not Contact)';
COMMENT ON COLUMN contacts.deleted_at IS 'Soft delete timestamp';


-- =========================================================
-- MADURAI SOUTH CIVIC CONNECT (CONSTITUENCY 192)
-- PRODUCTION SUPABASE DATABASE SCHEMA & RLS POLICIES
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ISSUES TABLE
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Citizen Contact Info (Private to authorized representatives)
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT NOT NULL,
  citizen_email TEXT,
  citizen_address TEXT,
  
  -- Location & Geocoding
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  ward_id TEXT NOT NULL,
  ward_name TEXT NOT NULL,
  
  -- Severity & Status
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'NEW',
  priority_score INTEGER NOT NULL DEFAULT 50,
  
  -- Evidence & Photos
  photos JSONB DEFAULT '[]'::jsonb,
  evidence_items JSONB DEFAULT '[]'::jsonb,
  
  -- Verification & Community
  citizen_verified BOOLEAN DEFAULT false,
  upvotes_count INTEGER DEFAULT 1,
  assigned_to TEXT,
  reporter_anonymous_id TEXT,
  
  -- Timeline Audit Trail
  timeline JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_issues_ward_id ON public.issues(ward_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_issue_id ON public.issues(issue_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- 2. RLS POLICIES FOR ISSUES

-- Policy 1: Public / Citizen unauthenticated users can INSERT new issues
DROP POLICY IF EXISTS "Public users can insert issues" ON public.issues;
CREATE POLICY "Public users can insert issues" 
ON public.issues 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Policy 2: Public / Citizen users can view active issues (non-deleted)
DROP POLICY IF EXISTS "Anyone can view non-deleted issues" ON public.issues;
CREATE POLICY "Anyone can view non-deleted issues" 
ON public.issues 
FOR SELECT 
TO anon, authenticated 
USING (deleted_at IS NULL);

-- Policy 3: Authenticated users & Citizens can update issue status / verification / upvotes
DROP POLICY IF EXISTS "Allow updating issues" ON public.issues;
CREATE POLICY "Allow updating issues" 
ON public.issues 
FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Policy 4: ONLY authenticated MLA users can DELETE issues
DROP POLICY IF EXISTS "Only MLA can delete issues" ON public.issues;
CREATE POLICY "Only MLA can delete issues" 
ON public.issues 
FOR DELETE 
TO authenticated 
USING (
  coalesce(auth.jwt() ->> 'email', '') LIKE '%mla%' 
  OR coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'mla'
  OR coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'mla'
);

-- 3. STORAGE BUCKET FOR PHOTO EVIDENCE
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-evidence', 'issue-evidence', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view issue evidence" ON storage.objects;
CREATE POLICY "Public can view issue evidence"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'issue-evidence');

DROP POLICY IF EXISTS "Public can upload issue evidence" ON storage.objects;
CREATE POLICY "Public can upload issue evidence"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'issue-evidence');

-- 4. REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;

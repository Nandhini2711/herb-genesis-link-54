-- AyurChain Database Schema
-- Run this in your Supabase SQL Editor

-- Create herbs table
CREATE TABLE IF NOT EXISTS herbs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  herb_name TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  location TEXT NOT NULL,
  harvest_date DATE NOT NULL,
  notes TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table to track consumer scans
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  herb_id UUID REFERENCES herbs(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consumer_ip TEXT
);

-- Enable Row Level Security
ALTER TABLE herbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Enable all operations for herbs" ON herbs FOR ALL USING (true);
CREATE POLICY "Enable all operations for scans" ON scans FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_herbs_created_at ON herbs(created_at);
CREATE INDEX IF NOT EXISTS idx_scans_herb_id ON scans(herb_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at);
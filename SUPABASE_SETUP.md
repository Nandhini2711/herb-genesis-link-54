# AyurChain Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project" and fill in your project details
3. Wait for the project to be created (takes ~2 minutes)

## 2. Configure Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the content from `src/lib/database-setup.sql`
3. Paste it into the SQL Editor and click **Run**

This will create:
- `herbs` table for storing herb records
- `scans` table for tracking consumer scans
- Proper indexes and security policies

## 3. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy your:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOi...`)

## 4. Configure Your App

### Option A: Environment Variables (Recommended)
1. Create a `.env` file in your project root:
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Option B: Direct Configuration
1. Open `src/lib/env.ts`
2. Replace the placeholder values with your actual Supabase credentials

## 5. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/farmer` and create a test herb record
3. Check your Supabase dashboard > Table Editor > herbs table
4. You should see your new record!

## 6. Deploy to Production

When deploying, make sure to:
1. Set the environment variables in your hosting platform
2. Update your Supabase project's allowed domains in Authentication settings

## Security Notes

- The anon key is safe to use in frontend code
- Row Level Security (RLS) is enabled on all tables
- Current policies allow all operations (suitable for MVP)
- For production, consider implementing proper authentication and stricter RLS policies

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

## Features Enabled with Supabase

✅ **Persistent Storage**: Data stored in PostgreSQL database  
✅ **Real-time Sync**: Multiple users can see updates instantly  
✅ **Scan Tracking**: Track when consumers view QR codes  
✅ **Analytics Ready**: Data structure ready for advanced analytics  
✅ **Scalable**: Handles millions of herb records  
✅ **Backup & Recovery**: Automatic daily backups
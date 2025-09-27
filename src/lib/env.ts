// Environment configuration for Supabase
// Update these values with your Supabase project details

export const SUPABASE_CONFIG = {
  // Replace with your Supabase project URL
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co',
  
  // Replace with your Supabase anon key
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
};

// You can set these environment variables in a .env file:
// VITE_SUPABASE_URL=https://your-project-ref.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key
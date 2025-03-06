import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Initialize Supabase client
const supabaseUrl = 'https://ppahkfgwxwblbetnxtka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYWhrZmd3eHdibGJldG54dGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTk5MjgsImV4cCI6MjA1NjczNTkyOH0.zSg88jXSunHC6c-WrHXp1BwPzES3_L9en-mG-aBuOyU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
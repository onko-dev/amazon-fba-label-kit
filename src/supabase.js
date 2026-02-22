import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Graceful fallback for dev without env vars
  console.warn('Supabase URL or Anon Key missing. Auth will be disabled.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

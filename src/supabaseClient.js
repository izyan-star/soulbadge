import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vpmrkfiqyxiabtwxjyjk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwbXJrZmlxeXhpYWJ0d3hqeWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDA0MTksImV4cCI6MjA5MzMxNjQxOX0.eqqY7hE3vAyYCgu-EI3MhCXXTX9KHc2IvQAOgJc67jM' // Ambil dari screenshot API Keys tadi

export const supabase = createClient(supabaseUrl, supabaseKey)
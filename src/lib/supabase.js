import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://prkyhfdqqygdszxmvjbo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBya3loZmRxcXlnZHN6eG12amJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTI1ODIsImV4cCI6MjEwMjYyODU4Mn0.5kU1WKPtV-QWMCgxEkCACv_KOpHsjn_01HDp0r_xosI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

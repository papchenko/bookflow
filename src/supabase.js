import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nndarbrammizksbcspio.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZGFyYnJhbW1pemtzYmNzcGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDE4MzQsImV4cCI6MjA4ODc3NzgzNH0.QpLJGGBvW8PVemDgmvF7dEzf_lB1Uq6H5Z-2xCvkr7s";

export const supabase = createClient(supabaseUrl, supabaseKey);
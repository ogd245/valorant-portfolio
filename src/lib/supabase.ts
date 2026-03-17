import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rltrfbamzscejztuhibg.supabase.co", // 👈 paste your real URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdHJmYmFtenNjZWp6dHVoaWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc4NDQsImV4cCI6MjA4ODc5Mzg0NH0.Pf3LWYxG1DwNBV6xksFgCCxWU8ESlqqFlAhKW5Mqmwk" // 👈 your anon key
);

export default supabase;
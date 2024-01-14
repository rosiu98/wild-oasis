import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://sgyelkojaxqiyufjfoil.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNneWVsa29qYXhxaXl1Zmpmb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMzNjQ4NDUsImV4cCI6MjAxODk0MDg0NX0.PGZZxxxjhX9uv43Yna7FQXCcqg7HYH-G7uPHOAmLApQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

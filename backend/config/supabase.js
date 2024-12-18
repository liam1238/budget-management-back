const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://htianjngptwikuipammi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0aWFuam5ncHR3aWt1aXBhbW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTY4MjYsImV4cCI6MjA0OTU3MjgyNn0.PDfcPqGDFveUjIphmdPAFsvzjspth5alyqETLx1L6bk";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

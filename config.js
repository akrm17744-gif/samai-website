// Supabase Configuration
// Replace these values with your actual Supabase project credentials
const SUPABASE_CONFIG = {
    url: 'https://skjddytehplveaeceogb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNramRkeXRlaHBsdmVhZWNlb2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDMxOTgsImV4cCI6MjA3MzUxOTE5OH0.2z1FnPEPw4Mn1YGaMtTLT5nohfDmRPQDvw98rdaDnHY'
};

// Initialize Supabase client
let supabase;
if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}

// Export configuration for use in other files
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.supabaseClient = supabase;


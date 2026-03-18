const { createClient } = require('@supabase/supabase-js');

// Public client — uses anon key (RLS applies)
const supabasePublic = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Admin client — uses service role key (bypasses RLS)
// NEVER send this to frontend — server only
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = { supabasePublic, supabaseAdmin };

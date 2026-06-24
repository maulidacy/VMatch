const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@vmatch.id',
    password: 'admin123'
  });
  console.log("Login:", data?.user ? "Success" : "Failed", error?.message);
  
  if (data?.user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    console.log("Profile:", profile ? "Found" : "Missing", profileError?.message);
  }
}
test();

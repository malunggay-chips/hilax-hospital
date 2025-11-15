// signup.js
// Standalone signup flow using Supabase Auth + custom backend linking logic

import { createClient } from '@supabase/supabase-js';

// -------------------------------------------------------
// 1. Supabase Client Setup
// -------------------------------------------------------
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY"; // keep this safe in frontend
const supabase = createClient(supabaseUrl, supabaseKey);

// -------------------------------------------------------
// 2. Main Signup Function
// -------------------------------------------------------
export async function registerUser({ email, password, full_name, role, number }) {
  try {
    // -------------------------------------------------------
    // Step 1 — Create Auth Account
    // -------------------------------------------------------
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return { success: false, message: "Auth Error: " + authError.message };
    }

    // -------------------------------------------------------
    // Step 2 — Insert into Users Table via SQL Function
    // -------------------------------------------------------
    const { data: linkData, error: linkError } = await supabase.rpc(
      "signup_user",
      {
        p_email: email,
        p_full_name: full_name,
        p_role: role,
        p_number: number
      }
    );

    if (linkError) {
      // If linking fails, rollback by deleting the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);

      return {
        success: false,
        message: "Linking Error: " + linkError.message
      };
    }

    // Success
    return {
      success: true,
      message: "Account created successfully.",
      user_id: linkData
    };
  } catch (err) {
    return { success: false, message: "Unexpected Error: " + err.message };
  }
}

// -------------------------------------------------------
// 3. Example Usage (remove if not needed)
// -------------------------------------------------------
/*
(async () => {
  const result = await registerUser({
    email: "alice@example.com",
    password: "StrongPass123!",
    full_name: "Alice Johnson",
    role: "hr",
    number: "ST-0001"
  });

  console.log(result);
})();
*/

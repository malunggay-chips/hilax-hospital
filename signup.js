// ================== SUPABASE SETUP ==================
const supabaseUrl = "https://fudohjfxedzabtpjnxnk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZG9oamZ4ZWR6YWJ0cGpueG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjk1ODcsImV4cCI6MjA3ODYwNTU4N30.K1_dRmW_cWGvpvErwYa2uKtAbn3b2BqLD1n7QwLmFh8";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if(error){
        alert('Login failed: ' + error.message);
        return;
    }

    // Fetch role from users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if(userError){
        alert('Error fetching user info: ' + userError.message);
        return;
    }

    localStorage.setItem('user_role', userData.role);
    localStorage.setItem('user_email', userData.email);

    window.location.href = 'dashboard.html';
});

// ===== SIGNUP =====
document.getElementById('signupForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const full_name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('role').value;
    const linked_number = document.getElementById('linked-number').value;

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if(authError){
        alert('Signup failed: ' + authError.message);
        return;
    }

    // Get linked ID from pre-registered table
    let linked_id = null;
    if(role === 'patient'){
        const { data: patientData, error: patientError } = await supabase
            .from('pre_registered_patients')
            .select('*')
            .eq('patient_number', linked_number)
            .single();
        if(patientError || !patientData){ alert('Invalid patient number'); return; }
        linked_id = patientData.patient_id;
    } else {
        const { data: staffData, error: staffError } = await supabase
            .from('pre_registered_staff')
            .select('*')
            .eq('staff_number', linked_number)
            .single();
        if(staffError || !staffData){ alert('Invalid staff number'); return; }
        linked_id = staffData.staff_id;
    }

    // Insert into users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, email, full_name, role, linked_id, linked_number }]);
    if(userError){ alert('Error creating user: ' + userError.message); return; }

    alert('Signup successful! You can now log in.');
    closeOverlay();
});

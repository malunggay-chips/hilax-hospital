// ================== SUPABASE SETUP ==================
const supabaseUrl = "https://fudohjfxedzabtpjnxnk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZG9oamZ4ZWR6YWJ0cGpueG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjk1ODcsImV4cCI6MjA3ODYwNTU4N30.K1_dRmW_cWGvpvErwYa2uKtAbn3b2BqLD1n7QwLmFh8";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if(error) {
        alert('Login failed: ' + error.message);
        return;
    }

    // Fetch role from users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if(userError){
        alert('Error fetching user info');
        return;
    }

    // Redirect based on role
    const role = userData.role;
    if(role === 'hr') window.location.href = 'dashboard.html';
    else window.location.href = 'dashboard.html'; // for demo, same dashboard but show/hide sections
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
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if(authError){
        alert('Signup failed: ' + authError.message);
        return;
    }

    // Get linked ID from pre-registered table
    let linked_id = null;
    if(role === 'patient'){
        const { data: patientData } = await supabase
            .from('pre_registered_patients')
            .select('*')
            .eq('patient_number', linked_number)
            .single();
        linked_id = patientData.patient_id;
    } else {
        const { data: staffData } = await supabase
            .from('pre_registered_staff')
            .select('*')
            .eq('staff_number', linked_number)
            .single();
        linked_id = staffData.staff_id;
    }

    // Insert into users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
            id: authData.user.id,
            email,
            full_name,
            role,
            linked_id,
            linked_number
        }]);

    if(userError){
        alert('Error creating user: ' + userError.message);
        return;
    }

    alert('Signup successful! You can now log in.');
    closeOverlay();
});

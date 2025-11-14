// ================== SUPABASE SETUP ==================
const supabaseUrl = "YOUR_SUPABASE_URL"; // replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZG9oamZ4ZWR6YWJ0cGpueG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjk1ODcsImV4cCI6MjA3ODYwNTU4N30.K1_dRmW_cWGvpvErwYa2uKtAbn3b2BqLD1n7QwLmFh8"; // replace with your anon key
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ================== OVERLAY FUNCTIONS ==================
function showOverlay(sectionId){
    document.getElementById(sectionId).style.display = 'block';
    window.scrollTo(0,0);
}

function closeOverlay(){
    document.getElementById('login').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
}

function scrollToHome(){
    closeOverlay();
    window.scrollTo(0,0);
}

// ================== SIGNUP FORM ==================
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullName = this.querySelector('input[placeholder="Full Name"]').value;
    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Password"]').value;
    const role = this.querySelector('#role').value;

    let uniqueNumber = '';

    // Auto-generate patient or staff numbers
    if(role === 'patient'){
        uniqueNumber = 'P-' + Date.now();
    } else if(['physician','nurse','pharmacist','medtech','radtech','hr'].includes(role)){
        uniqueNumber = 'S-' + Date.now();
    }

    try {
        // 1️⃣ Create Supabase Auth account
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if(authError) throw authError;

        // 2️⃣ Insert into users table
        const { data: userInsert, error: userError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id, // link Supabase Auth ID
                full_name: fullName,
                email: email,
                role: role,
                linked_number: uniqueNumber
            }]);

        if(userError) throw userError;

        alert(`Account created! Your ${role} number is: ${uniqueNumber}`);
        closeOverlay();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

// ================== LOGIN FORM ==================
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Password"]').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if(error) throw error;

        alert('Login successful! Welcome ' + email);
        closeOverlay();

        // TODO: Redirect to role-specific dashboard
    } catch(err){
        alert('Login error: ' + err.message);
    }
});

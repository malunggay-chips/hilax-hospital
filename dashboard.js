// ================== SUPABASE SETUP ==================
const supabaseUrl = "https://fudohjfxedzabtpjnxnk.supabase.co"; // replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZG9oamZ4ZWR6YWJ0cGpueG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjk1ODcsImV4cCI6MjA3ODYwNTU4N30.K1_dRmW_cWGvpvErwYa2uKtAbn3b2BqLD1n7QwLmFh8"; // replace with your anon key
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ================== DASHBOARD FUNCTIONS ==================
async function initDashboard() {
    const user = supabase.auth.getUser();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
        alert('You are not logged in! Redirecting to homepage.');
        window.location.href = 'index.html';
        return;
    }

    const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.data.session.user.id)
        .single();

    if(error){
        console.error(error);
        alert('Error fetching user info');
        return;
    }

    const role = userData.role;
    document.getElementById('role-info').innerText = `Logged in as: ${role.toUpperCase()}`;

    // Hide all sections first
    const sections = ['patients','prescriptions','lab-results','radiology','patient-reports','billing'];
    sections.forEach(sec => document.getElementById(sec+'-section').style.display = 'none');

    // Show sections based on role
    if(role === 'physician'){
        document.getElementById('patients-section').style.display = 'block';
        document.getElementById('prescriptions-section').style.display = 'block';
        document.getElementById('patient-reports-section').style.display = 'block';
    } else if(role === 'nurse'){
        document.getElementById('patients-section').style.display = 'block';
        document.getElementById('patient-reports-section').style.display = 'block';
    } else if(role === 'pharmacist'){
        document.getElementById('prescriptions-section').style.display = 'block';
    } else if(role === 'medtech'){
        document.getElementById('lab-results-section').style.display = 'block';
    } else if(role === 'radtech'){
        document.getElementById('radiology-section').style.display = 'block';
    } else if(role === 'hr'){
        // HR/Admin sees all sections
        sections.forEach(sec => document.getElementById(sec+'-section').style.display = 'block');
    } else if(role === 'patient'){
        document.getElementById('patients-section').style.display = 'block';
    }
}

// ================== LOGOUT FUNCTION ==================
async function logout(){
    const { error } = await supabase.auth.signOut();
    if(error) alert('Error logging out: ' + error.message);
    else window.location.href = 'index.html';
}

// ================== INIT ==================
window.onload = initDashboard;

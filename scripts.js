// ================== Supabase Setup ==================
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ================== Overlay Functions ==================
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

// ================== Signup Form ==================
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullName = this.querySelector('input[placeholder="Full Name"]').value;
    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Password"]').value;
    const role = this.querySelector('#role').value;

    let uniqueNumber = '';

    if(role === 'patient'){
        uniqueNumber = 'P-' + Date.now();
    } else if(['physician','nurse','pharmacist','medtech','radtech','hr'].includes(role)){
        uniqueNumber = 'S-' + Date.now();
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if(error){
        alert('Error signing up: ' + error.message);
        return;
    }

    const { data: userInsert, error: userError } = await supabase
        .from('users')
        .insert([{
            id: data.user.id,
            full_name: fullName,
            email: email,
            role: role,
            linked_number: uniqueNumber
        }]);

    if(userError){
        alert('Error saving user info: ' + userError.message);
        return;
    }

    alert(`Account created! Your ${role} number is: ${uniqueNumber}`);
    closeOverlay();
});

// ================== Login Form ==================
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Password"]').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if(error){
        alert('Login error: ' + error.message);
        return;
    }

    alert('Login successful! Welcome ' + email);
    closeOverlay();

    // TODO: redirect to dashboard based on role
});

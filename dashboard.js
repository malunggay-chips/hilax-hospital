const role = localStorage.getItem('user_role') || '';

// Show dashboard section based on role
if(role === 'hr'){
    document.getElementById('hr-section').style.display = 'block';
} else if(['physician','nurse','pharmacist','medtech','radtech'].includes(role)){
    document.getElementById('staff-section').style.display = 'block';
} else if(role === 'patient'){
    document.getElementById('patient-section').style.display = 'block';
} else {
    alert('Role not recognized. Logging out.');
    logout();
}

// Logout function
function logout(){
    supabase.auth.signOut().then(() => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
}

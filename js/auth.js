// auth.js

function login() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    if (!email || !password) { showToast('Fill all fields'); return; }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast(`Welcome back, ${user.name}!`);
        closeModal('loginModal');
        
        // Redirect based on where they are
        if (window.location.pathname.includes('login.html')) {
            setTimeout(() => { window.location.href = 'profile.html'; }, 800);
        } else {
            showProfile();
        }
    } else {
        showToast('Invalid email or password');
    }
}

function register() {
    const name = document.getElementById('regName')?.value;
    const email = document.getElementById('regEmail')?.value;
    const password = document.getElementById('regPassword')?.value;
    const type = document.getElementById('regType')?.value;
    
    if (!name || !email || !password) { showToast('Fill all fields'); return; }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) { showToast('Email already exists'); return; }
    
    const newUser = { id: Date.now(), name, email, password, type, joined: new Date().getFullYear().toString(), phone: "", location: "", profilePic: null };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showToast('Registration successful! Please login.');
    
    if (window.location.pathname.includes('register.html')) {
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } else {
        closeModal('registerModal');
        showModal('loginModal');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    showToast('Logged out');
    updateAuthUI();
    closeAllModals();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        showHome();
    } else {
        window.location.href = 'index.html';
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        authButtons.innerHTML = `
            <span style="display: flex; align-items: center; gap: 0.5rem; color: #C6A43F; font-weight: 500;"><i class="fas fa-user-circle"></i> ${currentUser.name}</span>
            <button class="btn-login" onclick="logout()" style="margin-left: 10px;">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="showModal('loginModal')">Sign In</button>
            <button class="btn-register" onclick="showModal('registerModal')">Join Now</button>
        `;
    }
}

document.addEventListener('DOMContentLoaded', updateAuthUI);
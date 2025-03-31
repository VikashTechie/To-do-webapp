//  Complete Authentication System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

// Updated signup handler in script_1.js
document.querySelector('#signupModal form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Get values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;
    
    let isValid = true;

    // Username validation
    if (!username) {
        showError('username', 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters');
        isValid = false;
    }

    // Email validation
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
    }

    // Password validation
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
        showError('confirmpassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmpassword', 'Passwords do not match');
        isValid = false;
    }

    // Check for existing user
    if (isValid) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => 
            user.username.toLowerCase() === username.toLowerCase() || 
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (userExists) {
            showError('email', 'Username or email already exists');
            isValid = false;
        }
    }

    // If all validations pass
    if (isValid) {
        const newUser = {
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Reset form
        this.reset();
        
        // Close signup modal
        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        signupModal.hide();
        
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('signupSuccessModal'));
        successModal.show();
    }
});

// Helper functions
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    input.classList.add('is-invalid');
    errorElement.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.textContent = '';
    });
}

// Reset form when modal is closed
document.getElementById('signupModal')?.addEventListener('hidden.bs.modal', function() {
    document.querySelector('#signupModal form').reset();
});
    // Login form submission
    document.querySelector('#loginModal form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        const errorElement = document.getElementById('loginError');
        errorElement.classList.add('d-none');
        errorElement.textContent = '';
        
        // Get values
        const usernameOrEmail = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Basic validation
        if (!usernameOrEmail || !password) {
            showLoginError('Both fields are required');
            return;
        }
    
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user (case-insensitive for username/email)
        const user = users.find(u => 
            (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
             u.email.toLowerCase() === usernameOrEmail.toLowerCase())
        );
    
        if (!user) {
            showLoginError('User not found. Please check your credentials');
            return;
        }
    
        if (user.password !== password) {
            showLoginError('Incorrect password');
            return;
        }
    
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            email: user.email
        }));
    
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        window.location.href = 'test.html';
    });
    
    // Helper function to show login errors
    function showLoginError(message) {
        const errorElement = document.getElementById('loginError');
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        
        // Optional: Add shake animation
        errorElement.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            errorElement.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
    }
    // Debug helper
    console.log('Current users:', JSON.parse(localStorage.getItem('users')));
});
/* Particles.js config */
particlesJS("particles-js", {
    "particles": {
      "number": { "value": 40 },
      "size": { "value": 3 },
      "color": { "value": "#c53d30" },
      "line_linked": { "enable": true, "distance": 180, "color": "#c53d30", "opacity": 0.2, "width": 0.8 },
      "move": { "enable": true, "speed": 1 }
    },
    "interactivity": {
      "events": {
        "onhover": { "enable": true, "mode": "repulse" }
      }
    }
  });
 // Button ko show/hide karne ka function
 window.onscroll = function () {
  let btn = document.getElementById("backToTop");
  if (document.documentElement.scrollTop > 200) {
      btn.style.display = "block";
  } else {
      btn.style.display = "none";
  }
};

// Smooth Scroll to Top Function
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// API Base URL
const API_URL = '/api';

// Auth State
let currentUser = JSON.parse(localStorage.getItem('user'));

// DOM Elements
const authForm = document.getElementById('auth-form');
const logoutBtn = document.getElementById('logout-btn');

// --- AUTHENTICATION ---

async function login(username, password) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/home.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred during login');
    }
}

async function registerExtended(userData) {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (res.ok) {
            alert('Registration successful! Please login.');
            toggleAuthMode();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('An error occurred during registration');
    }
}

async function updateProfile(e) {
    e.preventDefault();

    const bio = document.getElementById('edit-bio').value;
    const university = document.getElementById('edit-university').value;
    const subject = document.getElementById('edit-subject').value;
    const country = document.getElementById('edit-country').value;
    const city = document.getElementById('edit-city').value;
    const file = document.getElementById('edit-avatar').files[0];

    const formData = new FormData();
    formData.append('userId', currentUser.id);
    formData.append('bio', bio);
    formData.append('university', university);
    formData.append('subject', subject);
    formData.append('country', country);
    formData.append('city', city);
    if (file) formData.append('avatar', file);

    try {
        const res = await fetch(`${API_URL}/auth/update`, {
            method: 'PUT',
            body: formData
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user)); // Update local storage
            alert('Profile updated!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error('Update error:', err);
        alert('Failed to update profile');
    }
}

function handleAuthSubmit(e) {
    // This is now handled inline in index.html for specific field gathering
    // Keeping this function for safety or legacy calls fallback
}

// Helper to toggle between Login and Signup forms
let isLoginMode = true;
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById('form-title');
    const emailGroup = document.getElementById('email-group');
    const submitBtn = document.getElementById('auth-submit');
    const toggleText = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');

    if (isLoginMode) {
        formTitle.textContent = 'Welcome Back';
        emailGroup.style.display = 'none';
        submitBtn.textContent = 'Sign In';
        submitBtn.dataset.mode = 'login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Create Account';
        emailGroup.style.display = 'block';
        submitBtn.textContent = 'Sign Up';
        submitBtn.dataset.mode = 'register';
        toggleText.textContent = "Already have an account?";
        toggleLink.textContent = 'Sign In';
    }
}

// --- APP LOGIC ---

function checkAuth() {
    if (!currentUser) {
        window.location.href = '/';
    }
}

function renderPosts(posts, containerId, allowDelete = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No posts found.</div>';
        return;
    }

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'card post';

        let mediaHtml = '';
        if (post.mediaUrl) {
            // Check for Images vs Video vs Generic File
            const isVideo = post.mediaType && post.mediaType.startsWith('video/');
            const isImage = post.mediaType && post.mediaType.startsWith('image/');

            if (isImage) {
                mediaHtml = `<div class="post-media"><img src="${post.mediaUrl}" alt="Post media" style="width:100%; display:block;"></div>`;
            } else if (isVideo) {
                mediaHtml = `<div class="post-media"><video src="${post.mediaUrl}" controls style="width:100%"></video></div>`;
            } else {
                // Formatting as File Attachment (Document)
                const fileName = post.mediaUrl.split('/').pop();
                mediaHtml = `
                    <div class="file-attachment">
                        <div class="file-icon"><i class="fa-solid fa-file-arrow-down"></i></div>
                        <div style="flex: 1; overflow: hidden;">
                            <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileName}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">Document</div>
                        </div>
                        <a href="${post.mediaUrl}" download class="btn btn-primary" style="font-size: 0.8rem;">Download</a>
                    </div>
                `;
            }
        }

        let deleteBtn = '';
        const canDelete = allowDelete || post.userId === currentUser.id || currentUser.role === 'admin';

        if (canDelete) {
            deleteBtn = `
                <button onclick="deletePost('${post.id}')" class="btn btn-icon" style="color: #ef4444;" title="Delete Post">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
        }

        const avatarUrl = `https://ui-avatars.com/api/?name=${post.username}&background=random`;

        div.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <div class="avatar"><img src="${avatarUrl}" alt="User"></div>
                    <div>
                        <div style="font-weight: 600; color: var(--text);">${post.username}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Posted on ${new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                ${deleteBtn}
            </div>
            <div class="post-content">${post.content}</div>
            ${mediaHtml}
        `;
        container.appendChild(div);
        container.appendChild(div);
    });
}
window.renderPosts = renderPosts; // Make accessible to inline scripts

// Load Home Feed
async function loadFeed() {
    try {
        const res = await fetch(`${API_URL}/content`);
        const posts = await res.json();
        renderPosts(posts, 'posts-container');
    } catch (err) {
        console.error('Error loading feed:', err);
    }
}

// Load Dashboard (My Posts or All for Admin)
async function loadDashboard(isAdmin) {
    try {
        let url = `${API_URL}/content/user/${currentUser.id}`;
        if (isAdmin) {
            url = `${API_URL}/content`; // Admin sees all
        }

        const res = await fetch(url);
        const posts = await res.json();
        renderPosts(posts, 'posts-container', true);
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

// Search Posts
async function searchPosts() {
    const query = document.getElementById('search-input').value;
    try {
        const res = await fetch(`${API_URL}/content?search=${encodeURIComponent(query)}`);
        const posts = await res.json();
        renderPosts(posts, 'posts-container');
    } catch (err) {
        console.error('Error searching:', err);
    }
}

// Create Post
async function createPost(e) {
    e.preventDefault();

    const content = document.getElementById('post-content').value;
    const mediaFile = document.getElementById('post-media').files[0];

    const formData = new FormData();
    formData.append('userId', currentUser.id);
    formData.append('username', currentUser.username);
    formData.append('content', content);
    if (mediaFile) {
        formData.append('media', mediaFile);
    }

    try {
        const res = await fetch(`${API_URL}/content`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            document.getElementById('post-content').value = '';
            document.getElementById('post-media').value = '';
            document.getElementById('file-name').textContent = '';
            loadFeed(); // Refresh
        } else {
            alert('Failed to post');
        }
    } catch (err) {
        console.error('Error posting:', err);
    }
}

// Delete Post
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const res = await fetch(`${API_URL}/content/${postId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, role: currentUser.role })
        });

        if (res.ok) {
            // Refresh current view (Feed or Dashboard)
            if (window.location.pathname.includes('dashboard')) {
                loadDashboard(currentUser.role === 'admin');
            } else {
                loadFeed();
            }
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to delete');
        }
    } catch (err) {
        console.error('Error deleting:', err);
    }
}

// --- INITIALIZATION ---

if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/index.html'; // Explicitly go to index.html
    });
}

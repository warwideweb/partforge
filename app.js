// ForgAuto — 3D Marketplace for Cars
// Version: 3.0 - Full Backend Integration

const VERSION = '3.0';
const API_URL = 'https://api.forgauto.com'; // Change to your Cloudflare Worker URL

// State
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Check auth on load
async function checkAuth() {
    if (!authToken) return;
    try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
            const data = await res.json();
            currentUser = data.user;
            updateNavAuth();
        } else {
            localStorage.removeItem('authToken');
            authToken = null;
        }
    } catch (e) {
        console.error('Auth check failed:', e);
    }
}

function updateNavAuth() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.textContent = currentUser.name.split(' ')[0];
        loginBtn.onclick = () => go('dashboard');
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => go('login');
    }
}

// API helpers
async function api(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
}

// Static data for demo (will be replaced by API)
const categories = [
    { name: "Interior", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop" },
    { name: "Exterior", img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=300&fit=crop" },
    { name: "Gauges", img: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=300&h=300&fit=crop" },
    { name: "Accessories", img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=300&h=300&fit=crop" },
    { name: "Performance", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=300&fit=crop" },
    { name: "Lighting", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=300&fit=crop" }
];

const carMakes = ["BMW", "Chevrolet", "Ford", "Honda", "Mazda", "Nissan", "Porsche", "Subaru", "Toyota", "Volkswagen", "Universal"];
const carModels = {
    "BMW": ["E30", "E36", "E46", "E90", "F30", "F80"],
    "Chevrolet": ["Camaro 5th Gen", "Camaro 6th Gen", "Corvette C7", "Corvette C8"],
    "Ford": ["Mustang S197", "Mustang S550", "Focus RS", "F-150"],
    "Honda": ["Civic EG", "Civic EK", "Civic FD", "S2000", "Integra", "NSX"],
    "Mazda": ["Miata NA", "Miata NB", "Miata NC", "Miata ND", "RX-7 FD", "RX-8"],
    "Nissan": ["350Z", "370Z", "GTR R35", "Silvia S13", "Silvia S14", "240SX"],
    "Porsche": ["911 996", "911 997", "911 991", "Cayman 987", "Boxster"],
    "Subaru": ["WRX", "STI", "BRZ", "Impreza", "Forester"],
    "Toyota": ["Supra MK4", "Supra MK5", "AE86", "GR86", "Celica", "MR2"],
    "Volkswagen": ["Golf MK4", "Golf MK5", "Golf MK6", "Golf MK7", "GTI", "R32"],
    "Universal": ["All"]
};

// Demo data (fallback)
const demoParts = [
    { id: 1, title: "Tesla-Style Phone Mount", category: "Interior", make: "Universal", model: "All", price: 3.99, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop"], seller_name: "AutoParts3D", seller_email: "auto@example.com", description: "Minimalist phone mount for car vents with ball joint design.", file_format: "STL, STEP", file_size: "1.8 MB", material: "PLA", infill: "25%", downloads: 567, featured: 1 },
    { id: 2, title: "BMW E30 Phone Dock", category: "Interior", make: "BMW", model: "E30", price: 5.99, images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=450&fit=crop"], seller_name: "BimmerParts", seller_email: "bmw@example.com", description: "Custom phone dock for BMW E30 center console.", file_format: "STL", file_size: "2.1 MB", material: "PETG", infill: "30%", downloads: 312 },
    { id: 3, title: "Toyota Supra MK4 Gauge Pod", category: "Gauges", make: "Toyota", model: "Supra MK4", price: 8.99, images: ["https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&h=450&fit=crop"], seller_name: "JDMParts3D", seller_email: "jdm@example.com", description: "52mm gauge pod for MK4 Supra center vent.", file_format: "STL, STEP", file_size: "3.4 MB", material: "ABS", infill: "40%", downloads: 523, featured: 1 },
    { id: 4, title: "Honda Civic EG Cup Holder", category: "Interior", make: "Honda", model: "Civic EG", price: 4.49, images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=450&fit=crop"], seller_name: "HondaHacks", seller_email: "honda@example.com", description: "Dual cup holder insert for Civic EG.", file_format: "STL", file_size: "1.6 MB", material: "PLA", infill: "25%", downloads: 445 },
    { id: 5, title: "Mazda Miata NA Phone Mount", category: "Interior", make: "Mazda", model: "Miata NA", price: 6.99, images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=450&fit=crop"], seller_name: "MiataMods", seller_email: "miata@example.com", description: "Low-profile phone mount for NA Miata.", file_format: "STL", file_size: "1.9 MB", material: "PETG", infill: "30%", downloads: 678 },
    { id: 6, title: "BMW E46 Coin Delete", category: "Interior", make: "BMW", model: "E46", price: 3.49, images: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=450&fit=crop"], seller_name: "BimmerParts", seller_email: "bmw@example.com", description: "Clean delete panel for E46 coin holder.", file_format: "STL", file_size: "0.8 MB", material: "PLA", infill: "20%", downloads: 234 },
    { id: 7, title: "Nissan 350Z Triple Gauge Pod", category: "Gauges", make: "Nissan", model: "350Z", price: 12.99, images: ["https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&h=450&fit=crop"], seller_name: "ZCarParts", seller_email: "zcar@example.com", description: "A-pillar triple gauge pod for 350Z.", file_format: "STL, STEP", file_size: "4.8 MB", material: "ABS", infill: "35%", downloads: 389 },
    { id: 8, title: "Subaru WRX Shift Surround", category: "Interior", make: "Subaru", model: "WRX", price: 4.99, images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=450&fit=crop"], seller_name: "SubieParts", seller_email: "subie@example.com", description: "Custom shift boot surround for GD WRX.", file_format: "STL", file_size: "1.4 MB", material: "PETG", infill: "25%", downloads: 456 }
];

const demoDesigners = [
    { id: 1, name: "Alex Chen", role: "designer", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", bio: "10+ years designing aftermarket auto parts. Fusion 360 and SolidWorks expert.", rate: "$50/hr", tags: ["JDM", "European", "Interior"], stats: { avgRating: 4.9, reviewCount: 47, parts: 127 } },
    { id: 2, name: "Mike Rodriguez", role: "designer", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop", bio: "JDM enthusiast with 200+ parts designed.", rate: "$40/hr", tags: ["Honda", "Toyota", "Nissan"], stats: { avgRating: 4.8, reviewCount: 89, parts: 213 } },
    { id: 3, name: "Sarah Miller", role: "designer", avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop", bio: "Former BMW interior designer. Premium-feel parts.", rate: "$45/hr", tags: ["Interior", "Trim", "Luxury"], stats: { avgRating: 5.0, reviewCount: 34, parts: 89 } },
    { id: 4, name: "James Park", role: "designer", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", bio: "Ex-Tesla engineer. Functional aero and cooling parts.", rate: "$55/hr", tags: ["Performance", "Aero"], stats: { avgRating: 4.7, reviewCount: 28, parts: 78 } },
    { id: 5, name: "Emily Watson", role: "designer", avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", bio: "European car specialist. Perfect fitment guaranteed.", rate: "$45/hr", tags: ["BMW", "VW", "Porsche"], stats: { avgRating: 4.9, reviewCount: 62, parts: 156 } },
    { id: 6, name: "David Kim", role: "designer", avatar_url: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop", bio: "Muscle car enthusiast. Mustangs and Camaros.", rate: "$40/hr", tags: ["Mustang", "Camaro"], stats: { avgRating: 4.8, reviewCount: 41, parts: 98 } }
];

const printShops = [
    { name: "3D Print Lab Bangkok", address: "123 Sukhumvit Rd, Bangkok", distance: "2.3 km", rating: 4.8, reviews: 156, phone: "+66 2 123 4567", email: "contact@3dprintlab.th", verified: true, instantQuote: true, printAndShip: true, turnaround: "2-3 days" },
    { name: "MakerSpace BKK", address: "456 Silom Rd, Bangkok", distance: "4.1 km", rating: 4.6, reviews: 89, phone: "+66 2 234 5678", email: "hello@makerspace.co.th", verified: true, instantQuote: true, printAndShip: false, turnaround: "3-5 days" },
    { name: "Proto3D Thailand", address: "789 Rama IV, Bangkok", distance: "5.8 km", rating: 4.9, reviews: 234, phone: "+66 2 345 6789", email: "orders@proto3d.th", verified: true, instantQuote: true, printAndShip: true, turnaround: "1-2 days" }
];

let view = 'home', filter = '', filterCat = '', filterMake = '', filterModel = '', uploadedPhotos = [];
let parts = demoParts;
let designers = demoDesigners;

// Load data from API
async function loadParts() {
    try {
        const params = new URLSearchParams();
        if (filterCat) params.set('category', filterCat);
        if (filterMake) params.set('make', filterMake);
        if (filterModel) params.set('model', filterModel);
        if (filter) params.set('search', filter);
        
        const data = await api(`/api/parts?${params}`);
        parts = data.length ? data : demoParts;
    } catch (e) {
        console.log('Using demo data:', e.message);
        parts = demoParts;
    }
}

async function loadDesigners() {
    try {
        const data = await api('/api/designers');
        designers = data.length ? data : demoDesigners;
    } catch (e) {
        designers = demoDesigners;
    }
}

function go(v, data) { view = v; render(data); window.scrollTo(0, 0); }
function search(e) { if (e.key === 'Enter') { filter = e.target.value; go('browse'); } }
function doSearch() {
    filter = document.getElementById('heroSearch')?.value || '';
    filterCat = document.getElementById('filterCat')?.value || '';
    filterMake = document.getElementById('filterMake')?.value || '';
    filterModel = document.getElementById('filterModel')?.value || '';
    go('browse');
}
function updateModels() {
    const make = document.getElementById('filterMake')?.value;
    const modelSelect = document.getElementById('filterModel');
    if (!modelSelect) return;
    modelSelect.innerHTML = '<option value="">All Models</option>';
    if (make && carModels[make]) carModels[make].forEach(m => { modelSelect.innerHTML += `<option value="${m}">${m}</option>`; });
}

async function render(data) {
    const app = document.getElementById('app');
    if (view === 'home') { await loadParts(); app.innerHTML = homeView(); }
    else if (view === 'browse') { await loadParts(); app.innerHTML = browseView(); }
    else if (view === 'designers') { await loadDesigners(); app.innerHTML = designersView(); }
    else if (view === 'sell') app.innerHTML = sellView();
    else if (view === 'part') { app.innerHTML = await partView(data); initViewer(data); }
    else if (view === 'designer') app.innerHTML = await designerView(data);
    else if (view === 'printshops') app.innerHTML = printShopsView(data);
    else if (view === 'login') app.innerHTML = loginView();
    else if (view === 'signup') app.innerHTML = signupView();
    else if (view === 'dashboard') app.innerHTML = await dashboardView();
    else if (view === 'profile') app.innerHTML = await profileView(data);
}

function openLightbox(src) { document.getElementById('lightbox').classList.add('active'); document.getElementById('lightboxImg').src = src; }
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); }

// ========== AUTH VIEWS ==========

function loginView() {
    return `<div class="auth-container">
        <div class="auth-box">
            <h1>Login</h1>
            <p>Welcome back to ForgAuto</p>
            <form onsubmit="handleLogin(event)">
                <div class="field"><label>Email</label><input type="email" id="loginEmail" required></div>
                <div class="field"><label>Password</label><input type="password" id="loginPassword" required></div>
                <div id="loginError" class="error-msg"></div>
                <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Login</button>
            </form>
            <p class="auth-switch">Don't have an account? <a href="#" onclick="go('signup')">Sign up</a></p>
        </div>
    </div>`;
}

function signupView() {
    return `<div class="auth-container">
        <div class="auth-box">
            <h1>Create Account</h1>
            <p>Join ForgAuto as a seller or designer</p>
            <form onsubmit="handleSignup(event)">
                <div class="field"><label>Name</label><input type="text" id="signupName" required></div>
                <div class="field"><label>Email</label><input type="email" id="signupEmail" required></div>
                <div class="field"><label>Password</label><input type="password" id="signupPassword" required minlength="6"></div>
                <div class="field"><label>I am a...</label>
                    <select id="signupRole">
                        <option value="seller">Seller (I have parts to sell)</option>
                        <option value="designer">Designer (I create custom parts)</option>
                    </select>
                </div>
                <div id="signupError" class="error-msg"></div>
                <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Create Account</button>
            </form>
            <p class="auth-switch">Already have an account? <a href="#" onclick="go('login')">Login</a></p>
        </div>
    </div>`;
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user;
        updateNavAuth();
        go('dashboard');
    } catch (err) {
        document.getElementById('loginError').textContent = err.message;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    try {
        const data = await api('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role })
        });
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user;
        updateNavAuth();
        go('dashboard');
    } catch (err) {
        document.getElementById('signupError').textContent = err.message;
    }
}

async function handleLogout() {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch (e) {}
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    updateNavAuth();
    go('home');
}

// ========== DASHBOARD VIEW ==========

async function dashboardView() {
    if (!currentUser) return loginView();
    
    let myParts = [], mySales = [], myPurchases = [];
    try {
        myParts = await api('/api/parts?user=' + currentUser.id);
    } catch (e) { myParts = []; }
    try {
        mySales = await api('/api/sales');
    } catch (e) { mySales = []; }
    try {
        myPurchases = await api('/api/purchases');
    } catch (e) { myPurchases = []; }
    
    return `<div class="dashboard">
        <div class="dashboard-header">
            <div class="dashboard-user">
                <div class="user-avatar">${currentUser.avatar_url ? `<img src="${currentUser.avatar_url}">` : currentUser.name.charAt(0)}</div>
                <div>
                    <h1>${currentUser.name}</h1>
                    <span class="user-role">${currentUser.role === 'designer' ? 'Designer' : 'Seller'}</span>
                </div>
            </div>
            <div class="dashboard-actions">
                <a href="#" onclick="go('sell')" class="btn btn-primary">+ New Listing</a>
                <button onclick="handleLogout()" class="btn btn-outline">Logout</button>
            </div>
        </div>
        
        <div class="dashboard-nav">
            <button class="dash-tab active" onclick="showDashTab('listings')">My Listings</button>
            <button class="dash-tab" onclick="showDashTab('sales')">Sales</button>
            <button class="dash-tab" onclick="showDashTab('purchases')">Purchases</button>
            <button class="dash-tab" onclick="showDashTab('settings')">Settings</button>
        </div>
        
        <div id="dashListings" class="dash-content">
            <h2>My Listings (${myParts.length})</h2>
            ${myParts.length ? `<div class="grid">${myParts.map(cardHTML).join('')}</div>` : '<p class="empty-state">No listings yet. <a href="#" onclick="go(\'sell\')">Create your first listing</a></p>'}
        </div>
        
        <div id="dashSales" class="dash-content" style="display:none">
            <h2>Sales</h2>
            ${mySales.length ? `<div class="sales-list">${mySales.map(s => `<div class="sale-item"><strong>${s.title}</strong> sold to ${s.buyer_name} for $${s.price.toFixed(2)}<span class="sale-date">${new Date(s.created_at).toLocaleDateString()}</span></div>`).join('')}</div>` : '<p class="empty-state">No sales yet.</p>'}
        </div>
        
        <div id="dashPurchases" class="dash-content" style="display:none">
            <h2>My Purchases</h2>
            ${myPurchases.length ? `<div class="purchase-list">${myPurchases.map(p => `<div class="purchase-item"><strong>${p.title}</strong> by ${p.seller_name}<span class="purchase-price">$${p.price.toFixed(2)}</span><a href="#" onclick="go('part', ${p.part_id})" class="btn btn-sm">View</a></div>`).join('')}</div>` : '<p class="empty-state">No purchases yet.</p>'}
        </div>
        
        <div id="dashSettings" class="dash-content" style="display:none">
            <h2>Profile Settings</h2>
            <form onsubmit="handleProfileUpdate(event)" class="settings-form">
                <div class="field"><label>Name</label><input type="text" id="settingsName" value="${currentUser.name}"></div>
                <div class="field"><label>Bio</label><textarea id="settingsBio" rows="3">${currentUser.bio || ''}</textarea></div>
                ${currentUser.role === 'designer' ? `
                    <div class="field"><label>Hourly Rate</label><input type="text" id="settingsRate" value="${currentUser.rate || ''}" placeholder="$50/hr"></div>
                    <div class="field"><label>Specialties (comma separated)</label><input type="text" id="settingsTags" value="${(currentUser.tags || []).join(', ')}" placeholder="JDM, Interior, BMW"></div>
                ` : ''}
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
        </div>
    </div>`;
}

function showDashTab(tab) {
    document.querySelectorAll('.dash-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.dash-tab').forEach(el => el.classList.remove('active'));
    document.getElementById('dash' + tab.charAt(0).toUpperCase() + tab.slice(1)).style.display = 'block';
    event.target.classList.add('active');
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const name = document.getElementById('settingsName').value;
    const bio = document.getElementById('settingsBio').value;
    const rate = document.getElementById('settingsRate')?.value;
    const tagsInput = document.getElementById('settingsTags')?.value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : null;
    
    try {
        await api('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, bio, rate, tags })
        });
        currentUser = { ...currentUser, name, bio, rate, tags };
        alert('Profile updated!');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ========== HOME VIEW ==========

function homeView() {
    const trendingParts = [...parts].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
    const featuredParts = parts.filter(p => p.featured);
    
    return `
        <div class="sold-ticker"><div class="ticker-content">
            <span class="ticker-item"><strong>Mike T.</strong> from California bought <strong>Tesla Phone Mount</strong> - 2 min ago</span>
            <span class="ticker-item"><strong>Sarah K.</strong> from Texas bought <strong>BMW E30 Dock</strong> - 5 min ago</span>
            <span class="ticker-item"><strong>Jake R.</strong> from Florida bought <strong>Miata Mount</strong> - 8 min ago</span>
            <span class="ticker-item"><strong>Emma L.</strong> from New York bought <strong>VW Golf Mount</strong> - 12 min ago</span>
            <span class="ticker-item"><strong>Mike T.</strong> from California bought <strong>Tesla Phone Mount</strong> - 2 min ago</span>
            <span class="ticker-item"><strong>Sarah K.</strong> from Texas bought <strong>BMW E30 Dock</strong> - 5 min ago</span>
        </div></div>

        <div class="promo-banner">
            <div class="promo-content"><span class="promo-badge">NEW</span><span class="promo-text">Need a custom part? <strong>Find a Designer</strong> to create it for you</span></div>
            <a href="#" onclick="go('designers')" class="promo-cta">Browse Designers</a>
        </div>

        <div class="hero">
            <h1>3D parts for your car</h1>
            <p>The marketplace for automotive STL files. Buy instantly, sell and keep 100%.</p>
            <div class="hero-search">
                <input type="text" id="heroSearch" placeholder="Search parts, make, model..." onkeyup="if(event.key==='Enter')doSearch()">
                <button class="btn" onclick="doSearch()">Search</button>
            </div>
            <div class="search-filters">
                <select id="filterMake" onchange="updateModels()"><option value="">All Makes</option>${carMakes.map(m => `<option value="${m}">${m}</option>`).join('')}</select>
                <select id="filterModel"><option value="">All Models</option></select>
                <select id="filterCat"><option value="">All Categories</option>${categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select>
                <button class="btn" onclick="doSearch()">Find Parts</button>
            </div>
            <div class="trust-badges">
                <span class="trust-badge">Secure Checkout</span>
                <span class="trust-badge">Money Back Guarantee</span>
                <span class="trust-badge">Instant Download</span>
                <span class="trust-badge">Buyer Protection</span>
            </div>
        </div>

        <div class="categories"><h2>Categories</h2>
            <div class="cat-grid">${categories.map(c => `<a href="#" class="cat-item" onclick="filterCat='${c.name}';go('browse')"><img src="${c.img}" alt="${c.name}"><span>${c.name}</span></a>`).join('')}</div>
        </div>

        <div class="section"><div class="section-head"><h2>Trending Parts</h2><a href="#" onclick="go('browse')">View all</a></div>
            <div class="grid">${trendingParts.map(p => cardHTML(p, true)).join('')}</div>
        </div>

        ${featuredParts.length ? `<div class="section featured-section"><div class="section-head"><h2>Featured Parts</h2><span class="featured-badge">SPONSORED</span></div>
            <div class="grid">${featuredParts.slice(0, 4).map(p => cardHTML(p, false, true)).join('')}</div></div>` : ''}
        
        <div class="section"><div class="section-head"><h2>New Parts</h2><a href="#" onclick="go('browse')">View all</a></div>
            <div class="grid">${parts.slice(0, 8).map(cardHTML).join('')}</div>
        </div>

        <div class="section featured-designers"><div class="section-head"><h2>Top Designers</h2><a href="#" onclick="go('designers')">View all</a></div>
            <div class="designers-preview">${designers.slice(0, 3).map(d => `<div class="designer-mini" onclick="go('designer', ${d.id})"><img src="${d.avatar_url}" alt="${d.name}"><div class="designer-mini-info"><strong>${d.name}</strong><span>${d.bio?.substring(0, 50)}...</span><span class="designer-mini-rate">${d.rate} - ${d.stats?.avgRating || 5} stars</span></div></div>`).join('')}</div>
        </div>

        <div class="stats-bar">
            <div class="stat"><span class="stat-num">${parts.length}+</span><span class="stat-label">Parts Listed</span></div>
            <div class="stat"><span class="stat-num">${designers.length}</span><span class="stat-label">Designers</span></div>
            <div class="stat"><span class="stat-num">${carMakes.length - 1}</span><span class="stat-label">Car Brands</span></div>
            <div class="stat"><span class="stat-num">$5</span><span class="stat-label">Flat Fee</span></div>
        </div>
        <div class="version-tag">v${VERSION}</div>
    `;
}

function browseView() {
    let filtered = parts;
    if (filter) { const q = filter.toLowerCase(); filtered = filtered.filter(p => (p.title||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (p.make||'').toLowerCase().includes(q) || (p.model||'').toLowerCase().includes(q)); }
    if (filterCat) filtered = filtered.filter(p => p.category === filterCat);
    if (filterMake) filtered = filtered.filter(p => p.make === filterMake);
    if (filterModel) filtered = filtered.filter(p => p.model === filterModel);
    const title = filterMake && filterModel ? `${filterMake} ${filterModel}` : filterMake ? filterMake : filterCat ? filterCat : filter ? `"${filter}"` : 'All Parts';
    
    return `<div class="browse">
        <aside class="sidebar">
            <h3>Category</h3><ul><li><a href="#" onclick="filterCat='';go('browse')" class="${!filterCat?'active':''}">All</a></li>${categories.map(c => `<li><a href="#" onclick="filterCat='${c.name}';go('browse')" class="${filterCat===c.name?'active':''}">${c.name}</a></li>`).join('')}</ul>
            <h3>Make</h3><ul><li><a href="#" onclick="filterMake='';filterModel='';go('browse')" class="${!filterMake?'active':''}">All Makes</a></li>${carMakes.map(m => `<li><a href="#" onclick="filterMake='${m}';filterModel='';go('browse')" class="${filterMake===m?'active':''}">${m}</a></li>`).join('')}</ul>
            ${filterMake && carModels[filterMake] ? `<h3>Model</h3><ul><li><a href="#" onclick="filterModel='';go('browse')" class="${!filterModel?'active':''}">All Models</a></li>${carModels[filterMake].map(m => `<li><a href="#" onclick="filterModel='${m}';go('browse')" class="${filterModel===m?'active':''}">${m}</a></li>`).join('')}</ul>` : ''}
            <div class="sidebar-cta"><p>Don't have a printer?</p><a href="#" onclick="go('printshops')" class="btn btn-outline" style="width:100%">Find Print Shop</a></div>
        </aside>
        <div><div class="browse-head"><h1>${title}</h1><span style="color:var(--muted)">${filtered.length} parts</span></div>
            <div class="grid">${filtered.length ? filtered.map(cardHTML).join('') : '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:48px 0;">No parts found.</p>'}</div>
        </div>
    </div>`;
}

function designersView() {
    return `<div class="page-header"><h1>Find a Designer</h1><p>Need a custom part? Work with automotive specialists.</p></div>
        <div class="designer-filters"><button class="filter-btn active">All</button><button class="filter-btn">JDM</button><button class="filter-btn">European</button><button class="filter-btn">American</button><button class="filter-btn">Interior</button></div>
        <div class="designers-grid">${designers.map(d => `<div class="designer" onclick="go('designer', ${d.id})"><div class="designer-top"><img src="${d.avatar_url}" alt="${d.name}"><div><h3>${d.name}</h3><p>${d.bio?.substring(0, 60)}...</p></div></div><div class="designer-stats"><span class="designer-rate">${d.rate}</span><span class="designer-rating">${d.stats?.avgRating || 5} stars (${d.stats?.reviewCount || 0})</span></div><div class="tags">${(d.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}</div><div class="designer-projects">${d.stats?.parts || 0} completed projects</div></div>`).join('')}</div>`;
}

function sellView() {
    if (!currentUser) {
        return `<div class="auth-prompt"><h2>Login Required</h2><p>You need to be logged in to sell parts.</p><a href="#" onclick="go('login')" class="btn btn-primary">Login</a> <a href="#" onclick="go('signup')" class="btn btn-outline">Sign Up</a></div>`;
    }
    
    return `<div class="sell-layout">
        <div class="sell-info"><h1>Sell your car parts</h1><p>Upload your designs, set your price, start earning.</p>
            <div class="steps"><div class="step"><div class="step-num">1</div><div><h4>Upload files</h4><p>3D files + photos</p></div></div><div class="step"><div class="step-num">2</div><div><h4>Pay listing fee</h4><p>One-time $5</p></div></div><div class="step"><div class="step-num">3</div><div><h4>Get paid</h4><p>Keep 100%</p></div></div></div>
            <div class="pricing"><div class="pricing-big">$5</div><div class="pricing-sub">one-time listing fee</div><ul><li>Keep 100% of sales</li><li>No monthly fees</li><li>No commission</li><li>Listing never expires</li></ul></div>
        </div>
        <div class="form"><h2>Create Listing</h2>
            <form onsubmit="handleCreateListing(event)">
            <div class="field"><label>Part Name</label><input type="text" id="partTitle" placeholder="e.g., BMW E30 Phone Mount" required></div>
            <div class="field"><label>Description</label><textarea id="partDesc" rows="4" placeholder="Describe fitment, materials..." required></textarea></div>
            <div class="field-row"><div class="field"><label>Make</label><select id="partMake" required onchange="updatePartModels()">${carMakes.map(m => `<option>${m}</option>`).join('')}</select></div><div class="field"><label>Model</label><select id="partModel"><option>Select model...</option></select></div></div>
            <div class="field-row"><div class="field"><label>Category</label><select id="partCat" required>${categories.map(c => `<option>${c.name}</option>`).join('')}</select></div><div class="field"><label>Price (USD)</label><input type="number" id="partPrice" placeholder="4.99" min="0.99" step="0.01" required></div></div>
            <div class="field-row"><div class="field"><label>File Format</label><input type="text" id="partFormat" placeholder="STL, STEP"></div><div class="field"><label>File Size</label><input type="text" id="partSize" placeholder="2.1 MB"></div></div>
            <div class="field-row"><div class="field"><label>Recommended Material</label><input type="text" id="partMaterial" placeholder="PLA, PETG, ABS"></div><div class="field"><label>Infill %</label><input type="text" id="partInfill" placeholder="25%"></div></div>
            <div class="field"><label>3D File</label><div class="dropzone" onclick="document.getElementById('fileInput').click()"><div class="dropzone-icon">+</div><p id="fileName">Drop 3D file here or click</p><span>STL, STEP, OBJ, 3MF</span></div><input type="file" id="fileInput" hidden onchange="handleFileSelect(event)"></div>
            <div class="field"><label>Photos</label><div class="photo-grid" id="photoGrid"><div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div></div><input type="file" id="photoInput" accept="image/*" multiple hidden onchange="handlePhotoUpload(event)"></div>
            <div class="upsell-box"><label class="upsell-label"><input type="checkbox" id="featuredCheckbox" onchange="updateTotal()"><div class="upsell-content"><span class="upsell-badge">FEATURED</span><strong>Get Featured Placement +$10</strong><p>Your listing appears in the Featured section for 30 days.</p></div></label></div>
            <div class="form-total"><span>Total</span><span id="totalPrice">$5.00</span></div>
            <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Create Listing</button>
            </form>
        </div>
    </div>`;
}

function updatePartModels() {
    const make = document.getElementById('partMake')?.value;
    const modelSelect = document.getElementById('partModel');
    if (!modelSelect || !make) return;
    modelSelect.innerHTML = '<option>Select model...</option>';
    if (carModels[make]) carModels[make].forEach(m => { modelSelect.innerHTML += `<option value="${m}">${m}</option>`; });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) document.getElementById('fileName').textContent = file.name;
}

async function handleCreateListing(e) {
    e.preventDefault();
    
    const listing = {
        title: document.getElementById('partTitle').value,
        description: document.getElementById('partDesc').value,
        make: document.getElementById('partMake').value,
        model: document.getElementById('partModel').value,
        category: document.getElementById('partCat').value,
        price: parseFloat(document.getElementById('partPrice').value),
        file_format: document.getElementById('partFormat').value,
        file_size: document.getElementById('partSize').value,
        material: document.getElementById('partMaterial').value,
        infill: document.getElementById('partInfill').value,
        featured: document.getElementById('featuredCheckbox').checked
    };
    
    try {
        const result = await api('/api/parts', {
            method: 'POST',
            body: JSON.stringify(listing)
        });
        alert('Listing created! (Payment integration with Stripe coming soon)');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function updateTotal() { document.getElementById('totalPrice').textContent = document.getElementById('featuredCheckbox')?.checked ? '$15.00' : '$5.00'; }

async function partView(id) {
    let p = parts.find(x => x.id === id);
    if (!p) {
        try { p = await api(`/api/parts/${id}`); } catch (e) { return '<p>Part not found.</p>'; }
    }
    if (!p) return '<p>Part not found.</p>';
    
    const images = p.images || [p.img] || ['https://via.placeholder.com/600x450'];
    const reviews = p.reviews || [];
    
    return `<div class="detail">
        <div class="detail-gallery">
            <div class="viewer-container" id="viewer3d"><div class="viewer-hint">Drag to rotate - Scroll to zoom</div></div>
            <div class="gallery-thumbs">${images.map((img, i) => `<img src="${img}" alt="${p.title}" class="thumb ${i===0?'active':''}" onclick="openLightbox('${img}')">`).join('')}</div>
        </div>
        <div class="detail-info">
            ${p.featured ? '<span class="detail-featured-badge">Featured</span>' : ''}
            <div class="detail-breadcrumb">${p.make} / ${p.model} / ${p.category}</div>
            <h1>${p.title}</h1>
            <div class="detail-seller"><span class="seller-avatar">${(p.seller_name||'S').charAt(0)}</span><span>by <strong>${p.seller_name || 'Seller'}</strong></span><span class="detail-downloads">${p.downloads || 0} downloads</span></div>
            <div class="detail-price">$${(p.price || 0).toFixed(2)}</div>
            <div class="detail-trust"><span>Secure</span><span>Instant Download</span><span>Money Back</span></div>
            <div class="detail-actions">
                <button class="btn btn-lg btn-primary" onclick="handleBuyPart(${p.id})">Buy Now - $${(p.price || 0).toFixed(2)}</button>
                <a href="mailto:${p.seller_email || ''}" class="btn btn-lg btn-outline">Contact Seller</a>
            </div>
            <div class="print-ship-cta"><div class="print-ship-header"><div><strong>Print & Ship</strong><span>Don't have a printer? We'll print and ship it to you.</span></div></div><div class="print-ship-options"><button class="btn btn-sm" onclick="go('printshops', ${p.id})">Find Local Shop</button><button class="btn btn-sm btn-primary" onclick="alert('Print & Ship coming soon!')">Get Instant Quote</button></div></div>
            <div class="detail-desc"><h2>Description</h2><p>${p.description || ''}</p></div>
            <div class="specs"><h2>Specifications</h2><div class="spec-row"><span>Vehicle</span><span>${p.make} ${p.model}</span></div><div class="spec-row"><span>Category</span><span>${p.category}</span></div><div class="spec-row"><span>Format</span><span>${p.file_format || 'STL'}</span></div><div class="spec-row"><span>File Size</span><span>${p.file_size || 'N/A'}</span></div><div class="spec-row"><span>Material</span><span>${p.material || 'PLA'}</span></div><div class="spec-row"><span>Infill</span><span>${p.infill || '25%'}</span></div></div>
            
            ${reviews.length ? `<div class="reviews-section"><h2>Reviews (${reviews.length})</h2>${reviews.map(r => `<div class="review"><div class="review-header"><strong>${r.reviewer_name}</strong><span class="review-rating">${'*'.repeat(r.rating)} (${r.rating}/5)</span></div><p>${r.comment || ''}</p></div>`).join('')}</div>` : ''}
            
            ${currentUser ? `<div class="write-review"><h3>Write a Review</h3><form onsubmit="handleReview(event, ${p.id})"><div class="field"><label>Rating</label><select id="reviewRating"><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Terrible</option></select></div><div class="field"><label>Comment</label><textarea id="reviewComment" rows="3" placeholder="Share your experience..."></textarea></div><button type="submit" class="btn btn-primary">Submit Review</button></form></div>` : ''}
        </div>
    </div>
    <div class="section"><div class="section-head"><h2>Similar Parts</h2></div><div class="grid">${parts.filter(x => x.id !== p.id && (x.make === p.make || x.category === p.category)).slice(0, 4).map(cardHTML).join('')}</div></div>
    <div id="lightbox" class="lightbox" onclick="closeLightbox()"><button class="lightbox-close" onclick="closeLightbox()">x</button><img id="lightboxImg" src="" alt="Zoomed image"></div>`;
}

async function handleBuyPart(partId) {
    if (!currentUser) { alert('Please login to purchase'); go('login'); return; }
    
    try {
        await api(`/api/parts/${partId}/purchase`, { method: 'POST' });
        alert('Purchase successful! You can now download the file and leave a review. (Stripe integration coming soon)');
        go('part', partId);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function handleReview(e, partId) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;
    
    try {
        await api(`/api/parts/${partId}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment })
        });
        alert('Review submitted!');
        go('part', partId);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function printShopsView(partId) {
    const part = partId ? parts.find(x => x.id === partId) : null;
    return `<div class="page-header"><h1>Find a Print Shop</h1><p>Get your part printed and shipped to you.</p></div>
        ${part ? `<div class="selected-part-banner"><img src="${part.images?.[0] || part.img}" alt="${part.title}"><div class="selected-part-info"><strong>${part.title}</strong><span>${part.make} ${part.model} - ${part.file_format} - ${part.file_size}</span></div></div>` : ''}
        <div class="location-search"><input type="text" id="locationInput" placeholder="Enter your city or zip code..."><button class="btn" onclick="alert('Search coming soon')">Search</button><button class="btn btn-outline" onclick="useMyLocation()">Use My Location</button></div>
        <div class="print-shops-list">${printShops.map(shop => `<div class="print-shop-card ${shop.verified ? 'verified' : ''}"><div class="print-shop-header"><div><h3>${shop.name} ${shop.verified ? '<span class="verified-badge">Verified</span>' : ''}</h3>${shop.instantQuote ? '<span class="instant-badge">Instant Quotes</span>' : ''}${shop.printAndShip ? '<span class="ship-badge">Print & Ship</span>' : ''}</div><span class="print-shop-distance">${shop.distance}</span></div><p class="print-shop-address">${shop.address}</p><div class="print-shop-meta"><span>${shop.rating} stars (${shop.reviews})</span><span>${shop.turnaround}</span></div><div class="print-shop-actions"><a href="tel:${shop.phone}" class="btn btn-sm btn-outline">Call</a>${shop.instantQuote ? `<button class="btn btn-sm btn-primary" onclick="alert('Quote: ~$${(Math.random() * 20 + 10).toFixed(2)}')">Instant Quote</button>` : ''}<a href="mailto:${shop.email}${part ? `?subject=Print: ${part.title}` : ''}" class="btn btn-sm btn-outline">Email</a></div></div>`).join('')}</div>`;
}

async function designerView(id) {
    let d = designers.find(x => x.id === id);
    if (!d) {
        try { d = await api(`/api/users/${id}`); } catch (e) { return '<p>Designer not found.</p>'; }
    }
    if (!d) return '<p>Designer not found.</p>';
    
    return `<div class="designer-profile"><div class="designer-header"><img src="${d.avatar_url}" alt="${d.name}" class="designer-avatar-lg"><div class="designer-header-info"><h1>${d.name}</h1><p class="designer-title">${d.role === 'designer' ? 'Designer' : 'Seller'}</p><div class="designer-meta"><span>${d.stats?.avgRating || 5} stars (${d.stats?.reviewCount || 0} reviews)</span><span>${d.stats?.parts || 0} projects</span></div><div class="tags">${(d.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}</div></div><div class="designer-cta"><div class="designer-rate-lg">${d.rate || 'Contact for rate'}</div><button class="btn btn-lg btn-primary" onclick="document.getElementById('requestForm').scrollIntoView()">Request Quote</button></div></div>
    <div class="designer-body"><div class="designer-about"><h2>About</h2><p>${d.bio || 'No bio yet.'}</p></div>
    <div class="designer-request" id="requestForm"><h2>Request Custom Part</h2><form onsubmit="handleDesignerRequest(event, ${d.id})"><div class="field"><label>Your Name</label><input type="text" id="reqName" required></div><div class="field"><label>Your Email</label><input type="email" id="reqEmail" required></div><div class="field-row"><div class="field"><label>Car Make</label><select id="reqMake">${carMakes.map(m => `<option>${m}</option>`).join('')}</select></div><div class="field"><label>Model</label><input type="text" id="reqModel" placeholder="E30, Miata NA..."></div></div><div class="field"><label>Describe what you need</label><textarea id="reqDesc" rows="4" required placeholder="I need a phone mount that fits..."></textarea></div><div class="field"><label>Budget (optional)</label><input type="text" id="reqBudget" placeholder="$50-100"></div><button type="submit" class="btn btn-primary">Send Request</button></form></div></div></div>`;
}

async function handleDesignerRequest(e, designerId) {
    e.preventDefault();
    const request = {
        name: document.getElementById('reqName').value,
        email: document.getElementById('reqEmail').value,
        make: document.getElementById('reqMake').value,
        model: document.getElementById('reqModel').value,
        description: document.getElementById('reqDesc').value,
        budget: document.getElementById('reqBudget').value
    };
    
    try {
        await api(`/api/designers/${designerId}/request`, {
            method: 'POST',
            body: JSON.stringify(request)
        });
        alert('Request sent! The designer will contact you soon.');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function profileView(id) {
    let user;
    try { user = await api(`/api/users/${id}`); } catch (e) { return '<p>User not found.</p>'; }
    
    return `<div class="profile-page"><div class="profile-header"><div class="profile-avatar">${user.avatar_url ? `<img src="${user.avatar_url}">` : user.name.charAt(0)}</div><div><h1>${user.name}</h1><p>${user.role === 'designer' ? 'Designer' : 'Seller'}</p><p>${user.bio || ''}</p></div></div></div>`;
}

function cardHTML(p, showTrending = false, showFeatured = false) {
    const img = p.images?.[0] || p.img || 'https://via.placeholder.com/600x450';
    return `<div class="card ${showFeatured ? 'card-featured' : ''}" onclick="go('part', ${p.id})"><div class="card-image"><img src="${img}" alt="${p.title}"><span class="card-badge">${p.category}</span>${showTrending ? '<span class="trending-badge">HOT</span>' : ''}${showFeatured || p.featured ? '<span class="featured-badge-card">*</span>' : ''}</div><div class="card-body"><div class="card-title">${p.title}</div><div class="card-meta"><span class="card-cat">${p.make}${p.model && p.model !== 'All' ? ' ' + p.model : ''}</span><span class="card-price">$${(p.price || 0).toFixed(2)}</span></div></div></div>`;
}

function handlePhotoUpload(event) { for (let file of event.target.files) { if (uploadedPhotos.length >= 10) break; const reader = new FileReader(); reader.onload = e => { uploadedPhotos.push(e.target.result); renderPhotoGrid(); }; reader.readAsDataURL(file); } }
function renderPhotoGrid() { const grid = document.getElementById('photoGrid'); if (!grid) return; grid.innerHTML = uploadedPhotos.map((photo, i) => `<div class="photo-item"><img src="${photo}"><button class="photo-remove" onclick="removePhoto(${i})">x</button></div>`).join('') + (uploadedPhotos.length < 10 ? `<div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div>` : ''); }
function removePhoto(index) { uploadedPhotos.splice(index, 1); renderPhotoGrid(); }
function useMyLocation() { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { document.getElementById('locationInput').value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`; }); } }

function initViewer(partId) {
    const container = document.getElementById('viewer3d');
    if (!container || !window.THREE) return;
    const p = parts.find(x => x.id === partId);
    if (!p) return;
    const width = container.clientWidth, height = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);
    
    // Demo geometry
    const geometry = new THREE.BoxGeometry(30, 20, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0x2563eb, shininess: 50 });
    scene.add(new THREE.Mesh(geometry, material));
    
    (function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); })();
}

// Initialize
console.log(`ForgAuto v${VERSION} loaded`);
checkAuth().then(() => render());

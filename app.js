// ForgAuto — 3D Marketplace for Cars
// Version 4.0 - Major Fixes

const VERSION = '7.5';
const API_URL = 'https://forgauto-api.warwideweb.workers.dev'; // Cloudflare Worker API

// v7.4: HTML sanitization to prevent XSS attacks
function sanitize(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// State
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let isAuthChecking = true; // Prevents flash while checking auth

// v7.4: Admin helper
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu && hamburger) {
        menu.classList.toggle('open');
        hamburger.classList.toggle('open');
    }
}

// Check auth on load
async function checkAuth() {
    // Check for OAuth callback token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('token');
    const oauthUser = urlParams.get('user');
    
    if (oauthToken && oauthUser) {
        // Google OAuth callback - save token and fetch fresh user data
        authToken = oauthToken;
        localStorage.setItem('authToken', authToken);
        // Clean URL first
        window.history.replaceState({}, '', window.location.pathname);
        // Fetch fresh user data from API (includes email_verified status)
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                currentUser = data.user;
                updateNavAuth();
                go('dashboard');
                return;
            }
        } catch (e) {
            console.error('Failed to fetch user after OAuth:', e);
        }
    }
    
    if (!authToken) {
        isAuthChecking = false;
        return;
    }
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
    isAuthChecking = false;
}

// Google OAuth login
function loginWithGoogle() {
    window.location.href = `${API_URL}/api/auth/google`;
}

async function updateNavAuth() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        const unreadCount = await getUnreadMessageCount();
        const name = currentUser.name ? currentUser.name.split(' ')[0] : (currentUser.email ? currentUser.email.split('@')[0] : 'Account');
        const avatarUrl = currentUser.avatar_url;
        const initial = name.charAt(0).toUpperCase();
        
        loginBtn.className = 'nav-user-btn';
        // v7.4: Show admin badge
        const adminBadge = isAdmin() ? '<span class="nav-admin-badge">ADMIN</span>' : '';
        loginBtn.innerHTML = `<span class="nav-user-wrap">
            <span class="nav-avatar-container">
                <span class="nav-avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="${name}">` : initial}</span>
                ${unreadCount > 0 ? `<span class="nav-msg-icon" title="${unreadCount} new messages"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><span class="msg-count">${unreadCount > 9 ? '9+' : unreadCount}</span></span>` : ''}
            </span>
            <span class="nav-username">${name}${adminBadge}</span>
        </span>`;
        loginBtn.onclick = () => go('dashboard');
        // Update mobile menu too
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        if (mobileLoginBtn) {
            mobileLoginBtn.textContent = name;
            mobileLoginBtn.onclick = () => { go('dashboard'); toggleMobileMenu(); };
        }
    } else {
        loginBtn.className = 'btn btn-outline';
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => go('login');
        // Update mobile menu too
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        if (mobileLoginBtn) {
            mobileLoginBtn.textContent = 'Login';
            mobileLoginBtn.onclick = () => { go('login'); toggleMobileMenu(); };
        }
    }
}

// Get unread message count for nav badge
async function getUnreadMessageCount() {
    if (!authToken) return 0;
    try {
        // Try dedicated endpoint first, fall back to counting from conversations
        const data = await api('/api/messages/conversations');
        if (data && Array.isArray(data)) {
            // Count total unread from all conversations
            return data.reduce((sum, m) => sum + (m.unread_count || 0), 0);
        }
        return 0;
    } catch (e) {
        return 0;
    }
}

// Refresh nav badge periodically
setInterval(() => {
    if (currentUser) updateNavAuth();
}, 30000); // Every 30 seconds

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
    { name: "Interior", img: "images/categories/interior.jpg?v=2" },
    { name: "Exterior", img: "images/categories/exterior.jpg?v=2" },
    { name: "Gauges", img: "images/categories/gauges.jpg?v=2" },
    { name: "Accessories", img: "images/categories/accessories.jpg?v=2" },
    { name: "Performance", img: "images/categories/performance.jpg?v=2" },
    { name: "Lighting", img: "images/categories/lighting.jpg?v=2" }
];

const carMakes = [
    "Non-Specific",
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", 
    "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo",
    "Daihatsu", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda",
    "Hummer", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Koenigsegg",
    "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati",
    "Mazda", "McLaren", "Mercedes-Benz", "Mercury", "MG", "Mini", "Mitsubishi",
    "Nissan", "Oldsmobile", "Opel", "Pagani", "Peugeot", "Plymouth", "Polestar",
    "Pontiac", "Porsche", "Ram", "Renault", "Rivian", "Rolls-Royce", "Saab",
    "Saturn", "Scion", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla",
    "Toyota", "Triumph", "Vauxhall", "Volkswagen", "Volvo"
];
const carModels = {
    "Non-Specific": ["Any"],
    "Acura": ["Integra", "NSX", "RSX", "TL", "TSX", "MDX", "RDX"],
    "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "R8", "RS3", "RS4", "RS5", "RS6", "RS7", "S3", "S4", "S5", "TT"],
    "BMW": ["E21", "E28", "E30", "E34", "E36", "E38", "E39", "E46", "E60", "E90", "E92", "F30", "F80", "F82", "G20", "G80", "M2", "M3", "M4", "M5", "Z3", "Z4"],
    "Chevrolet": ["Camaro 3rd Gen", "Camaro 4th Gen", "Camaro 5th Gen", "Camaro 6th Gen", "Corvette C3", "Corvette C4", "Corvette C5", "Corvette C6", "Corvette C7", "Corvette C8", "Silverado", "S10", "Impala", "Nova"],
    "Dodge": ["Challenger", "Charger", "Viper", "Dart", "Neon SRT-4", "Ram", "Durango"],
    "Ferrari": ["308", "348", "355", "360", "430", "458", "488", "F40", "F50", "Enzo", "LaFerrari"],
    "Ford": ["Mustang Fox Body", "Mustang SN95", "Mustang S197", "Mustang S550", "Focus RS", "Focus ST", "Fiesta ST", "F-150", "F-250", "Bronco", "GT", "Ranger"],
    "Honda": ["Civic EF", "Civic EG", "Civic EK", "Civic EP3", "Civic FD", "Civic FK8", "Civic FL5", "Accord", "S2000", "Integra", "NSX", "Prelude", "CR-X", "Fit"],
    "Hyundai": ["Genesis Coupe", "Veloster", "Elantra N", "Kona N", "Ioniq 5", "Ioniq 6"],
    "Infiniti": ["G35", "G37", "Q50", "Q60", "FX35", "FX45"],
    "Jeep": ["Wrangler JK", "Wrangler JL", "Cherokee XJ", "Grand Cherokee", "Gladiator"],
    "Lamborghini": ["Countach", "Diablo", "Murcielago", "Gallardo", "Aventador", "Huracan", "Urus"],
    "Lexus": ["IS300", "IS350", "IS-F", "GS300", "GS350", "GS-F", "RC-F", "LC500", "LFA", "SC300", "SC400"],
    "Mazda": ["Miata NA", "Miata NB", "Miata NC", "Miata ND", "RX-7 FC", "RX-7 FD", "RX-8", "Mazda3", "Mazda6", "CX-5", "CX-30"],
    "Mercedes-Benz": ["190E", "W201", "W124", "W140", "W202", "W203", "W204", "W205", "W212", "W213", "C63 AMG", "E63 AMG", "S63 AMG", "SL", "SLK", "AMG GT"],
    "Mitsubishi": ["Evo 4", "Evo 5", "Evo 6", "Evo 7", "Evo 8", "Evo 9", "Evo X", "3000GT", "Eclipse", "Galant VR4"],
    "Nissan": ["240SX S13", "240SX S14", "Silvia S15", "350Z", "370Z", "Z (400Z)", "GTR R32", "GTR R33", "GTR R34", "GTR R35", "300ZX", "Sentra SE-R", "Maxima"],
    "Porsche": ["911 964", "911 993", "911 996", "911 997", "911 991", "911 992", "Cayman 987", "Cayman 981", "Cayman 718", "Boxster", "Cayenne", "Macan", "Panamera", "Taycan"],
    "Subaru": ["Impreza GC", "Impreza GD", "Impreza GR", "Impreza VA", "WRX", "STI", "BRZ", "Forester", "Legacy", "Outback", "Crosstrek"],
    "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Roadster", "Cybertruck"],
    "Toyota": ["Supra MK3", "Supra MK4", "Supra MK5", "AE86", "GR86", "Celica", "MR2 AW11", "MR2 SW20", "MR2 ZZW30", "Camry", "Corolla", "4Runner", "Tacoma", "Tundra", "Land Cruiser", "GR Corolla", "GR Yaris"],
    "Volkswagen": ["Golf MK1", "Golf MK2", "Golf MK3", "Golf MK4", "Golf MK5", "Golf MK6", "Golf MK7", "Golf MK8", "GTI", "R32", "Golf R", "Jetta", "Beetle", "Scirocco", "Corrado"],
    "Volvo": ["240", "740", "850", "S40", "S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"]
};

// Demo data (fallback)
const demoParts = [
    { id: 1, title: "Tesla-Style Phone Mount", category: "Interior", make: "Universal", model: "All", price: 3.99, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop"], seller_name: "AutoParts3D", seller_email: "auto@example.com", description: "Minimalist phone mount for car vents with ball joint design.", file_format: "STL, STEP", file_size: "1.8 MB", material: "PLA", infill: "25%", downloads: 567, featured: 1, premiered: 1 },
    { id: 2, title: "BMW E30 Phone Dock", category: "Interior", make: "BMW", model: "E30", price: 5.99, images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=450&fit=crop"], seller_name: "BimmerParts", seller_email: "bmw@example.com", description: "Custom phone dock for BMW E30 center console.", file_format: "STL", file_size: "2.1 MB", material: "PETG", infill: "30%", downloads: 312, premiered: 1 },
    { id: 3, title: "Toyota Supra MK4 Gauge Pod", category: "Gauges", make: "Toyota", model: "Supra MK4", price: 8.99, images: ["https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&h=450&fit=crop"], seller_name: "JDMParts3D", seller_email: "jdm@example.com", description: "52mm gauge pod for MK4 Supra center vent.", file_format: "STL, STEP", file_size: "3.4 MB", material: "ABS", infill: "40%", downloads: 523, featured: 1, premiered: 1 },
    { id: 4, title: "Honda Civic EG Cup Holder", category: "Interior", make: "Honda", model: "Civic EG", price: 4.49, images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=450&fit=crop"], seller_name: "HondaHacks", seller_email: "honda@example.com", description: "Dual cup holder insert for Civic EG.", file_format: "STL", file_size: "1.6 MB", material: "PLA", infill: "25%", downloads: 445, premiered: 1 },
    { id: 5, title: "Mazda Miata NA Phone Mount", category: "Interior", make: "Mazda", model: "Miata NA", price: 6.99, images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=450&fit=crop"], seller_name: "MiataMods", seller_email: "miata@example.com", description: "Low-profile phone mount for NA Miata.", file_format: "STL", file_size: "1.9 MB", material: "PETG", infill: "30%", downloads: 678 },
    { id: 6, title: "BMW E46 Coin Delete", category: "Interior", make: "BMW", model: "E46", price: 3.49, images: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=450&fit=crop"], seller_name: "BimmerParts", seller_email: "bmw@example.com", description: "Clean delete panel for E46 coin holder.", file_format: "STL", file_size: "0.8 MB", material: "PLA", infill: "20%", downloads: 234 },
    { id: 7, title: "Nissan 350Z Triple Gauge Pod", category: "Gauges", make: "Nissan", model: "350Z", price: 12.99, images: ["https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&h=450&fit=crop"], seller_name: "ZCarParts", seller_email: "zcar@example.com", description: "A-pillar triple gauge pod for 350Z.", file_format: "STL, STEP", file_size: "4.8 MB", material: "ABS", infill: "35%", downloads: 389 },
    { id: 8, title: "Subaru WRX Shift Surround", category: "Interior", make: "Subaru", model: "WRX", price: 4.99, images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=450&fit=crop"], seller_name: "SubieParts", seller_email: "subie@example.com", description: "Custom shift boot surround for GD WRX.", file_format: "STL", file_size: "1.4 MB", material: "PETG", infill: "25%", downloads: 456 }
];

// v7.4: Removed fake demo data - show empty states instead
const demoDesigners = [];
const printShops = [];

let view = 'home', filter = '', filterCat = '', filterMake = '', filterModel = '', filterSort = 'newest', uploadedPhotos = [], uploadedPhotoFiles = [], uploadedFile = null;
// v6.3: Start with empty array, no demo parts
let parts = [];
let designers = demoDesigners;

// Load data from API
// FIX 6: Only use demo parts if there are ZERO real parts
async function loadParts() {
    try {
        const params = new URLSearchParams();
        if (filterCat) params.set('category', filterCat);
        if (filterMake) params.set('make', filterMake);
        if (filterModel) params.set('model', filterModel);
        if (filter) params.set('search', filter);
        
        const data = await api(`/api/parts?${params}`);
        // v6.3: NO MORE DEMO PARTS - only show real parts from API
        parts = data || [];
        console.log(`Loaded ${parts.length} parts from API`);
    } catch (e) {
        // v6.3: On API error, show empty instead of fake demo data
        console.error('Failed to load parts:', e);
        parts = [];
    }
}

async function loadDesigners() {
    try {
        const data = await api('/api/designers');
        // v7.4: No more fake demo data - show empty state instead
        designers = data || [];
    } catch (e) {
        designers = [];
    }
}

function go(v, data, skipHistory = false) { 
    view = v; 
    if (!skipHistory) {
        const url = data ? `#${v}/${data}` : `#${v}`;
        history.pushState({ view: v, data: data }, '', url);
    }
    render(data); 
    window.scrollTo(0, 0);
    updatePageTitle(v, data);
}

// v7.4: Dynamic page titles for SEO
function updatePageTitle(v, data) {
    const titles = {
        home: 'ForgAuto — 3D Parts for Cars',
        browse: 'Browse 3D Car Parts — ForgAuto',
        designers: 'Hire a 3D Designer — ForgAuto',
        printshops: 'Find Print Shops — ForgAuto',
        sell: 'Sell Your Parts — ForgAuto',
        login: 'Login — ForgAuto',
        signup: 'Sign Up — ForgAuto',
        dashboard: 'Dashboard — ForgAuto',
        'become-designer': 'Become a Designer — ForgAuto'
    };
    document.title = titles[v] || 'ForgAuto — 3D Parts for Cars';
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state) {
        go(e.state.view, e.state.data, true);
    } else {
        // Parse URL hash if no state
        const hash = window.location.hash.slice(1);
        if (hash) {
            const [v, d] = hash.split('/');
            go(v || 'home', d ? parseInt(d) : null, true);
        } else {
            go('home', null, true);
        }
    }
});

// Handle initial page load from URL hash
function initFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const [v, d] = hash.split('/');
        view = v || 'home';
        return d ? parseInt(d) : null;
    }
    return null;
}
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
    const main = app.parentElement;
    
    // v7.2: Handle full-width browse page
    if (view === 'browse') {
        main.classList.add('browse-fullwidth-active');
    } else {
        main.classList.remove('browse-fullwidth-active');
    }
    
    // v6.2: Clear content and show loading for views that fetch data (fixes cache glitch)
    if (view === 'home' || view === 'browse') {
        app.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div></div>';
    }
    
    // v7.3: Handle sticky buy bar for product pages
    const existingStickyBar = document.getElementById('mobileStickyBuy');
    if (existingStickyBar) existingStickyBar.remove();
    document.body.classList.remove('product-page');
    
    if (view === 'home') { await loadParts(); app.innerHTML = homeView(); }
    else if (view === 'browse') { await loadParts(); app.innerHTML = browseView(); }
    else if (view === 'designers') { await loadDesigners(); app.innerHTML = designersView(); }
    else if (view === 'sell') app.innerHTML = sellView();
    else if (view === 'edit') app.innerHTML = await editView(data);
    else if (view === 'part') { 
        app.innerHTML = await partView(data); 
        initViewer(data);
        // v7.3: Add sticky buy bar for mobile
        document.body.classList.add('product-page');
        addMobileStickyBuyBar(data);
    }
    else if (view === 'designer') app.innerHTML = await designerView(data);
    else if (view === 'become-designer') app.innerHTML = await becomeDesignerView();
    else if (view === 'printshops') app.innerHTML = await printShopsView(data);
    else if (view === 'login') app.innerHTML = loginView();
    else if (view === 'signup') app.innerHTML = signupView();
    else if (view === 'forgot-password') app.innerHTML = forgotPasswordView();
    else if (view === 'dashboard') app.innerHTML = await dashboardView();
    else if (view === 'conversation') app.innerHTML = await conversationView(data);
    else if (view === 'profile') app.innerHTML = await profileView(data);
    else if (view === 'verify') app.innerHTML = await verifyEmailView(data);
}

// v7.4: Email verification view
async function verifyEmailView(token) {
    if (!token) {
        return '<div class="auth-container"><div class="auth-box"><h1>Invalid Link</h1><p>This verification link is invalid.</p></div></div>';
    }
    
    try {
        const result = await api(`/api/auth/verify/${token}`);
        // Refresh user data if logged in
        if (authToken) {
            await checkAuth();
        }
        return `<div class="auth-container"><div class="auth-box">
            <div style="text-align:center;font-size:48px;margin-bottom:16px;">✅</div>
            <h1>Email Verified!</h1>
            <p>Your email has been verified successfully. You now have full access to ForgAuto.</p>
            <a href="#" onclick="go('dashboard'); return false;" class="btn btn-primary" style="width:100%;margin-top:16px;">Go to Dashboard</a>
        </div></div>`;
    } catch (e) {
        return `<div class="auth-container"><div class="auth-box">
            <div style="text-align:center;font-size:48px;margin-bottom:16px;">❌</div>
            <h1>Verification Failed</h1>
            <p>${e.message || 'This link may have expired. Please request a new verification email.'}</p>
            ${currentUser ? `<button onclick="resendVerification()" class="btn btn-primary" style="width:100%;margin-top:16px;">Resend Verification</button>` : `<a href="#" onclick="go('login'); return false;" class="btn btn-primary" style="width:100%;margin-top:16px;">Login</a>`}
        </div></div>`;
    }
}

// v7.4: Resend verification email
async function resendVerification() {
    try {
        await api('/api/auth/resend-verification', { method: 'POST' });
        alert('Verification email sent! Check your inbox.');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

// v7.3: Mobile sticky buy bar
async function addMobileStickyBuyBar(partId) {
    let p = null;
    try { 
        p = await api(`/api/parts/${partId}`); 
    } catch (e) { 
        p = parts.find(x => x.id === partId);
    }
    if (!p) return;
    
    const isPurchased = p.purchased || (currentUser && currentUser.id === p.user_id);
    
    const stickyBar = document.createElement('div');
    stickyBar.id = 'mobileStickyBuy';
    stickyBar.className = 'mobile-sticky-buy';
    stickyBar.innerHTML = isPurchased ? `
        <span class="sticky-price">Owned</span>
        <button class="sticky-btn sticky-btn-primary" onclick="location.href='${p.file_url}'">Download</button>
    ` : `
        <span class="sticky-price">$${(p.price || 0).toFixed(2)}</span>
        <button class="sticky-btn sticky-btn-primary" onclick="handleBuyPart(${p.id})">Buy Now</button>
    `;
    document.body.appendChild(stickyBar);
}

function openLightbox(src) { document.getElementById('lightbox').classList.add('active'); document.getElementById('lightboxImg').src = src; }
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); }

// v7.4: Report modal
function openReportModal(targetType, targetId) {
    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box report-modal">
            <button class="modal-close" onclick="closeReportModal()">×</button>
            <h2>Report ${targetType === 'part' ? 'Listing' : targetType === 'designer' ? 'Designer' : 'Print Shop'}</h2>
            <p style="color:var(--muted);margin-bottom:16px;">Help us keep ForgAuto safe. Select a reason below.</p>
            <form onsubmit="submitReport(event, '${targetType}', ${targetId})">
                <div class="field">
                    <label>Reason</label>
                    <select id="reportReason" required>
                        <option value="">Select a reason...</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="copyright">Copyright infringement</option>
                        <option value="fake">Fake/misleading listing</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="field">
                    <label>Details (optional)</label>
                    <textarea id="reportDetails" rows="3" placeholder="Provide any additional details..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Submit Report</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.remove();
}

async function submitReport(e, targetType, targetId) {
    e.preventDefault();
    const reason = document.getElementById('reportReason').value;
    const details = document.getElementById('reportDetails').value;
    
    try {
        await api('/api/report', {
            method: 'POST',
            body: JSON.stringify({ target_type: targetType, target_id: targetId, reason, details })
        });
        closeReportModal();
        alert('Report submitted. Thank you for helping keep ForgAuto safe.');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ========== AUTH VIEWS ==========

function loginView() {
    // Redirect if already logged in
    if (currentUser) {
        setTimeout(() => go('dashboard'), 0);
        return `<div class="auth-container"><div class="auth-box"><p>Redirecting to dashboard...</p></div></div>`;
    }
    
    return `<div class="auth-container">
        <div class="auth-box">
            <h1>Login</h1>
            <p>Welcome back to ForgAuto</p>
            
            <button onclick="loginWithGoogle()" class="btn btn-google" style="width:100%; margin-bottom:20px; background:#4285f4; color:white; display:flex; align-items:center; justify-content:center; gap:10px;">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
            </button>
            
            <div style="text-align:center; margin:15px 0; color:#666;">or login with email</div>
            
            <form onsubmit="handleLogin(event)">
                <div class="field"><label>Email</label><input type="email" id="loginEmail" required></div>
                <div class="field"><label>Password</label><input type="password" id="loginPassword" required></div>
                <div id="loginError" class="error-msg"></div>
                <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Login</button>
            </form>
            <p class="auth-switch">Don't have an account? <a href="#" onclick="go('signup'); return false;">Sign up</a></p>
            <p class="auth-switch"><a href="#" onclick="go('forgot-password'); return false;">Forgot your password?</a></p>
        </div>
    </div>`;
}

function forgotPasswordView() {
    return `<div class="auth-container">
        <div class="auth-box">
            <h1>Reset Password</h1>
            <p>Enter your email to receive a reset link</p>
            
            <form onsubmit="handleForgotPassword(event)">
                <div class="field"><label>Email</label><input type="email" id="forgotEmail" required></div>
                <div id="forgotMessage" class="success-msg" style="display:none"></div>
                <div id="forgotError" class="error-msg"></div>
                <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Send Reset Link</button>
            </form>
            <p class="auth-switch"><a href="#" onclick="go('login'); return false;">← Back to Login</a></p>
        </div>
    </div>`;
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    
    try {
        const data = await api('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        document.getElementById('forgotMessage').style.display = 'block';
        document.getElementById('forgotMessage').textContent = data.message;
        document.getElementById('forgotError').textContent = '';
    } catch (err) {
        document.getElementById('forgotError').textContent = err.message;
    }
}

async function conversationView(userId) {
    if (!currentUser) return loginView();
    
    let conversation = { user: null, messages: [] };
    try {
        conversation = await api(`/api/messages/${userId}`);
    } catch (e) {
        return '<p class="error">Could not load conversation.</p>';
    }
    
    const otherUser = conversation.user || { name: 'User', avatar_url: null };
    const messages = conversation.messages || [];
    
    // Group messages by part_id
    const messagesByPart = {};
    const noPart = [];
    messages.forEach(m => {
        if (m.part_id) {
            if (!messagesByPart[m.part_id]) {
                messagesByPart[m.part_id] = { part_title: m.part_title, part_image: m.part_image, messages: [] };
            }
            messagesByPart[m.part_id].messages.push(m);
        } else {
            noPart.push(m);
        }
    });
    
    // Render grouped messages
    let messagesHTML = '';
    
    // Messages grouped by part
    Object.entries(messagesByPart).forEach(([partId, data]) => {
        messagesHTML += `
            <div class="message-part-group">
                <div class="message-part-header" onclick="go('part', ${partId})">
                    ${data.part_image ? `<img src="${data.part_image}" alt="">` : ''}
                    <span>Re: ${data.part_title || 'Part #' + partId}</span>
                </div>
                ${data.messages.map(m => `
                    <div class="message ${m.sender_id === currentUser.id ? 'message-sent' : 'message-received'}">
                        <div class="message-content">${sanitize(m.content)}</div>
                        <div class="message-time">${new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    // General messages (no part)
    if (noPart.length) {
        messagesHTML += noPart.map(m => `
            <div class="message ${m.sender_id === currentUser.id ? 'message-sent' : 'message-received'}">
                <div class="message-content">${sanitize(m.content)}</div>
                <div class="message-time">${new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `).join('');
    }
    
    if (!messagesHTML) messagesHTML = '<p class="empty-state">No messages yet. Start the conversation!</p>';
    
    return `<div class="conversation-page">
        <div class="conversation-header">
            <a href="#" onclick="go('dashboard'); return false;" class="back-btn">← Back</a>
            <div class="conversation-user">
                <div class="user-avatar-sm">${otherUser.avatar_url ? `<img src="${otherUser.avatar_url}">` : otherUser.name.charAt(0)}</div>
                <strong>${otherUser.name}</strong>
            </div>
        </div>
        
        <div class="messages-container" id="messagesContainer">
            ${messagesHTML}
        </div>
        
        <form class="message-form" onsubmit="sendMessage(event, ${userId})">
            <input type="text" id="messageInput" placeholder="Type a message..." autocomplete="off" required>
            <button type="submit" class="btn btn-primary">Send</button>
        </form>
    </div>`;
}

async function sendMessage(e, recipientId) {
    e.preventDefault();
    const content = document.getElementById('messageInput').value.trim();
    if (!content) return;
    
    try {
        await api('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ recipient_id: recipientId, content })
        });
        document.getElementById('messageInput').value = '';
        // Refresh conversation
        go('conversation', recipientId);
    } catch (err) {
        alert('Error sending message: ' + err.message);
    }
}

function signupView() {
    // Redirect if already logged in
    if (currentUser) {
        setTimeout(() => go('dashboard'), 0);
        return `<div class="auth-container"><div class="auth-box"><p>Redirecting to dashboard...</p></div></div>`;
    }
    
    return `<div class="auth-container">
        <div class="auth-box auth-box-wide">
            <h1>Create Account</h1>
            <p>Join ForgAuto — choose how you want to participate</p>
            
            <div class="role-selector" id="roleSelector">
                <div class="role-card" onclick="selectSignupRole('seller')">
                    <div class="role-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
                    <h3>Buyer / Seller</h3>
                    <p>Buy parts or sell your 3D designs</p>
                    <ul class="role-features">
                        <li>Browse & purchase parts</li>
                        <li>Sell designs for $10/listing</li>
                        <li>Keep 100% of sales</li>
                    </ul>
                    <span class="role-price">Free</span>
                </div>
                <div class="role-card" onclick="selectSignupRole('designer')">
                    <div class="role-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg></div>
                    <h3>Designer</h3>
                    <p>Offer custom design services</p>
                    <ul class="role-features">
                        <li>All Seller features +</li>
                        <li>Public designer profile</li>
                        <li>Accept custom commissions</li>
                    </ul>
                    <span class="role-price">Free (5+ builds required)</span>
                </div>
                <div class="role-card" onclick="selectSignupRole('printshop')">
                    <div class="role-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></div>
                    <h3>Print Shop</h3>
                    <p>Offer printing services to buyers</p>
                    <ul class="role-features">
                        <li>Listed in Print Shop directory</li>
                        <li>Receive quote requests</li>
                        <li>Build reviews & reputation</li>
                    </ul>
                    <span class="role-price">$100 registration</span>
                </div>
            </div>
            
            <div id="signupFormContainer" style="display:none;">
                <button type="button" class="btn btn-outline btn-sm" onclick="showRoleSelector()" style="margin-bottom:16px;">← Back to options</button>
                
                <div id="selectedRoleLabel" class="selected-role-label"></div>
                
                <button onclick="loginWithGoogle()" class="btn btn-google" style="width:100%; margin-bottom:20px; background:#4285f4; color:white; display:flex; align-items:center; justify-content:center; gap:10px;">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                </button>
                
                <div style="text-align:center; margin:15px 0; color:#666;">— or sign up with email —</div>
                
                <form onsubmit="handleSignup(event)">
                    <input type="hidden" id="signupRole" value="seller">
                    
                    <!-- Regular signup fields -->
                    <div id="regularSignupFields">
                        <div class="field"><label>Name</label><input type="text" id="signupName" required></div>
                        <div class="field"><label>Email</label><input type="email" id="signupEmail" required></div>
                        <div class="field"><label>Password</label><input type="password" id="signupPassword" required minlength="6"></div>
                    </div>
                    
                    <!-- Print Shop additional fields -->
                    <div id="printshopSignupFields" style="display:none;">
                        <hr style="margin:20px 0; border:none; border-top:1px solid var(--border);">
                        <h3 style="margin-bottom:16px;">Print Shop Details</h3>
                        <div class="field"><label>Shop Name *</label><input type="text" id="shopName" placeholder="Your Business Name"></div>
                        <div class="field"><label>Contact Person *</label><input type="text" id="shopContact" placeholder="Primary Contact Name"></div>
                        <div class="field"><label>Phone *</label><input type="tel" id="shopPhone" placeholder="+1 555 123 4567"></div>
                        <div class="field"><label>Website</label><input type="url" id="shopWebsite" placeholder="https://yourshop.com"></div>
                        <div class="field-row">
                            <div class="field"><label>Country *</label><input type="text" id="shopCountry" placeholder="United States, Thailand, etc."></div>
                            <div class="field"><label>State/Province</label><input type="text" id="shopState" placeholder="California, Bangkok, etc."></div>
                        </div>
                        <div class="field-row">
                            <div class="field"><label>City *</label><input type="text" id="shopCity" placeholder="Los Angeles"></div>
                            <div class="field"><label>Street Address</label><input type="text" id="shopAddress" placeholder="123 Main St"></div>
                        </div>
                        <div class="field"><label>Description *</label><textarea id="shopDescription" rows="3" placeholder="Tell customers about your shop, equipment, specialties..."></textarea></div>
                        
                        <div class="field">
                            <label>Printing Technologies (select all that apply)</label>
                            <div class="checkbox-grid">
                                <label class="checkbox-item"><input type="checkbox" id="techFDM" checked> FDM</label>
                                <label class="checkbox-item"><input type="checkbox" id="techSLA"> SLA/Resin</label>
                                <label class="checkbox-item"><input type="checkbox" id="techSLS"> SLS</label>
                                <label class="checkbox-item"><input type="checkbox" id="techMJF"> MJF</label>
                                <label class="checkbox-item"><input type="checkbox" id="techMetal"> Metal</label>
                                <label class="checkbox-item"><input type="checkbox" id="techOther"> Other</label>
                            </div>
                        </div>
                        
                        <div class="field">
                            <label>Services Offered</label>
                            <div class="checkbox-grid">
                                <label class="checkbox-item"><input type="checkbox" id="svcInstantQuote"> Instant Quotes</label>
                                <label class="checkbox-item"><input type="checkbox" id="svcPrintShip" checked> Print & Ship</label>
                                <label class="checkbox-item"><input type="checkbox" id="svcLocalPickup"> Local Pickup</label>
                                <label class="checkbox-item"><input type="checkbox" id="svcRush"> Rush Orders</label>
                            </div>
                        </div>
                        
                        <div class="field-row">
                            <div class="field"><label>Max Build Size (mm)</label><input type="text" id="shopBuildSize" placeholder="300x300x400"></div>
                            <div class="field"><label>Typical Turnaround</label><input type="text" id="shopTurnaround" placeholder="2-3 days"></div>
                        </div>
                        
                        <div class="printshop-fee-notice">
                            <span class="fee-icon">$</span>
                            <div>
                                <strong>Registration Fee: $100</strong>
                                <p>One-time fee to list your shop. Get verified after 5 reviews.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="signupError" class="error-msg"></div>
                    <button type="submit" class="btn btn-lg btn-primary" style="width:100%" id="signupSubmitBtn">Create Account</button>
                </form>
                <p class="auth-switch">Already have an account? <a href="#" onclick="go('login'); return false;">Login</a></p>
            </div>
        </div>
    </div>`;
}

// Role selector functions
let selectedSignupRole = 'seller';

function selectSignupRole(role) {
    selectedSignupRole = role;
    document.getElementById('signupRole').value = role;
    document.getElementById('roleSelector').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
    
    // Update label
    const labels = {
        seller: 'Buyer / Seller Account',
        designer: 'Designer Account',
        printshop: 'Print Shop Account'
    };
    document.getElementById('selectedRoleLabel').textContent = labels[role];
    
    // Show/hide print shop fields
    const printshopFields = document.getElementById('printshopSignupFields');
    const submitBtn = document.getElementById('signupSubmitBtn');
    
    if (role === 'printshop') {
        printshopFields.style.display = 'block';
        submitBtn.textContent = 'Register Print Shop — $100';
        // Make print shop fields required
        document.getElementById('shopName').required = true;
        document.getElementById('shopContact').required = true;
        document.getElementById('shopPhone').required = true;
        document.getElementById('shopCountry').required = true;
        document.getElementById('shopCity').required = true;
        document.getElementById('shopDescription').required = true;
    } else {
        printshopFields.style.display = 'none';
        submitBtn.textContent = 'Create Account';
        // Remove required from print shop fields
        document.getElementById('shopName').required = false;
        document.getElementById('shopContact').required = false;
        document.getElementById('shopPhone').required = false;
        document.getElementById('shopCountry').required = false;
        document.getElementById('shopCity').required = false;
        document.getElementById('shopDescription').required = false;
    }
}

function showRoleSelector() {
    document.getElementById('roleSelector').style.display = 'grid';
    document.getElementById('signupFormContainer').style.display = 'none';
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
    
    // Build signup data
    let signupData = { name, email, password, role };
    
    // Add print shop data if registering as print shop
    if (role === 'printshop') {
        // Collect technologies
        const technologies = [];
        if (document.getElementById('techFDM').checked) technologies.push('FDM');
        if (document.getElementById('techSLA').checked) technologies.push('SLA');
        if (document.getElementById('techSLS').checked) technologies.push('SLS');
        if (document.getElementById('techMJF').checked) technologies.push('MJF');
        if (document.getElementById('techMetal').checked) technologies.push('Metal');
        if (document.getElementById('techOther').checked) technologies.push('Other');
        
        // Collect services
        const services = [];
        if (document.getElementById('svcInstantQuote').checked) services.push('Instant Quote');
        if (document.getElementById('svcPrintShip').checked) services.push('Print & Ship');
        if (document.getElementById('svcLocalPickup').checked) services.push('Local Pickup');
        if (document.getElementById('svcRush').checked) services.push('Rush Orders');
        
        signupData.printshop = {
            shop_name: document.getElementById('shopName').value,
            contact_name: document.getElementById('shopContact').value,
            phone: document.getElementById('shopPhone').value,
            website: document.getElementById('shopWebsite').value,
            country: document.getElementById('shopCountry').value,
            state: document.getElementById('shopState').value,
            city: document.getElementById('shopCity').value,
            address: document.getElementById('shopAddress').value,
            description: document.getElementById('shopDescription').value,
            technologies: technologies,
            services: services,
            build_size: document.getElementById('shopBuildSize').value,
            turnaround: document.getElementById('shopTurnaround').value
        };
    }
    
    try {
        const data = await api('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(signupData)
        });
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user;
        updateNavAuth();
        
        // Show payment notice for print shops
        if (role === 'printshop') {
            alert('Print Shop registered! Note: $100 registration fee will be collected via Stripe (coming soon). Your shop is now listed.');
        }
        
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
    // Show loading while checking auth
    if (isAuthChecking) {
        return `<div class="loading-state"><div class="loading-spinner"></div><p style="margin-top:16px;color:#666;">Loading...</p></div>`;
    }
    
    // Redirect to login if not authenticated
    if (!currentUser) {
        setTimeout(() => go('login'), 0);
        return `<div class="loading-state"><p>Redirecting to login...</p></div>`;
    }
    
    let myParts = [], mySales = [], myPurchases = [], myMessages = [], unreadCount = 0;
    try {
        myParts = await api('/api/parts?user=' + currentUser.id);
    } catch (e) { myParts = []; }
    try {
        mySales = await api('/api/sales');
    } catch (e) { mySales = []; }
    try {
        myPurchases = await api('/api/purchases');
    } catch (e) { myPurchases = []; }
    try {
        myMessages = await api('/api/messages');
    } catch (e) { myMessages = []; }
    try {
        const unreadData = await api('/api/messages/unread');
        unreadCount = unreadData.unread || 0;
    } catch (e) { unreadCount = 0; }
    
    // Get print shop quote requests if user is a print shop
    let quoteRequests = [];
    if (currentUser.role === 'printshop') {
        try {
            quoteRequests = await api('/api/quotes/received');
        } catch (e) { quoteRequests = []; }
    }
    
    // Get user's sent quote requests (for regular users)
    let myQuotes = [];
    if (currentUser.role !== 'printshop') {
        try {
            myQuotes = await api('/api/quotes/sent');
        } catch (e) { myQuotes = []; }
    }
    
    const roleLabels = { seller: 'Seller', designer: 'Designer', printshop: 'Print Shop' };
    
    // v7.5: Skip email verification for Google OAuth users (they're already verified by Google)
    // Only show banner if: not verified AND no Google ID (signed up with email/password)
    const needsVerification = false; // Disabled for now - all users are auto-verified via Google OAuth
    
    // v7.5: Get Stripe connection status
    let stripeStatus = { has_account: false, is_onboarded: false };
    try {
        stripeStatus = await getStripeStatus();
    } catch (e) { }
    
    return `<div class="dashboard">
        ${needsVerification ? `
        <div class="verification-banner">
            <span>📧 Please verify your email to create listings and make purchases.</span>
            <button onclick="resendVerification()" class="btn btn-sm">Resend Email</button>
        </div>
        ` : ''}
        
        ${!stripeStatus.is_onboarded ? `
        <div class="stripe-banner ${stripeStatus.has_account ? 'stripe-pending' : 'stripe-not-connected'}">
            <div class="stripe-banner-content">
                <span class="stripe-icon">💳</span>
                <div class="stripe-text">
                    <strong>${stripeStatus.has_account ? 'Complete Stripe Setup' : 'Connect Stripe to Get Paid'}</strong>
                    <span>${stripeStatus.has_account ? 'Finish setting up your Stripe account to receive payments.' : 'Connect your Stripe account to receive payments when buyers purchase your parts.'}</span>
                </div>
            </div>
            <button onclick="connectStripeAccount()" class="btn btn-stripe">${stripeStatus.has_account ? 'Continue Setup' : 'Connect Stripe'}</button>
        </div>
        ` : `
        <div class="stripe-banner stripe-connected">
            <div class="stripe-banner-content">
                <span class="stripe-icon">✅</span>
                <div class="stripe-text">
                    <strong>Stripe Connected</strong>
                    <span>You're all set to receive payments!</span>
                </div>
            </div>
            <button onclick="openStripeDashboard()" class="btn btn-outline">View Dashboard</button>
        </div>
        `}
        
        <div class="dashboard-header">
            <div class="dashboard-user">
                <div class="user-avatar">${currentUser.avatar_url ? `<img src="${currentUser.avatar_url}">` : (currentUser.printshop?.shop_name || currentUser.name).charAt(0)}</div>
                <div>
                    <h1>${currentUser.role === 'printshop' ? (currentUser.printshop?.shop_name || currentUser.name) : currentUser.name}</h1>
                    <span class="user-role">${roleLabels[currentUser.role] || 'Seller'}</span>
                </div>
            </div>
            <div class="dashboard-actions">
                ${isAdmin() ? `<a href="admin.html" class="btn btn-admin">🛡️ Admin Panel</a>` : ''}
                ${currentUser.role !== 'printshop' ? `<a href="#sell" onclick="go('sell'); return false;" class="btn btn-primary">+ New Listing</a>` : ''}
                <button onclick="handleLogout()" class="btn btn-outline">Logout</button>
            </div>
        </div>
        
        <div class="dashboard-nav">
            ${currentUser.role === 'printshop' ? `
                <button class="dash-tab active" onclick="showDashTab('quotes')">Quote Requests ${quoteRequests.filter(q => q.status === 'pending').length > 0 ? `<span class="badge-unread">${quoteRequests.filter(q => q.status === 'pending').length}</span>` : ''}</button>
                <button class="dash-tab" onclick="showDashTab('shopProfile')">Shop Profile</button>
                <button class="dash-tab" onclick="showDashTab('messages')">Messages ${unreadCount > 0 ? `<span class="badge-unread">${unreadCount}</span>` : ''}</button>
                <button class="dash-tab" onclick="showDashTab('settings')">Settings</button>
            ` : `
                <button class="dash-tab active" onclick="showDashTab('listings')">My Listings</button>
                <button class="dash-tab" onclick="showDashTab('myQuotes')">My Quotes ${myQuotes.filter(q => q.status === 'quoted').length > 0 ? `<span class="badge-unread">${myQuotes.filter(q => q.status === 'quoted').length}</span>` : ''}</button>
                <button class="dash-tab" onclick="showDashTab('messages')">Messages ${unreadCount > 0 ? `<span class="badge-unread">${unreadCount}</span>` : ''}</button>
                <button class="dash-tab" onclick="showDashTab('sales')">Sales</button>
                <button class="dash-tab" onclick="showDashTab('purchases')">Purchases</button>
                <button class="dash-tab" onclick="showDashTab('reviews')">My Reviews</button>
                ${currentUser.role === 'designer' ? `<button class="dash-tab" onclick="showDashTab('designer')">Designer Profile</button>` : ''}
                <button class="dash-tab" onclick="showDashTab('settings')">Settings</button>
            `}
        </div>
        
        <div id="dashListings" class="dash-content">
            <h2>My Listings (${myParts.length})</h2>
            ${myParts.length ? `<div class="grid">${myParts.map(p => sellerCardHTML(p)).join('')}</div>` : '<p class="empty-state">No listings yet. <a href="#" onclick="go(\'sell\'); return false;">Create your first listing</a></p>'}
        </div>
        
        <div id="dashMyQuotes" class="dash-content" style="display:none">
            <h2>My Print Quotes</h2>
            ${myQuotes.length ? `
                <div class="my-quotes-list">
                    ${myQuotes.map(q => `
                        <div class="my-quote-card ${q.status}">
                            <div class="my-quote-header">
                                <div class="my-quote-part">
                                    ${q.part_image ? `<img src="${q.part_image}" alt="${q.part_title}">` : '<div class="quote-part-placeholder">3D</div>'}
                                    <div>
                                        <strong>${q.part_title || 'Part'}</strong>
                                        <span>Sent to: ${q.shop_name}</span>
                                    </div>
                                </div>
                                <span class="my-quote-status ${q.status}">${q.status === 'pending' ? 'Awaiting Response' : q.status === 'quoted' ? 'Quote Received' : q.status === 'declined' ? 'Declined' : q.status}</span>
                            </div>
                            
                            ${q.status === 'quoted' ? `
                                <div class="my-quote-response">
                                    <div class="quote-price-display">
                                        <span class="quote-label">Quoted Price (Print Service):</span>
                                        <span class="quote-price-value">$${(q.quoted_price || 0).toFixed(2)}</span>
                                    </div>
                                    ${q.quoted_turnaround ? `<div class="quote-turnaround">Turnaround: ${q.quoted_turnaround}</div>` : ''}
                                    ${q.quoted_message ? `<div class="quote-message">"${q.quoted_message}"</div>` : ''}
                                    ${q.part_id ? `<div class="quote-part-link-row"><a href="#part/${q.part_id}" onclick="go('part', ${q.part_id}); return false;">View Product on ForgAuto →</a></div>` : ''}
                                    <div class="payment-options">
                                        <label class="payment-option">
                                            <input type="radio" name="paymentType_${q.id}" value="service_only" checked onchange="updateQuoteTotal(${q.id}, ${q.quoted_price}, ${q.part_price || 0})">
                                            <div class="payment-option-content">
                                                <strong>Print Service Only</strong>
                                                <span>$${(q.quoted_price || 0).toFixed(2)} — Upload your own file</span>
                                            </div>
                                        </label>
                                        ${q.part_id && q.part_price ? `
                                        <label class="payment-option">
                                            <input type="radio" name="paymentType_${q.id}" value="service_and_file" onchange="updateQuoteTotal(${q.id}, ${q.quoted_price}, ${q.part_price})">
                                            <div class="payment-option-content">
                                                <strong>Buy Service + File</strong>
                                                <span>$${((q.quoted_price || 0) + (q.part_price || 0)).toFixed(2)} — Includes STL purchase</span>
                                            </div>
                                        </label>
                                        ` : ''}
                                    </div>
                                    <div class="quote-total-row">
                                        <span>Total:</span>
                                        <span id="quoteTotal_${q.id}" class="quote-total-value">$${(q.quoted_price || 0).toFixed(2)}</span>
                                    </div>
                                    <div class="my-quote-actions">
                                        <button class="btn btn-primary" onclick="payForQuoteWithOptions(${q.id}, ${q.quoted_price}, ${q.part_price || 0}, ${q.part_id || 'null'})">Pay Online</button>
                                        <button class="btn btn-outline" onclick="selectPayAtShop(${q.id})">Pay at Shop</button>
                                        <button class="btn btn-outline" onclick="messageShop(${q.shop_id}, '${(q.shop_name || '').replace(/'/g, "\\'")}')">Message Shop</button>
                                    </div>
                                </div>
                            ` : q.status === 'pending' ? `
                                <div class="my-quote-pending">
                                    <p>Waiting for ${q.shop_name} to respond...</p>
                                    <span class="quote-date">Sent: ${new Date(q.created_at).toLocaleDateString()}</span>
                                </div>
                            ` : q.status === 'declined' ? `
                                <div class="my-quote-declined">
                                    <p>This shop declined your request.</p>
                                    <a href="#" onclick="go('printshops', ${q.part_id}); return false;" class="btn btn-outline btn-sm">Find Another Shop</a>
                                </div>
                            ` : q.status === 'accepted' || q.status === 'paid' ? `
                                <div class="my-quote-accepted">
                                    <div class="quote-paid-header">
                                        <span class="paid-badge">✓ Paid</span>
                                        <span class="paid-date">Payment Date: ${q.paid_at ? new Date(q.paid_at).toLocaleDateString() : new Date(q.updated_at || q.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div class="quote-payment-details">
                                        <div class="detail-row"><span>Amount Paid:</span><strong>$${(q.total_paid || q.quoted_price || 0).toFixed(2)}</strong></div>
                                        <div class="detail-row"><span>Service:</span><span>${q.include_file ? 'Print Service + File' : 'Print Service Only'}</span></div>
                                        <div class="detail-row"><span>Print Shop:</span><span>${q.shop_name}</span></div>
                                        <div class="detail-row"><span>Shop Email:</span><a href="mailto:${q.shop_email}">${q.shop_email || 'Contact via Messages'}</a></div>
                                    </div>
                                    ${q.part_id ? `<div class="quote-part-link-row"><a href="#part/${q.part_id}" onclick="go('part', ${q.part_id}); return false;">View Product on ForgAuto →</a></div>` : ''}
                                    ${!q.include_file ? `
                                    <div class="quote-file-upload">
                                        <p><strong>Upload your STL file for printing:</strong></p>
                                        <div class="upload-zone" onclick="document.getElementById('quoteFileUpload_${q.id}').click()">
                                            <span id="quoteFileName_${q.id}">${q.customer_file_url ? '✓ File uploaded' : 'Click to upload your 3D file'}</span>
                                        </div>
                                        <input type="file" id="quoteFileUpload_${q.id}" hidden accept=".stl,.step,.stp,.obj,.3mf" onchange="handleQuoteFileUpload(event, ${q.id})">
                                    </div>
                                    ` : `
                                    <div class="quote-file-included">
                                        <p>✓ STL file included with purchase</p>
                                        ${q.file_url ? `<a href="${q.file_url}" download class="btn btn-sm btn-outline">Download File</a>` : ''}
                                    </div>
                                    `}
                                    <div class="my-quote-actions">
                                        <button class="btn btn-outline" onclick="messageShop(${q.shop_id}, '${(q.shop_name || '').replace(/'/g, "\\'")}')">Message Shop</button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="empty-state">No quote requests yet. Browse a part and click "Request Print Quotes" to get started.</p>'}
        </div>
        
        <div id="dashMessages" class="dash-content" style="display:none">
            <h2>Messages</h2>
            ${myMessages.length ? `<div class="messages-list">${myMessages.map(m => `
                <div class="message-preview" onclick="go('conversation', ${m.other_user_id})">
                    <div class="message-avatar">${m.other_user_avatar ? `<img src="${m.other_user_avatar}">` : (m.other_user_name || '?').charAt(0)}</div>
                    <div class="message-info">
                        <div class="message-header">
                            <strong>${m.other_user_name || 'User'}</strong>
                            <span class="message-time">${new Date(m.last_message_at).toLocaleDateString()}</span>
                        </div>
                        <p class="message-snippet">${m.last_message || ''}</p>
                    </div>
                    ${m.unread_count > 0 ? `<span class="unread-badge">${m.unread_count}</span>` : ''}
                </div>
            `).join('')}</div>` : '<p class="empty-state">No messages yet. Start a conversation by contacting a seller!</p>'}
        </div>
        
        <div id="dashSales" class="dash-content" style="display:none">
            <h2>Sales</h2>
            ${mySales.length ? `<div class="sales-list">${mySales.map(s => `<div class="sale-item"><strong>${s.title}</strong> sold to ${s.buyer_name} for $${s.price.toFixed(2)}<span class="sale-date">${new Date(s.created_at).toLocaleDateString()}</span></div>`).join('')}</div>` : '<p class="empty-state">No sales yet.</p>'}
        </div>
        
        <div id="dashPurchases" class="dash-content" style="display:none">
            <h2>My Purchases</h2>
            ${myPurchases.length ? `<div class="purchase-list">${myPurchases.map(p => `<div class="purchase-item"><strong>${p.title}</strong> by ${p.seller_name}<span class="purchase-price">$${p.price.toFixed(2)}</span><a href="#" onclick="go('part', ${p.part_id}); return false;" class="btn btn-sm">View</a></div>`).join('')}</div>` : '<p class="empty-state">No purchases yet.</p>'}
        </div>
        
        <div id="dashReviews" class="dash-content" style="display:none">
            <h2>My Reviews</h2>
            <p class="section-subtitle">Review products you've purchased and print shops you've used</p>
            
            <h3>Product Reviews</h3>
            ${myPurchases.length ? `
                <div class="review-items-list">
                    ${myPurchases.map(p => `
                        <div class="review-item-card">
                            <div class="review-item-info">
                                <a href="#part/${p.part_id}" onclick="go('part', ${p.part_id}); return false;" class="review-item-title">${p.title}</a>
                                <span>by ${p.seller_name} · <strong>$${(p.price || 0).toFixed(2)}</strong></span>
                                ${p.reviewed ? `<span class="your-rating">Your rating: ${'★'.repeat(p.review_rating || 5)} (${p.review_rating || 5}/5)</span>` : ''}
                            </div>
                            <div class="review-item-actions">
                                <a href="#part/${p.part_id}" onclick="go('part', ${p.part_id}); return false;" class="btn btn-sm btn-outline">View</a>
                                ${p.reviewed ? `
                                    <span class="review-done-badge">✓ Reviewed</span>
                                ` : `
                                    <button class="btn btn-sm btn-primary" onclick="openReviewModal('part', ${p.part_id}, '${(p.title || '').replace(/'/g, "\\'")}')">Write Review</button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="empty-state">No purchases to review yet.</p>'}
            
            <h3 style="margin-top:24px;">Print Shop Reviews</h3>
            ${myQuotes.filter(q => q.status === 'accepted' || q.status === 'paid').length ? `
                <div class="review-items-list">
                    ${myQuotes.filter(q => q.status === 'accepted' || q.status === 'paid').map(q => `
                        <div class="review-item-card">
                            <div class="review-item-info">
                                <strong>${q.shop_name}</strong>
                                <span>Print job for: ${q.part_title || 'Custom part'} · <strong>$${(q.total_paid || q.quoted_price || 0).toFixed(2)}</strong></span>
                                ${q.shop_reviewed ? `<span class="your-rating">Your rating: ${'★'.repeat(q.shop_review_rating || 5)} (${q.shop_review_rating || 5}/5)</span>` : ''}
                            </div>
                            <div class="review-item-actions">
                                ${q.shop_reviewed ? `
                                    <span class="review-done-badge">✓ Reviewed</span>
                                ` : `
                                    <button class="btn btn-sm btn-primary" onclick="openReviewModal('shop', ${q.shop_id}, '${(q.shop_name || '').replace(/'/g, "\\'")}')">Write Review</button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="empty-state">No completed print jobs to review yet.</p>'}
        </div>
        
        ${currentUser.role === 'printshop' ? `
        <div id="dashQuotes" class="dash-content">
            <h2>Quote Requests</h2>
            ${quoteRequests.length ? `
                <div class="quotes-list">
                    ${quoteRequests.map(q => `
                        <div class="quote-card ${q.status}">
                            <div class="quote-header">
                                <div class="quote-part-info">
                                    ${q.part_image ? `<img src="${q.part_image}" alt="${q.part_title}" class="quote-part-thumb" onclick="go('part', ${q.part_id})" style="cursor:pointer">` : ''}
                                    <div>
                                        <strong>${q.part_id ? `<a href="#part/${q.part_id}" onclick="go('part', ${q.part_id}); return false;" style="color:inherit; text-decoration:underline;">${q.part_title || 'Custom Print Request'}</a>` : (q.part_title || 'Custom Print Request')}</strong>
                                        <span class="quote-customer">From: ${q.customer_name} (${q.customer_email})</span>
                                        ${q.part_id ? `<a href="#part/${q.part_id}" onclick="go('part', ${q.part_id}); return false;" class="quote-part-link">View Product →</a>` : ''}
                                    </div>
                                </div>
                                <span class="quote-status-badge ${q.status}">${q.status}</span>
                            </div>
                            <div class="quote-details">
                                <div class="quote-detail"><span>Material:</span> ${q.material || 'Not specified'}</div>
                                <div class="quote-detail"><span>Quantity:</span> ${q.quantity || 1}</div>
                                <div class="quote-detail"><span>Timeline:</span> ${q.timeline || 'Standard'}</div>
                                <div class="quote-detail"><span>Color:</span> ${q.color || 'Any'}</div>
                            </div>
                            ${q.notes ? `<div class="quote-notes"><strong>Notes:</strong> ${q.notes}</div>` : ''}
                            <div class="quote-actions">
                                ${q.status === 'pending' ? `
                                    <button class="btn btn-primary btn-sm" onclick="openQuoteResponseModal(${q.id})">Send Quote</button>
                                    <button class="btn btn-outline btn-sm" onclick="declineQuote(${q.id})">Decline</button>
                                ` : q.status === 'quoted' ? `
                                    <span class="quote-sent-price">Quoted: $${q.quoted_price?.toFixed(2) || '0.00'}</span>
                                ` : q.status === 'accepted' ? `
                                    <button class="btn btn-primary btn-sm" onclick="openMarkPaidModal(${q.id}, ${q.quoted_price || 0}, '${(q.customer_name || '').replace(/'/g, "\\'")}')">Mark as Paid at Shop</button>
                                    <button class="btn btn-outline btn-sm" onclick="downloadQuoteReceipt(${q.id})">Download Receipt</button>
                                ` : q.status === 'paid' ? `
                                    <span class="quote-paid-badge">✓ Paid $${(q.total_paid || q.quoted_price || 0).toFixed(2)}</span>
                                    <button class="btn btn-outline btn-sm" onclick="downloadQuoteReceipt(${q.id})">Download Receipt</button>
                                ` : ''}
                                <button class="btn btn-outline btn-sm" onclick="go('conversation', ${q.user_id || q.customer_id})">Message Customer</button>
                                <a href="mailto:${q.customer_email}" class="btn btn-outline btn-sm">Email</a>
                            </div>
                            <div class="quote-date">Received: ${new Date(q.created_at).toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="empty-state">No quote requests yet. Your shop will appear in the Print Shop directory for customers to find.</p>'}
        </div>
        
        <div id="dashShopProfile" class="dash-content" style="display:none">
            <h2>Shop Profile</h2>
            
            <div class="shop-status-box ${(currentUser.printshop?.review_count || 0) >= 5 ? 'status-verified' : 'status-pending'}">
                <div class="status-header">
                    <span class="status-icon">${(currentUser.printshop?.review_count || 0) >= 5 ? '✓' : '○'}</span>
                    <span class="status-text">${(currentUser.printshop?.review_count || 0) >= 5 ? 'Verified Print Shop' : 'Pending Verification'}</span>
                </div>
                <div class="status-progress">
                    <span class="progress-count ${(currentUser.printshop?.review_count || 0) < 5 ? 'progress-red' : ''}">${currentUser.printshop?.review_count || 0}/5 reviews</span>
                    ${(currentUser.printshop?.review_count || 0) < 5 ? `<span class="progress-hint">Get ${5 - (currentUser.printshop?.review_count || 0)} more review${5 - (currentUser.printshop?.review_count || 0) > 1 ? 's' : ''} to become verified</span>` : '<span class="progress-hint">✓ Your shop is verified!</span>'}
                </div>
                ${currentUser.printshop?.avg_rating ? `<div class="shop-rating-display">Average Rating: ${'★'.repeat(Math.floor(currentUser.printshop.avg_rating))}${currentUser.printshop.avg_rating % 1 >= 0.5 ? '½' : ''} (${currentUser.printshop.avg_rating.toFixed(1)})</div>` : ''}
            </div>
            
            <form onsubmit="handleShopProfileUpdate(event)" class="settings-form">
                <div class="field">
                    <label>Shop Logo</label>
                    <div class="avatar-upload">
                        <div class="avatar-preview" id="shopLogoPreview">
                            ${currentUser.printshop?.logo_url ? `<img src="${currentUser.printshop.logo_url}" alt="Logo">` : `<span>PS</span>`}
                        </div>
                        <div class="avatar-actions">
                            <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('shopLogoInput').click()">Change Logo</button>
                            <input type="file" id="shopLogoInput" accept="image/*" hidden onchange="handleShopLogoUpload(event)">
                        </div>
                    </div>
                </div>
                
                <div class="field"><label>Shop Name *</label><input type="text" id="shopProfileName" value="${currentUser.printshop?.shop_name || ''}" required></div>
                <div class="field"><label>Contact Person *</label><input type="text" id="shopProfileContact" value="${currentUser.printshop?.contact_name || ''}" required></div>
                <div class="field-row">
                    <div class="field"><label>Phone *</label><input type="tel" id="shopProfilePhone" value="${currentUser.printshop?.phone || ''}" required></div>
                    <div class="field"><label>Email</label><input type="email" id="shopProfileEmail" value="${currentUser.printshop?.email || currentUser.email}" readonly></div>
                </div>
                <div class="field"><label>Website</label><input type="url" id="shopProfileWebsite" value="${currentUser.printshop?.website || ''}" placeholder="https://yourshop.com"></div>
                <div class="field-row">
                    <div class="field"><label>Country *</label><input type="text" id="shopProfileCountry" value="${currentUser.printshop?.country || ''}" required></div>
                    <div class="field"><label>State/Province</label><input type="text" id="shopProfileState" value="${currentUser.printshop?.state || ''}"></div>
                </div>
                <div class="field-row">
                    <div class="field"><label>City *</label><input type="text" id="shopProfileCity" value="${currentUser.printshop?.city || ''}" required></div>
                    <div class="field"><label>Street Address</label><input type="text" id="shopProfileAddress" value="${currentUser.printshop?.address || ''}"></div>
                </div>
                <div class="field"><label>Description *</label><textarea id="shopProfileDescription" rows="4" required>${currentUser.printshop?.description || ''}</textarea></div>
                
                <h3>Capabilities</h3>
                <div class="field">
                    <label>Printing Technologies</label>
                    <div class="checkbox-grid">
                        <label class="checkbox-item"><input type="checkbox" id="shopTechFDM" ${(currentUser.printshop?.technologies || []).includes('FDM') ? 'checked' : ''}> FDM</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopTechSLA" ${(currentUser.printshop?.technologies || []).includes('SLA') ? 'checked' : ''}> SLA/Resin</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopTechSLS" ${(currentUser.printshop?.technologies || []).includes('SLS') ? 'checked' : ''}> SLS</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopTechMJF" ${(currentUser.printshop?.technologies || []).includes('MJF') ? 'checked' : ''}> MJF</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopTechMetal" ${(currentUser.printshop?.technologies || []).includes('Metal') ? 'checked' : ''}> Metal</label>
                    </div>
                </div>
                
                <div class="field">
                    <label>Services Offered</label>
                    <div class="checkbox-grid">
                        <label class="checkbox-item"><input type="checkbox" id="shopSvcInstant" ${(currentUser.printshop?.services || []).includes('Instant Quote') ? 'checked' : ''}> Instant Quotes</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopSvcShip" ${(currentUser.printshop?.services || []).includes('Print & Ship') ? 'checked' : ''}> Print & Ship</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopSvcPickup" ${(currentUser.printshop?.services || []).includes('Local Pickup') ? 'checked' : ''}> Local Pickup</label>
                        <label class="checkbox-item"><input type="checkbox" id="shopSvcRush" ${(currentUser.printshop?.services || []).includes('Rush Orders') ? 'checked' : ''}> Rush Orders</label>
                    </div>
                </div>
                
                <div class="field-row">
                    <div class="field"><label>Max Build Size (mm)</label><input type="text" id="shopProfileBuildSize" value="${currentUser.printshop?.build_size || ''}" placeholder="300x300x400"></div>
                    <div class="field"><label>Typical Turnaround</label><input type="text" id="shopProfileTurnaround" value="${currentUser.printshop?.turnaround || ''}" placeholder="2-3 days"></div>
                </div>
                
                <h3>Portfolio Images</h3>
                <div class="field">
                    <div class="portfolio-grid" id="shopPortfolioGrid">
                        ${(currentUser.printshop?.portfolio_images || []).map((img, i) => `
                            <div class="portfolio-item">
                                <img src="${img}" alt="Work ${i+1}">
                                <button type="button" class="portfolio-remove" onclick="removeShopPortfolioImage(${i})">×</button>
                            </div>
                        `).join('')}
                        <div class="portfolio-add" onclick="document.getElementById('shopPortfolioInput').click()">
                            <span>+</span>
                            <span>Add</span>
                        </div>
                    </div>
                    <input type="file" id="shopPortfolioInput" accept="image/*" multiple hidden onchange="handleShopPortfolioUpload(event)">
                    <p class="field-hint">Show off your best prints to attract customers</p>
                </div>
                
                <button type="submit" class="btn btn-primary">Save Shop Profile</button>
            </form>
        </div>
        ` : ''}
        
        <div id="dashSettings" class="dash-content" style="display:none">
            <h2>Profile Settings</h2>
            <form onsubmit="handleProfileUpdate(event)" class="settings-form">
                <div class="field">
                    <label>Profile Photo</label>
                    <div class="avatar-upload">
                        <div class="avatar-preview" id="avatarPreview">
                            ${currentUser.avatar_url ? `<img src="${currentUser.avatar_url}" alt="Avatar">` : `<span>${currentUser.name.charAt(0)}</span>`}
                        </div>
                        <div class="avatar-actions">
                            <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('avatarInput').click()">Change Photo</button>
                            <input type="file" id="avatarInput" accept="image/*" hidden onchange="handleAvatarUpload(event)">
                            <span class="avatar-hint">JPG, PNG, GIF. Max 5MB.</span>
                        </div>
                    </div>
                </div>
                <div class="field"><label>Name</label><input type="text" id="settingsName" value="${currentUser.name}"></div>
                <div class="field"><label>Bio</label><textarea id="settingsBio" rows="3">${currentUser.bio || ''}</textarea></div>
                ${currentUser.role === 'designer' ? `
                    <div class="field"><label>Hourly Rate</label><input type="text" id="settingsRate" value="${currentUser.rate || ''}" placeholder="$50/hr"></div>
                    <div class="field"><label>Specialties (comma separated)</label><input type="text" id="settingsTags" value="${(currentUser.tags || []).join(', ')}" placeholder="JDM, Interior, BMW"></div>
                ` : ''}
                <div class="field notification-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" id="settingsEmailNotify" ${currentUser.email_notify !== false ? 'checked' : ''}>
                        <span>Email notifications for new messages</span>
                    </label>
                    <p class="field-hint">Get an email when someone contacts you about a listing</p>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
        </div>
        
        ${currentUser.role === 'designer' ? `
        <div id="dashDesigner" class="dash-content" style="display:none">
            <h2>Designer Profile</h2>
            
            <div class="designer-status-box ${myParts.length >= 5 ? 'status-active' : 'status-pending'}">
                <div class="status-header">
                    <span class="status-icon">${myParts.length >= 5 ? '✓' : '!'}</span>
                    <span class="status-text">${myParts.length >= 5 ? 'Designer Status: Active' : 'Designer Status: Pending'}</span>
                </div>
                <div class="status-progress">
                    <span class="progress-count ${myParts.length < 5 ? 'progress-red' : ''}">${myParts.length}/5 uploaded builds</span>
                    ${myParts.length < 5 ? `<span class="progress-hint">! Must upload ${5 - myParts.length} more design${5 - myParts.length > 1 ? 's' : ''} on ForgAuto to become a verified designer</span>` : '<span class="progress-hint">✓ You are a verified designer!</span>'}
                </div>
            </div>
            
            <div class="designer-profile-form">
                <h3>Public Profile Information</h3>
                
                <div class="field">
                    <label>Location</label>
                    <input type="text" id="designerLocation" value="${currentUser.location || ''}" placeholder="City, Country (e.g., Los Angeles, USA)">
                </div>
                
                <div class="field">
                    <label>Resume / About</label>
                    <textarea id="designerResume" rows="4" placeholder="Tell clients about your experience, skills, and what makes you unique...">${currentUser.resume || currentUser.bio || ''}</textarea>
                </div>
                
                <div class="field">
                    <label>Portfolio Images</label>
                    <div class="portfolio-grid" id="portfolioGrid">
                        ${(currentUser.portfolio_images || []).map((img, i) => `
                            <div class="portfolio-item">
                                <img src="${img}" alt="Portfolio ${i+1}">
                                <button type="button" class="portfolio-remove" onclick="removePortfolioImage(${i})">×</button>
                            </div>
                        `).join('')}
                        <div class="portfolio-add" onclick="document.getElementById('portfolioInput').click()">
                            <span>+</span>
                            <span>Add Image</span>
                        </div>
                    </div>
                    <input type="file" id="portfolioInput" accept="image/*" multiple hidden onchange="handlePortfolioUpload(event)">
                    <p class="field-hint">Showcase your best work (renders, photos of printed parts)</p>
                </div>
                
                <h3>Social Media & Links</h3>
                
                <div class="field">
                    <label>Website / Portfolio URL</label>
                    <input type="url" id="designerWebsite" value="${currentUser.website || ''}" placeholder="https://yourportfolio.com">
                </div>
                
                <div class="field-row">
                    <div class="field">
                        <label>Instagram</label>
                        <input type="text" id="designerInstagram" value="${currentUser.instagram || ''}" placeholder="@username">
                    </div>
                    <div class="field">
                        <label>Twitter/X</label>
                        <input type="text" id="designerTwitter" value="${currentUser.twitter || ''}" placeholder="@username">
                    </div>
                </div>
                
                <div class="field-row">
                    <div class="field">
                        <label>YouTube</label>
                        <input type="text" id="designerYoutube" value="${currentUser.youtube || ''}" placeholder="Channel URL or @handle">
                    </div>
                    <div class="field">
                        <label>LinkedIn</label>
                        <input type="text" id="designerLinkedin" value="${currentUser.linkedin || ''}" placeholder="Profile URL">
                    </div>
                </div>
                
                <div class="field">
                    <label>Other Links</label>
                    <input type="text" id="designerOtherLinks" value="${currentUser.other_links || ''}" placeholder="Behance, Dribbble, GitHub, etc. (comma separated)">
                </div>
                
                <h3>Equipment & Capabilities</h3>
                
                <div class="field">
                    <label>3D Printers Owned</label>
                    <input type="text" id="designerPrinters" value="${currentUser.printers || ''}" placeholder="e.g., Prusa MK4, Bambu X1C, Ender 3">
                </div>
                
                <div class="field">
                    <label>Software Used</label>
                    <input type="text" id="designerSoftware" value="${currentUser.software || ''}" placeholder="e.g., Fusion 360, SolidWorks, Blender">
                </div>
                
                <button type="button" class="btn btn-primary" onclick="handleDesignerProfileUpdate()">Save Designer Profile</button>
            </div>
        </div>
        ` : ''}
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
    const email_notify = document.getElementById('settingsEmailNotify')?.checked ?? true;
    
    try {
        await api('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, bio, rate, tags, email_notify })
        });
        currentUser = { ...currentUser, name, bio, rate, tags, email_notify };
        alert('Profile updated!');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Designer profile update handler
async function handleDesignerProfileUpdate() {
    const location = document.getElementById('designerLocation')?.value;
    const resume = document.getElementById('designerResume')?.value;
    const website = document.getElementById('designerWebsite')?.value;
    const instagram = document.getElementById('designerInstagram')?.value;
    const twitter = document.getElementById('designerTwitter')?.value;
    const youtube = document.getElementById('designerYoutube')?.value;
    const linkedin = document.getElementById('designerLinkedin')?.value;
    const other_links = document.getElementById('designerOtherLinks')?.value;
    const printers = document.getElementById('designerPrinters')?.value;
    const software = document.getElementById('designerSoftware')?.value;
    
    try {
        await api('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({ 
                location, resume, website, instagram, twitter, 
                youtube, linkedin, other_links, printers, software 
            })
        });
        currentUser = { ...currentUser, location, resume, website, instagram, twitter, youtube, linkedin, other_links, printers, software };
        alert('Designer profile updated!');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Portfolio image handlers
let portfolioImages = [];

async function handlePortfolioUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name} is too large (max 5MB)`);
            continue;
        }
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData
            });
            
            if (res.ok) {
                const data = await res.json();
                portfolioImages.push(data.url);
                currentUser.portfolio_images = [...(currentUser.portfolio_images || []), data.url];
                renderPortfolioGrid();
            }
        } catch (err) {
            alert('Error uploading: ' + err.message);
        }
    }
}

function removePortfolioImage(index) {
    currentUser.portfolio_images = (currentUser.portfolio_images || []).filter((_, i) => i !== index);
    renderPortfolioGrid();
}

function renderPortfolioGrid() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    grid.innerHTML = `
        ${(currentUser.portfolio_images || []).map((img, i) => `
            <div class="portfolio-item">
                <img src="${img}" alt="Portfolio ${i+1}">
                <button type="button" class="portfolio-remove" onclick="removePortfolioImage(${i})">×</button>
            </div>
        `).join('')}
        <div class="portfolio-add" onclick="document.getElementById('portfolioInput').click()">
            <span>+</span>
            <span>Add Image</span>
        </div>
    `;
}

async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image must be under 5MB');
        return;
    }
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('avatarPreview').innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
    };
    reader.readAsDataURL(file);
    
    // Upload to server
    try {
        const res = await fetch(`${API_URL}/api/profile/avatar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': file.type
            },
            body: file
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        
        currentUser.avatar_url = data.avatar_url;
        updateNavAuth();
        alert('Profile photo updated!');
    } catch (err) {
        alert('Error uploading photo: ' + err.message);
    }
}

// ========== PRINT SHOP HANDLERS ==========

async function handleShopProfileUpdate(e) {
    e.preventDefault();
    
    // Collect technologies
    const technologies = [];
    if (document.getElementById('shopTechFDM')?.checked) technologies.push('FDM');
    if (document.getElementById('shopTechSLA')?.checked) technologies.push('SLA');
    if (document.getElementById('shopTechSLS')?.checked) technologies.push('SLS');
    if (document.getElementById('shopTechMJF')?.checked) technologies.push('MJF');
    if (document.getElementById('shopTechMetal')?.checked) technologies.push('Metal');
    
    // Collect services
    const services = [];
    if (document.getElementById('shopSvcInstant')?.checked) services.push('Instant Quote');
    if (document.getElementById('shopSvcShip')?.checked) services.push('Print & Ship');
    if (document.getElementById('shopSvcPickup')?.checked) services.push('Local Pickup');
    if (document.getElementById('shopSvcRush')?.checked) services.push('Rush Orders');
    
    const shopData = {
        shop_name: document.getElementById('shopProfileName').value,
        contact_name: document.getElementById('shopProfileContact').value,
        phone: document.getElementById('shopProfilePhone').value,
        website: document.getElementById('shopProfileWebsite').value,
        country: document.getElementById('shopProfileCountry').value,
        state: document.getElementById('shopProfileState').value,
        city: document.getElementById('shopProfileCity').value,
        address: document.getElementById('shopProfileAddress').value,
        description: document.getElementById('shopProfileDescription').value,
        technologies: technologies,
        services: services,
        build_size: document.getElementById('shopProfileBuildSize').value,
        turnaround: document.getElementById('shopProfileTurnaround').value
    };
    
    try {
        await api('/api/printshop/profile', {
            method: 'PUT',
            body: JSON.stringify(shopData)
        });
        currentUser.printshop = { ...currentUser.printshop, ...shopData };
        alert('Shop profile updated!');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function handleShopLogoUpload(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('shopLogoPreview').innerHTML = `<img src="${e.target.result}" alt="Logo">`;
    };
    reader.readAsDataURL(file);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${API_URL}/api/upload/photo`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });
        
        if (res.ok) {
            const data = await res.json();
            await api('/api/printshop/profile', {
                method: 'PUT',
                body: JSON.stringify({ logo_url: data.url })
            });
            currentUser.printshop = { ...currentUser.printshop, logo_url: data.url };
            alert('Logo updated!');
        }
    } catch (err) {
        alert('Error uploading logo: ' + err.message);
    }
}

async function handleShopPortfolioUpload(event) {
    for (let file of event.target.files) {
        if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) continue;
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData
            });
            
            if (res.ok) {
                const data = await res.json();
                if (!currentUser.printshop) currentUser.printshop = {};
                if (!currentUser.printshop.portfolio_images) currentUser.printshop.portfolio_images = [];
                currentUser.printshop.portfolio_images.push(data.url);
                renderShopPortfolioGrid();
            }
        } catch (err) {
            console.error('Upload error:', err);
        }
    }
}

function removeShopPortfolioImage(index) {
    if (currentUser.printshop?.portfolio_images) {
        currentUser.printshop.portfolio_images.splice(index, 1);
        renderShopPortfolioGrid();
    }
}

function renderShopPortfolioGrid() {
    const grid = document.getElementById('shopPortfolioGrid');
    if (!grid) return;
    grid.innerHTML = `
        ${(currentUser.printshop?.portfolio_images || []).map((img, i) => `
            <div class="portfolio-item">
                <img src="${img}" alt="Work ${i+1}">
                <button type="button" class="portfolio-remove" onclick="removeShopPortfolioImage(${i})">×</button>
            </div>
        `).join('')}
        <div class="portfolio-add" onclick="document.getElementById('shopPortfolioInput').click()">
            <span>+</span>
            <span>Add</span>
        </div>
    `;
}

// Quote response modal
function openQuoteResponseModal(quoteId) {
    const modal = document.createElement('div');
    modal.id = 'quoteResponseModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeQuoteResponseModal()">×</button>
            <h2>Send Quote</h2>
            <form onsubmit="submitQuoteResponse(event, ${quoteId})">
                <div class="field">
                    <label>Quote Price ($)</label>
                    <input type="number" id="quotePrice" step="0.01" min="0" required placeholder="Enter your price">
                </div>
                <div class="field">
                    <label>Estimated Turnaround</label>
                    <input type="text" id="quoteTurnaround" placeholder="e.g., 2-3 business days">
                </div>
                <div class="field">
                    <label>Message to Customer</label>
                    <textarea id="quoteMessage" rows="3" placeholder="Include any details about your quote..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Send Quote</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeQuoteResponseModal() {
    const modal = document.getElementById('quoteResponseModal');
    if (modal) modal.remove();
}

async function submitQuoteResponse(e, quoteId) {
    e.preventDefault();
    const price = parseFloat(document.getElementById('quotePrice').value);
    const turnaround = document.getElementById('quoteTurnaround').value;
    const message = document.getElementById('quoteMessage').value;
    
    try {
        await api(`/api/quotes/${quoteId}/respond`, {
            method: 'POST',
            body: JSON.stringify({ price, turnaround, message })
        });
        closeQuoteResponseModal();
        alert('Quote sent to customer!');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function declineQuote(quoteId) {
    if (!confirm('Decline this quote request?')) return;
    try {
        await api(`/api/quotes/${quoteId}/decline`, { method: 'POST' });
        alert('Quote declined.');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Review modal for parts and print shops
function openReviewModal(type, id, name) {
    const modal = document.createElement('div');
    modal.id = 'reviewModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeReviewModal()">×</button>
            <h2>Review ${type === 'shop' ? 'Print Shop' : 'Product'}</h2>
            <p class="review-modal-name">${name}</p>
            <form onsubmit="submitReviewFromModal(event, '${type}', ${id})">
                <div class="field">
                    <label>Rating</label>
                    <div class="star-rating-input" id="starRatingInput">
                        ${[1,2,3,4,5].map(n => `<span class="star-input" data-rating="${n}" onclick="setStarRating(${n})">☆</span>`).join('')}
                    </div>
                    <input type="hidden" id="modalRating" value="5">
                </div>
                <div class="field">
                    <label>Your Review</label>
                    <textarea id="modalReviewComment" rows="4" placeholder="Share your experience..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Submit Review</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    setStarRating(5); // Default to 5 stars
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.remove();
}

function setStarRating(rating) {
    document.getElementById('modalRating').value = rating;
    document.querySelectorAll('#starRatingInput .star-input').forEach((star, i) => {
        star.textContent = i < rating ? '★' : '☆';
        star.classList.toggle('active', i < rating);
    });
}

async function submitReviewFromModal(e, type, id) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('modalRating').value);
    const comment = document.getElementById('modalReviewComment').value;
    
    try {
        // Use correct endpoint (parts uses /reviews plural, shops uses /review singular)
        const endpoint = type === 'shop' ? `/api/printshops/${id}/reviews` : `/api/parts/${id}/reviews`;
        await api(endpoint, {
            method: 'POST',
            body: JSON.stringify({ rating, comment })
        });
        closeReviewModal();
        alert('Review submitted! Thank you.');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// View Shop popup modal
function openShopModal(shopId) {
    // Fetch shop details and show in popup
    showShopPopup(shopId);
}

async function showShopPopup(shopId) {
    let shop = null;
    try {
        shop = await api(`/api/printshops/${shopId}`);
    } catch (e) {
        alert('Could not load shop details');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'shopModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box shop-modal-box">
            <button class="modal-close" onclick="closeShopModal()">×</button>
            <div class="shop-modal-header">
                ${shop.logo_url ? `<img src="${shop.logo_url}" alt="${shop.shop_name}" class="shop-modal-logo">` : `<div class="shop-modal-logo-placeholder">PS</div>`}
                <div class="shop-modal-info">
                    <h2>${shop.shop_name} ${shop.verified ? '<span class="verified-star">★</span>' : ''}</h2>
                    <div class="shop-modal-rating">
                        ${'★'.repeat(Math.floor(shop.avg_rating || 0))}${'☆'.repeat(5 - Math.floor(shop.avg_rating || 0))}
                        <span>${(shop.avg_rating || 0).toFixed(1)} (${shop.review_count || 0} reviews)</span>
                    </div>
                    <p class="shop-modal-location">📍 ${shop.city || ''}${shop.state ? ` (${shop.state})` : ''}${shop.country ? `, ${shop.country}` : ''}</p>
                </div>
            </div>
            
            <div class="shop-modal-details">
                ${shop.bio ? `<div class="shop-modal-section"><h3>About</h3><p>${shop.bio}</p></div>` : ''}
                
                <div class="shop-modal-section">
                    <h3>Services & Equipment</h3>
                    <div class="shop-modal-tags">
                        ${(shop.technologies || []).map(t => `<span class="tag tech-tag">${t}</span>`).join('')}
                        ${(shop.services || []).map(s => `<span class="tag service-tag">${s}</span>`).join('')}
                    </div>
                </div>
                
                ${shop.build_size ? `<div class="shop-modal-spec"><strong>Max Build Size:</strong> ${shop.build_size}</div>` : ''}
                ${shop.turnaround ? `<div class="shop-modal-spec"><strong>Typical Turnaround:</strong> ${shop.turnaround}</div>` : ''}
                
                ${shop.portfolio_images && shop.portfolio_images.length ? `
                <div class="shop-modal-section">
                    <h3>Build Gallery</h3>
                    <div class="shop-modal-gallery">
                        ${shop.portfolio_images.map(img => `<img src="${img}" alt="Build" loading="lazy" onclick="openLightbox('${img}')">`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="shop-modal-contact">
                ${shop.phone ? `<a href="tel:${shop.phone}" class="btn btn-outline">📞 Call</a>` : ''}
                ${shop.email ? `<a href="mailto:${shop.email}" class="btn btn-outline">✉️ Email</a>` : ''}
                <button class="btn btn-primary" onclick="closeShopModal(); openQuoteRequestModalForShop(${shop.id}, '${(shop.shop_name || '').replace(/'/g, "\\'")}')">Request Quote</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeShopModal() {
    const modal = document.getElementById('shopModal');
    if (modal) modal.remove();
}

function openQuoteRequestModalForShop(shopId, shopName) {
    // Open a generic quote request for a shop (without specific part)
    alert(`Request a quote from ${shopName}. Select a part first or describe your custom print needs.`);
}

// ========== HOME VIEW ==========

function homeView() {
    // ONLY show parts with valid images in public views
    const validParts = filterPublicParts(parts);
    // Featured Parts = parts that are featured (paid $20 for 30 days)
    const featuredParts = validParts.filter(p => p.featured || p.premiered).slice(0, 8);
    
    return `
        <div class="promo-banner">
            <div class="promo-content"><span class="promo-badge">NEW</span><span class="promo-text">Need a custom part? <strong>Find a Designer</strong> to create it for you</span></div>
            <a href="#" onclick="go('designers'); return false;" class="promo-cta">Browse Designers</a>
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
                <span class="trust-badge">$10 Flat Listing Fee</span>
                <span class="trust-badge">Keep 100% of Sales</span>
                <span class="trust-badge">Instant Download</span>
            </div>
        </div>

        <div class="categories"><h2>Categories</h2>
            <div class="cat-grid">${categories.map(c => `<a href="#" class="cat-item" onclick="filterCat='${c.name}';go('browse'); return false;"><img src="${c.img}" alt="${c.name}"><span>${c.name}</span></a>`).join('')}</div>
        </div>

        ${featuredParts.length ? `<div class="section featured-section-v5">
            <div class="featured-header">
                <div class="featured-badge-lg">★ FEATURED</div>
                <h2>Featured Parts</h2>
                <p>Premium listings from top sellers</p>
            </div>
            <div class="featured-grid">${featuredParts.map(p => cardHTML(p)).join('')}</div>
            <div class="featured-footer"><a href="#" onclick="go('browse'); return false;" class="btn btn-outline">Browse All Parts →</a></div>
        </div>` : ''}
        
        <div class="section"><div class="section-head"><h2>New Parts</h2>${validParts.length ? `<a href="#" onclick="go('browse'); return false;">View all</a>` : ''}</div>
            ${validParts.length ? `<div class="grid grid-home-new">${validParts.slice(0, 6).map(cardHTML).join('')}</div>` : 
            `<div class="empty-cta"><h3>Be the first to list a part</h3><p>Start selling your 3D automotive designs today.</p><a href="#" onclick="go('sell'); return false;" class="btn btn-lg btn-primary">Create Listing - $10</a></div>`}
        </div>

        <div class="section featured-designers"><div class="section-head"><h2>Top Designers</h2><a href="#" onclick="go('designers'); return false;">View all</a></div>
            <div class="designers-preview">${designers.filter(d => d && d.name && d.avatar_url && d.bio).slice(0, 3).map(d => `<div class="designer-mini" onclick="go('designer', ${d.id})"><img src="${d.avatar_url}" alt="${d.name}"><div class="designer-mini-info"><strong>${d.name}</strong><span>${d.bio.substring(0, 50)}...</span>${d.stats?.avgRating ? `<span class="designer-mini-rate">${d.rate || ''} - ${d.stats.avgRating} stars</span>` : (d.rate ? `<span class="designer-mini-rate">${d.rate}</span>` : '')}</div></div>`).join('') || '<p class="empty-state">No designers yet — <a href="#" onclick="go(\'become-designer\'); return false;">be the first!</a></p>'}</div>
        </div>

    `;
}
// v7.4: Removed stats-bar and version-tag from homepage

// Pagination state
let currentPage = 1;
const ITEMS_PER_PAGE = 25;

function browseView() {
    // Start with only parts that have valid images
    let filtered = filterPublicParts(parts);
    if (filter) { const q = filter.toLowerCase(); filtered = filtered.filter(p => (p.title||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (p.make||'').toLowerCase().includes(q) || (p.model||'').toLowerCase().includes(q)); }
    if (filterCat) filtered = filtered.filter(p => p.category === filterCat);
    if (filterMake) filtered = filtered.filter(p => p.make === filterMake);
    if (filterModel) filtered = filtered.filter(p => p.model === filterModel);
    const title = filterMake && filterModel ? `${filterMake} ${filterModel}` : filterMake ? filterMake : filterCat ? filterCat : filter ? `"${filter}"` : 'All Parts';
    
    // v7.4: Apply user-selected sort
    if (filterSort === 'price-low') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filterSort === 'price-high') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (filterSort === 'popular') {
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else {
        // Default: newest first (by created_at or id)
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    
    // v5.0: Sort featured parts to top (after user sort)
    const featuredParts = filtered.filter(p => p.featured || p.premiered);
    const regularParts = filtered.filter(p => !p.featured && !p.premiered);
    const sortedParts = [...featuredParts, ...regularParts];
    
    // v7.2: Pagination (max 25 per page)
    const totalPages = Math.ceil(sortedParts.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = 1;
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedParts = sortedParts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    
    return `<div class="browse browse-fullwidth">
        <!-- Mobile search bar -->
        <div class="mobile-browse-search">
            <input type="text" placeholder="Search parts..." value="${filter || ''}" onkeyup="if(event.key==='Enter'){filter=this.value;currentPage=1;go('browse');}">
            <select onchange="filterCat=this.value;currentPage=1;go('browse');">
                <option value="">All Categories</option>
                ${categories.map(c => `<option value="${c.name}" ${filterCat===c.name?'selected':''}>${c.name}</option>`).join('')}
            </select>
        </div>
        <aside class="sidebar">
            <h3>Category</h3>
            <select class="filter-select" onchange="filterCat=this.value;currentPage=1;go('browse');">
                <option value="">All Categories</option>
                ${categories.map(c => `<option value="${c.name}" ${filterCat===c.name?'selected':''}>${c.name}</option>`).join('')}
            </select>
            <h3>Make</h3>
            <select class="filter-select" onchange="filterMake=this.value;filterModel='';currentPage=1;go('browse');">
                <option value="">All Makes</option>
                ${carMakes.filter(m => m !== 'Non-Specific').map(m => `<option value="${m}" ${filterMake===m?'selected':''}>${m}</option>`).join('')}
            </select>
            ${filterMake && carModels[filterMake] ? `<h3>Model</h3>
            <select class="filter-select" onchange="filterModel=this.value;currentPage=1;go('browse');">
                <option value="">All ${filterMake} Models</option>
                ${carModels[filterMake].map(m => `<option value="${m}" ${filterModel===m?'selected':''}>${m}</option>`).join('')}
            </select>` : ''}
            <div class="sidebar-cta"><p>Don't have a printer?</p><a href="#" onclick="go('printshops'); return false;" class="btn btn-outline" style="width:100%">Find Print Shop</a></div>
        </aside>
        <div class="browse-main"><div class="browse-head"><h1>${title}</h1><span style="color:var(--muted)">${sortedParts.length} parts</span>
            <select class="sort-select" onchange="filterSort=this.value;currentPage=1;go('browse');">
                <option value="newest" ${filterSort==='newest'?'selected':''}>Newest First</option>
                <option value="price-low" ${filterSort==='price-low'?'selected':''}>Price: Low to High</option>
                <option value="price-high" ${filterSort==='price-high'?'selected':''}>Price: High to Low</option>
                <option value="popular" ${filterSort==='popular'?'selected':''}>Most Popular</option>
            </select>
        </div>
            ${featuredParts.length > 0 && currentPage === 1 ? `<div class="browse-featured-label"><span>★</span> Featured Listings</div>` : ''}
            <div class="grid grid-wide">${paginatedParts.length ? paginatedParts.map(cardHTML).join('') : '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:48px 0;">No parts found.</p>'}</div>
            ${totalPages > 1 ? `
            <div class="pagination">
                <button class="btn btn-sm ${currentPage === 1 ? 'btn-disabled' : 'btn-outline'}" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>
                <span class="page-info">Page ${currentPage} of ${totalPages}</span>
                <button class="btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : 'btn-outline'}" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>
            </div>
            ` : ''}
        </div>
    </div>`;
}

function goToPage(page) {
    currentPage = page;
    go('browse');
    window.scrollTo(0, 0);
}

// v6.0: Designer specialties for filtering
const designerSpecialties = [
    'CAD Modeling',
    '3D Scanning',
    '3D Editing',
    'Reverse Engineering',
    'Prototyping',
    'Interior Parts',
    'Exterior Parts',
    'Performance Parts',
    'JDM Specialist',
    'European Specialist',
    'American Muscle'
];

let designerFilterSpecialty = '';
let designerFilterLocation = '';
let designerSortBy = 'rating'; // rating, parts, rate

function designersView() {
    // v7.4: Filter out invalid designers - show empty state if none
    let validDesigners = designers.filter(d => d.name && d.name !== 'undefined' && d.avatar_url && d.avatar_url.startsWith('http'));
    
    // v6.0: Apply filters
    let filtered = validDesigners.filter(d => {
        // Must have 5+ parts to be a designer
        if ((d.stats?.parts || 0) < 5 && !d.isDemo) return false;
        // Must have profile photo
        if (!d.avatar_url) return false;
        // Filter by specialty
        if (designerFilterSpecialty && !(d.tags || []).some(t => t.toLowerCase().includes(designerFilterSpecialty.toLowerCase()))) return false;
        // Filter by location
        if (designerFilterLocation && !(d.location || '').toLowerCase().includes(designerFilterLocation.toLowerCase())) return false;
        return true;
    });
    
    // v6.0: Sort designers
    filtered.sort((a, b) => {
        if (designerSortBy === 'rating') return (b.stats?.avgRating || 0) - (a.stats?.avgRating || 0);
        if (designerSortBy === 'parts') return (b.stats?.parts || 0) - (a.stats?.parts || 0);
        if (designerSortBy === 'rate') {
            const rateA = parseFloat((a.rate || '$0').replace(/[^0-9.]/g, '')) || 0;
            const rateB = parseFloat((b.rate || '$0').replace(/[^0-9.]/g, '')) || 0;
            return rateA - rateB;
        }
        return 0;
    });
    
    return `<div class="designers-page">
        <div class="designers-header">
            <div class="designers-header-content">
                <h1>Hire a Designer</h1>
                <p>Work with verified automotive 3D specialists. All designers have 5+ completed projects on ForgAuto.</p>
                ${currentUser ? `<a href="#" onclick="go('become-designer'); return false;" class="btn btn-outline" style="color:#fff !important; border-color:rgba(255,255,255,0.5);">Become a Designer</a>` : ''}
            </div>
        </div>
        
        <div class="designers-filters">
            <div class="filter-group">
                <label>Specialty</label>
                <select onchange="designerFilterSpecialty=this.value; go('designers');">
                    <option value="">All Specialties</option>
                    ${designerSpecialties.map(s => `<option value="${s}" ${designerFilterSpecialty===s?'selected':''}>${s}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Location</label>
                <input type="text" placeholder="City or country..." value="${designerFilterLocation}" onchange="designerFilterLocation=this.value; go('designers');">
            </div>
            <div class="filter-group">
                <label>Sort By</label>
                <select onchange="designerSortBy=this.value; go('designers');">
                    <option value="rating" ${designerSortBy==='rating'?'selected':''}>Highest Rated</option>
                    <option value="parts" ${designerSortBy==='parts'?'selected':''}>Most Projects</option>
                    <option value="rate" ${designerSortBy==='rate'?'selected':''}>Lowest Rate</option>
                </select>
            </div>
        </div>
        
        <div class="designers-results">
            <p class="results-count">${filtered.length} designer${filtered.length !== 1 ? 's' : ''} found</p>
            
            ${filtered.length ? `<div class="designers-grid-v6">
                ${filtered.map(d => designerCardHTML(d)).join('')}
            </div>` : validDesigners.length === 0 ? `<div class="empty-cta">
                <h3>No designers yet</h3>
                <p>Be the first to join as a designer! Create 5+ parts to unlock your designer profile.</p>
                ${currentUser ? `<a href="#" onclick="go('become-designer'); return false;" class="btn btn-lg btn-primary">Become a Designer</a>` : `<a href="#" onclick="go('signup'); return false;" class="btn btn-lg btn-primary">Sign Up</a>`}
            </div>` : `<div class="no-designers">
                <p>No designers match your filters.</p>
                <button class="btn btn-outline" onclick="designerFilterSpecialty='';designerFilterLocation='';go('designers');">Clear Filters</button>
            </div>`}
        </div>
    </div>`;
}

// v6.0: Designer card with full info
function designerCardHTML(d) {
    const rating = d.stats?.avgRating || 5;
    const reviewCount = d.stats?.reviewCount || 0;
    const partsCount = d.stats?.parts || 0;
    const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
    
    return `<div class="designer-card-v6" onclick="go('designer', ${d.id})">
        <div class="designer-card-header">
            <img src="${d.avatar_url}" alt="${d.name}" class="designer-avatar-lg" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff'">
            <div class="designer-card-title">
                <h3>${d.name}</h3>
                ${d.location ? `<span class="designer-location">Location: ${d.location}</span>` : ''}
                <div class="designer-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${rating.toFixed(1)} (${reviewCount} reviews)</span>
                </div>
            </div>
        </div>
        <p class="designer-bio">${d.bio ? (d.bio.length > 100 ? d.bio.substring(0, 100) + '...' : d.bio) : 'Experienced automotive 3D designer.'}</p>
        <div class="designer-tags">
            ${(d.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="designer-card-footer">
            <div class="designer-stats-row">
                <span class="stat">${partsCount} projects</span>
                ${d.equipment ? `<span class="stat">${d.equipment.split(',')[0]}</span>` : ''}
            </div>
            <div class="designer-rate-badge">${d.rate || 'Contact for rate'}</div>
        </div>
    </div>`;
}

function sellView() {
    if (!currentUser) {
        return `<div class="auth-prompt"><h2>Login Required</h2><p>You need to be logged in to sell parts.</p><a href="#" onclick="go('login'); return false;" class="btn btn-primary">Login</a> <a href="#" onclick="go('signup'); return false;" class="btn btn-outline">Sign Up</a></div>`;
    }
    
    // v7.4: Admins post for free
    const listingFee = isAdmin() ? 0 : 10;
    const feeDisplay = isAdmin() ? 'FREE' : '$10';
    
    return `<div class="sell-layout">
        <div class="sell-info"><h1>Sell your car parts</h1><p>Upload your designs, set your price, start earning.</p>
            ${isAdmin() ? '<div class="admin-free-badge">🛡️ Admin Account — Free Listings</div>' : ''}
            <div class="steps"><div class="step"><div class="step-num">1</div><div><h4>Upload files</h4><p>3D files + photos</p></div></div><div class="step"><div class="step-num">2</div><div><h4>Pay listing fee</h4><p>${isAdmin() ? 'FREE for admins' : 'One-time $10'}</p></div></div><div class="step"><div class="step-num">3</div><div><h4>Get paid</h4><p>Keep 100%</p></div></div></div>
            <div class="pricing"><div class="pricing-big">${feeDisplay}</div><div class="pricing-sub">${isAdmin() ? 'admin account' : 'one-time listing fee'}</div><ul><li>Keep 100% of sales</li><li>No monthly fees</li><li>No commission</li><li>Listing never expires</li></ul></div>
        </div>
        <div class="form"><h2>Create Listing</h2>
            <form onsubmit="handleCreateListing(event)">
            <div class="field">
                <label>Part Name <span class="char-limit" id="titleCharCount">0/${TITLE_MAX_LENGTH}</span></label>
                <input type="text" id="partTitle" placeholder="e.g., BMW E30 Phone Mount" required maxlength="${TITLE_MAX_LENGTH}" oninput="updateCharCount('partTitle', 'titleCharCount', ${TITLE_MAX_LENGTH})">
            </div>
            <div class="field">
                <label>Description <span class="char-limit" id="descCharCount">0/${DESC_MAX_LENGTH}</span></label>
                <textarea id="partDesc" rows="4" placeholder="Describe fitment, materials..." required maxlength="${DESC_MAX_LENGTH}" oninput="updateCharCount('partDesc', 'descCharCount', ${DESC_MAX_LENGTH})"></textarea>
            </div>
            <div class="field-row" id="makeModelRow"><div class="field"><label>Make</label><select id="partMake" required onchange="updatePartModels()">${carMakes.map(m => `<option>${m}</option>`).join('')}</select></div><div class="field" id="modelField"><label>Model</label><select id="partModel"><option>Select model...</option></select></div></div>
            <div class="field-row"><div class="field"><label>Category</label><select id="partCat" required>${categories.map(c => `<option>${c.name}</option>`).join('')}</select></div><div class="field"><label>Price (USD)</label><input type="number" id="partPrice" placeholder="4.99" min="0.99" step="0.01" required></div></div>
            <div class="field-row"><div class="field"><label>File Format</label><input type="text" id="partFormat" placeholder="STL, STEP"></div><div class="field"><label>Recommended Material</label><input type="text" id="partMaterial" placeholder="PLA, PETG, ABS"></div></div>
            <div class="field"><label>Infill % (recommended)</label><input type="text" id="partInfill" placeholder="25%"></div>
            <div class="field">
                <label>3D Files <span class="field-hint-inline">(Upload multiple files for a package)</span></label>
                <div class="files-upload-zone" onclick="document.getElementById('fileInput').click()">
                    <div class="dropzone-icon">+</div>
                    <p>Drop 3D files here or click to upload</p>
                    <span>STL, STEP, OBJ, 3MF • Multiple files allowed</span>
                </div>
                <input type="file" id="fileInput" hidden multiple accept=".stl,.step,.stp,.obj,.3mf" onchange="handleMultiFileSelect(event)">
                <div class="uploaded-files-list" id="uploadedFilesList"></div>
            </div>
            <div class="field"><label>Photos <span class="required-star">*</span> (First photo = thumbnail)</label><div class="photo-grid" id="photoGrid"><div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div></div><input type="file" id="photoInput" accept="image/*" multiple hidden onchange="handlePhotoUpload(event)"><p class="field-hint">At least 1 photo required</p></div>
            <div class="upsell-box"><label class="upsell-label"><input type="checkbox" id="featuredCheckbox" onchange="updateTotal()"><div class="upsell-content"><span class="upsell-badge">FEATURED</span><strong>Get Featured Placement +$20</strong><p>Your listing appears in the Featured section for 30 days.</p></div></label></div>
            <div class="ownership-checkbox">
                <label class="ownership-label">
                    <input type="checkbox" id="ownershipConfirm" required>
                    <span>I confirm that I have full ownership of this design and it is exclusively mine to sell. I have the right to distribute this file and it does not infringe on any copyrights or trademarks.</span>
                </label>
            </div>
            <div class="form-total"><span>Total</span><span id="totalPrice">${isAdmin() ? '$0.00' : '$10.00'}</span></div>
            <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Create Listing</button>
            </form>
        </div>
    </div>`;
}

function updatePartModels() {
    const make = document.getElementById('partMake')?.value;
    const modelSelect = document.getElementById('partModel');
    const modelField = document.getElementById('modelField');
    if (!modelSelect || !make) return;
    
    // Hide model field for Non-Specific
    if (make === 'Non-Specific') {
        if (modelField) modelField.style.display = 'none';
        modelSelect.value = 'Any';
        return;
    } else {
        if (modelField) modelField.style.display = 'block';
    }
    modelSelect.innerHTML = '<option>Select model...</option>';
    if (carModels[make]) carModels[make].forEach(m => { modelSelect.innerHTML += `<option value="${m}">${m}</option>`; });
}

// v5.1: Multiple 3D file upload support
let uploadedFiles = [];

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file type
        const validTypes = ['.stl', '.step', '.stp', '.obj', '.3mf'];
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (!validTypes.includes(ext)) {
            alert('Invalid file type. Please upload STL, STEP, OBJ, or 3MF files.');
            return;
        }
        uploadedFile = file;
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileName').classList.add('file-selected');
    }
}

// v5.1: Handle multiple 3D file uploads
function handleMultiFileSelect(e) {
    const validTypes = ['.stl', '.step', '.stp', '.obj', '.3mf'];
    
    for (const file of e.target.files) {
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (!validTypes.includes(ext)) {
            alert(`Invalid file type: ${file.name}. Only STL, STEP, OBJ, 3MF allowed.`);
            continue;
        }
        // Avoid duplicates
        if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            uploadedFiles.push(file);
        }
    }
    
    // Keep backward compatibility - first file is the "main" file
    if (uploadedFiles.length > 0) {
        uploadedFile = uploadedFiles[0];
    }
    
    renderUploadedFilesList();
}

function renderUploadedFilesList() {
    const container = document.getElementById('uploadedFilesList');
    if (!container) return;
    
    if (uploadedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <div class="uploaded-files-header">
            <span class="files-count">${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} in package</span>
        </div>
        <div class="uploaded-files-grid">
            ${uploadedFiles.map((f, i) => `
                <div class="uploaded-file-item">
                    <div class="file-icon">File</div>
                    <div class="file-info">
                        <span class="file-name">${truncateText(f.name, 30)}</span>
                        <span class="file-size">${(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button type="button" class="file-remove" onclick="removeUploadedFile(${i})">×</button>
                </div>
            `).join('')}
        </div>
    `;
}

function removeUploadedFile(index) {
    uploadedFiles.splice(index, 1);
    if (uploadedFiles.length > 0) {
        uploadedFile = uploadedFiles[0];
    } else {
        uploadedFile = null;
    }
    renderUploadedFilesList();
}

async function handleCreateListing(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    
    // Validate BOTH file and photos required
    // v5.1: Use uploadedFiles array for multi-file support
    const errors = [];
    if (uploadedFiles.length === 0 && !uploadedFile) errors.push({field: 'fileInput', msg: '3D file is required'});
    if (uploadedPhotoFiles.length === 0) errors.push({field: 'photoInput', msg: 'At least 1 photo is required'});
    
    if (errors.length > 0) {
        errors.forEach(err => {
            const field = document.getElementById(err.field);
            if (field && field.parentElement) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = err.msg;
                field.parentElement.appendChild(errorDiv);
            }
        });
        // Also show alert as backup
        alert('Missing required fields:\n\n' + errors.map(e => '• ' + e.msg).join('\n'));
        return;
    }
    
    const make = document.getElementById('partMake').value;
    const model = make === 'Non-Specific' ? 'Any' : document.getElementById('partModel').value;
    
    try {
        // Show upload progress
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        
        // v5.1: Upload all 3D files (package support)
        const filesToUpload = uploadedFiles.length > 0 ? uploadedFiles : (uploadedFile ? [uploadedFile] : []);
        const fileUrls = [];
        let totalSize = 0;
        
        for (let i = 0; i < filesToUpload.length; i++) {
            submitBtn.textContent = `Uploading 3D file ${i + 1}/${filesToUpload.length}...`;
            const file = filesToUpload[i];
            totalSize += file.size;
            
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            
            const fileRes = await fetch(`${API_URL}/api/upload/file`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: fileFormData
            });
            
            if (!fileRes.ok) {
                const errData = await fileRes.json().catch(() => ({}));
                throw new Error(errData.error || `Failed to upload ${file.name}`);
            }
            const fileData = await fileRes.json();
            fileUrls.push({ name: file.name, url: fileData.url, size: file.size });
        }
        
        // Primary file URL (first file for backward compatibility)
        const primaryFileUrl = fileUrls[0]?.url || null;
        
        // Upload photos to R2 (NOT as base64)
        submitBtn.textContent = `Uploading photos (0/${uploadedPhotoFiles.length})...`;
        const imageUrls = [];
        for (let i = 0; i < uploadedPhotoFiles.length; i++) {
            submitBtn.textContent = `Uploading photos (${i + 1}/${uploadedPhotoFiles.length})...`;
            const photoFormData = new FormData();
            photoFormData.append('file', uploadedPhotoFiles[i]);
            
            const photoRes = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: photoFormData
            });
            
            if (!photoRes.ok) {
                const errData = await photoRes.json().catch(() => ({}));
                throw new Error(errData.error || `Failed to upload photo ${i + 1}`);
            }
            const photoData = await photoRes.json();
            imageUrls.push(photoData.url);
        }
        
        submitBtn.textContent = 'Creating listing...';
        
        // v5.1: Calculate total size and formats
        const formats = [...new Set(filesToUpload.map(f => f.name.split('.').pop().toUpperCase()))].join(', ');
        
        const listing = {
            title: document.getElementById('partTitle').value,
            description: document.getElementById('partDesc').value,
            make: make,
            model: model,
            category: document.getElementById('partCat').value,
            price: parseFloat(document.getElementById('partPrice').value),
            file_format: document.getElementById('partFormat').value || formats,
            file_size: (totalSize / (1024 * 1024)).toFixed(2) + ' MB',
            file_url: primaryFileUrl,
            file_urls: fileUrls, // v5.1: All files in package
            material: document.getElementById('partMaterial').value,
            infill: document.getElementById('partInfill').value,
            featured: document.getElementById('featuredCheckbox').checked,
            images: imageUrls  // Now URLs, not base64!
        };
        
        const result = await api('/api/parts', {
            method: 'POST',
            body: JSON.stringify(listing)
        });
        
        // Clear uploaded data after successful creation
        uploadedPhotos = [];
        uploadedPhotoFiles = [];
        uploadedFile = null;
        uploadedFiles = [];
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        alert('Listing created! (Payment integration with Stripe coming soon)');
        go('dashboard');
    } catch (err) {
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Create Listing';
            submitBtn.disabled = false;
        }
        alert('Error: ' + err.message);
    }
}

function updateTotal() { 
    const baseFee = isAdmin() ? 0 : 10;
    const featuredFee = document.getElementById('featuredCheckbox')?.checked ? 20 : 0;
    const total = baseFee + featuredFee;
    document.getElementById('totalPrice').textContent = total === 0 ? '$0.00' : '$' + total.toFixed(2);
}

// FIX 7: Image editing support
let editImagesToRemove = [];
let editNewPhotos = [];
let editNewPhotoFiles = [];

async function editView(partId) {
    if (!currentUser) return '<div class="auth-prompt"><h2>Login Required</h2><a href="#" onclick="go(\'login\'); return false;" class="btn btn-primary">Login</a></div>';
    
    // Reset edit state
    editImagesToRemove = [];
    editNewPhotos = [];
    editNewPhotoFiles = [];
    
    let p;
    try { p = await api(`/api/parts/${partId}`); } catch (e) { return '<p>Part not found.</p>'; }
    if (!p || p.user_id !== currentUser.id) return '<p>Not authorized to edit this listing.</p>';
    
    // Store part data for later
    window.editPartData = p;
    
    return `<div class="sell-layout">
        <div class="sell-info"><h1>Edit Listing</h1><p>Update your part details and photos.</p></div>
        <div class="form"><h2>${p.title}</h2>
            <form onsubmit="handleEditListing(event, ${p.id})">
            <div class="field"><label>Part Name</label><input type="text" id="editTitle" value="${p.title}" required></div>
            <div class="field"><label>Description</label><textarea id="editDesc" rows="4" required>${p.description || ''}</textarea></div>
            <div class="field-row"><div class="field"><label>Category</label><select id="editCat" required>${categories.map(c => `<option ${p.category===c.name?'selected':''}>${c.name}</option>`).join('')}</select></div><div class="field"><label>Price (USD)</label><input type="number" id="editPrice" value="${p.price}" min="0.99" step="0.01" required></div></div>
            <div class="field-row"><div class="field"><label>Material</label><input type="text" id="editMaterial" value="${p.material || ''}"></div><div class="field"><label>Infill %</label><input type="text" id="editInfill" value="${p.infill || ''}"></div></div>
            
            <div class="field">
                <label>Current Photos</label>
                <div class="photo-grid" id="existingPhotos">
                    ${(p.images || []).map((img, i) => `
                        <div class="photo-item" id="existing-${p.image_ids ? p.image_ids[i] : i}" data-image-id="${p.image_ids ? p.image_ids[i] : i}">
                            <img src="${img}">
                            <button type="button" class="photo-remove" onclick="markImageForRemoval(${p.image_ids ? p.image_ids[i] : i})">×</button>
                        </div>
                    `).join('') || '<p class="empty-state">No photos</p>'}
                </div>
            </div>
            <div class="field">
                <label>Add More Photos</label>
                <div class="photo-grid" id="editPhotoGrid">
                    <div class="photo-add" onclick="document.getElementById('editPhotoInput').click()">
                        <span class="photo-add-icon">+</span><span>Add</span>
                    </div>
                </div>
                <input type="file" id="editPhotoInput" accept="image/*" multiple hidden onchange="handleEditPhotoUpload(event)">
            </div>
            
            <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Save Changes</button>
            <a href="#" onclick="go('part', ${p.id}); return false;" class="btn btn-lg btn-outline" style="width:100%;margin-top:10px;">Cancel</a>
            </form>
        </div>
    </div>`;
}

function markImageForRemoval(imageId) {
    editImagesToRemove.push(imageId);
    const el = document.getElementById(`existing-${imageId}`);
    if (el) el.remove();
}

function handleEditPhotoUpload(event) {
    for (let file of event.target.files) {
        if (editNewPhotos.length >= 10) break;
        editNewPhotoFiles.push(file);
        const reader = new FileReader();
        reader.onload = e => {
            editNewPhotos.push(e.target.result);
            renderEditPhotoGrid();
        };
        reader.readAsDataURL(file);
    }
}

function renderEditPhotoGrid() {
    const grid = document.getElementById('editPhotoGrid');
    if (!grid) return;
    grid.innerHTML = editNewPhotos.map((photo, i) => `
        <div class="photo-item">
            <img src="${photo}">
            <button type="button" class="photo-remove" onclick="removeEditPhoto(${i})">×</button>
        </div>
    `).join('') + `
        <div class="photo-add" onclick="document.getElementById('editPhotoInput').click()">
            <span class="photo-add-icon">+</span><span>Add</span>
        </div>
    `;
}

function removeEditPhoto(index) {
    editNewPhotos.splice(index, 1);
    editNewPhotoFiles.splice(index, 1);
    renderEditPhotoGrid();
}

async function handleEditListing(e, partId) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;
    
    try {
        // Upload new photos first
        const newImageUrls = [];
        for (let i = 0; i < editNewPhotoFiles.length; i++) {
            btn.textContent = `Uploading photo ${i + 1}/${editNewPhotoFiles.length}...`;
            const photoFormData = new FormData();
            photoFormData.append('file', editNewPhotoFiles[i]);
            
            const photoRes = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: photoFormData
            });
            
            if (photoRes.ok) {
                const photoData = await photoRes.json();
                newImageUrls.push(photoData.url);
            }
        }
        
        btn.textContent = 'Saving...';
        
        await api(`/api/parts/${partId}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDesc').value,
                category: document.getElementById('editCat').value,
                price: parseFloat(document.getElementById('editPrice').value),
                material: document.getElementById('editMaterial').value,
                infill: document.getElementById('editInfill').value,
                remove_images: editImagesToRemove,
                add_images: newImageUrls
            })
        });
        
        alert('Listing updated!');
        go('part', partId);
    } catch (err) {
        alert('Error: ' + err.message);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function handleDeletePart(partId) {
    if (!confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
    try {
        await api(`/api/parts/${partId}`, { method: 'DELETE' });
        alert('Listing deleted.');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function partView(id) {
    // Always try API first to get real data, then fall back to demo
    let p = null;
    try { 
        p = await api(`/api/parts/${id}`); 
    } catch (e) { 
        // API failed, check demo data
        p = parts.find(x => x.id === id);
    }
    if (!p) return '<p>Part not found.</p>';
    
    // Store for 3D viewer
    currentPartData = p;
    
    // v7.4: Dynamic title for part pages
    document.title = `${p.title} — ForgAuto`;
    
    const images = p.images || [p.img] || ['https://via.placeholder.com/600x450'];
    const reviews = p.reviews || [];
    
    // v7.4: Sanitize all user-generated content
    const safeTitle = sanitize(p.title);
    const safeDescription = sanitize(p.description || 'No description provided.');
    const safeSellerName = sanitize(p.seller_name || 'Seller');
    const safeMake = sanitize(p.make);
    const safeModel = sanitize(p.model);
    const safeCategory = sanitize(p.category);
    const safeMaterial = sanitize(p.material || 'PLA');
    const safeInfill = sanitize(p.infill || '25%');
    const safeFileFormat = sanitize(p.file_format || 'STL');
    const safeFileSize = sanitize(p.file_size || 'N/A');
    
    // v7.1: Calculate actual seller rating from reviews (not hardcoded!)
    const actualRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length)
        : (p.seller_rating || 0);
    const displayRating = actualRating > 0 ? actualRating : null;
    
    // FIX 13: Show 3D viewer + images together like Thingiverse
    const hasFile = !!p.file_url;
    
    // v6.10: Mobile-first layout with title at top
    const canReview = p.purchased || (currentUser && currentUser.id === p.user_id);
    const hasReviewed = p.user_reviewed || false;
    
    return `<div class="detail">
        <!-- Mobile header: Title, seller shown first on mobile -->
        <div class="detail-mobile-header">
            ${p.featured ? '<span class="detail-featured-badge">Featured</span>' : ''}
            <h1>${p.title}</h1>
            <div class="detail-seller"><span class="seller-avatar">${p.seller_avatar_url ? `<img src="${p.seller_avatar_url}" alt="${p.seller_name}">` : (p.seller_name||'S').charAt(0)}</span><span>by <strong>${p.seller_name || 'Seller'}</strong>${displayRating ? ` <span class="seller-rating">${'★'.repeat(Math.floor(displayRating))}${displayRating % 1 >= 0.5 ? '½' : ''} (${displayRating.toFixed(1)})</span>` : ''}</span></div>
        </div>
        
        <div class="detail-left">
            <div class="detail-gallery">
                <div class="viewer-container" id="viewer3d"></div>
                <div class="gallery-thumbs">
                    ${hasFile ? `<button class="thumb-3d active" onclick="show3DViewer(0)" data-file-index="0">3D${p.file_urls && p.file_urls.length > 1 ? ' 1' : ''}</button>` : ''}
                    ${p.file_urls && p.file_urls.length > 1 ? p.file_urls.slice(1).map((f, i) => `<button class="thumb-3d" onclick="show3DViewer(${i+1})" data-file-index="${i+1}">3D ${i+2}</button>`).join('') : ''}
                    ${images.map((img, i) => `<img src="${img}" alt="${p.title}" class="thumb" loading="lazy" onclick="showGalleryImage('${img}', this)">`).join('')}
                </div>
            </div>
            
            <!-- Mobile actions: Description, Price, Buttons (shown on mobile after gallery) -->
            <div class="detail-mobile-actions">
                <div class="detail-desc"><h2>Description</h2><p>${p.description || 'No description provided.'}</p></div>
                <div class="detail-price">$${(p.price || 0).toFixed(2)}</div>
                <div class="detail-actions">
                    ${p.purchased || (currentUser && currentUser.id === p.user_id) ? 
                        (p.file_urls && p.file_urls.length > 1 ? 
                            `<button class="btn btn-lg btn-primary" onclick="downloadPackageZip(${p.id}, '${(p.title || 'part').replace(/'/g, "\\'")}')">Download All (${p.file_urls.length} files)</button>` :
                            `<a href="${p.file_url}" download class="btn btn-lg btn-primary">Download File</a>`) :
                        `<button class="btn btn-lg btn-primary" onclick="handleBuyPart(${p.id})">Buy Now - $${(p.price || 0).toFixed(2)}</button>`}
                    <button class="btn btn-lg btn-outline" onclick="openContactModal(${p.user_id}, '${(p.seller_name || 'Seller').replace(/'/g, "\\'")}', '${(p.title || '').replace(/'/g, "\\'")}', ${p.id}, '${(p.images && p.images[0] || '').replace(/'/g, "\\'")}')">Contact Seller</button>
                </div>
                <button class="btn btn-outline btn-contact-seller" onclick="openContactModal(${p.user_id}, '${(p.seller_name || 'Seller').replace(/'/g, "\\'")}', '${(p.title || '').replace(/'/g, "\\'")}', ${p.id}, '${(p.images && p.images[0] || '').replace(/'/g, "\\'")}')">
                    Contact Seller
                </button>
                <button class="btn btn-outline btn-quote-request" onclick="openQuoteRequestModal(${p.id}, '${(p.title || '').replace(/'/g, "\\'")}', '${(p.images && p.images[0] || '').replace(/'/g, "\\'")}')">
                    Request Print Quotes
                </button>
            </div>
            
            <!-- Desktop description (hidden on mobile) -->
            <div class="detail-desc detail-desc-desktop"><h2>Description</h2><p>${p.description || 'No description provided.'}</p></div>
            <div class="specs"><h2>Specifications</h2><div class="spec-row"><span>Vehicle</span><span>${p.make} ${p.model}</span></div><div class="spec-row"><span>Category</span><span>${p.category}</span></div><div class="spec-row"><span>Format</span><span>${p.file_format || 'STL'}</span></div><div class="spec-row"><span>File Size</span><span>${p.file_size || 'N/A'}</span></div><div class="spec-row"><span>Material</span><span>${p.material || 'PLA'}</span></div><div class="spec-row"><span>Infill</span><span>${p.infill || '25%'}</span></div></div>
            ${reviews.length ? `<div class="reviews-section"><h2>Reviews (${reviews.length})</h2>${reviews.map(r => `<div class="review"><div class="review-header"><strong>${sanitize(r.reviewer_name)}</strong><span class="review-rating">${'★'.repeat(r.rating)} (${r.rating}/5)</span></div><p>${sanitize(r.comment || '')}</p></div>`).join('')}</div>` : ''}
            ${canReview && !hasReviewed ? `<div class="write-review"><h3>Write a Review</h3><form onsubmit="handleReview(event, ${p.id})"><div class="field"><label>Rating</label><select id="reviewRating"><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Terrible</option></select></div><div class="field"><label>Comment</label><textarea id="reviewComment" rows="3" placeholder="Share your experience..."></textarea></div><button type="submit" class="btn btn-primary">Submit Review</button></form></div>` : ''}
            ${canReview && hasReviewed ? `<div class="already-reviewed"><p>✓ You've already reviewed this part</p></div>` : ''}
            ${currentUser && !canReview ? `<div class="review-locked"><p>📦 Purchase this part to leave a review</p></div>` : ''}
        </div>
        <div class="detail-right">
            ${p.featured ? '<span class="detail-featured-badge">Featured</span>' : ''}
            <div class="detail-breadcrumb">${p.make} / ${p.model} / ${p.category}</div>
            <h1>${p.title}</h1>
            <div class="detail-seller"><span class="seller-avatar">${p.seller_avatar_url ? `<img src="${p.seller_avatar_url}" alt="${p.seller_name}">` : (p.seller_name||'S').charAt(0)}</span><span>by <strong>${p.seller_name || 'Seller'}</strong>${displayRating ? ` <span class="seller-rating">${'★'.repeat(Math.floor(displayRating))}${displayRating % 1 >= 0.5 ? '½' : ''} (${displayRating.toFixed(1)})</span>` : ''}</span><span class="detail-downloads">${p.downloads || 0} downloads</span></div>
            <div class="detail-price">$${(p.price || 0).toFixed(2)}</div>
            <div class="detail-trust"><span>Secure Payment</span><span>Instant Download</span><span>$10 Listing Fee</span></div>
            <div class="detail-actions">
                ${p.purchased || (currentUser && currentUser.id === p.user_id) ? 
                    (p.file_urls && p.file_urls.length > 1 ? 
                        `<button class="btn btn-lg btn-primary" onclick="downloadPackageZip(${p.id}, '${(p.title || 'part').replace(/'/g, "\\'")}')">Download All (${p.file_urls.length} files)</button>` :
                        `<a href="${p.file_url}" download class="btn btn-lg btn-primary">Download File</a>`) :
                    `<button class="btn btn-lg btn-primary" onclick="handleBuyPart(${p.id})">Buy Now - $${(p.price || 0).toFixed(2)}</button>`}
                <button class="btn btn-lg btn-outline" onclick="openContactModal(${p.user_id}, '${(p.seller_name || 'Seller').replace(/'/g, "\\'")}', '${(p.title || '').replace(/'/g, "\\'")}', ${p.id}, '${(p.images && p.images[0] || '').replace(/'/g, "\\'")}')">Contact Seller</button>
            </div>
            ${p.file_urls && p.file_urls.length > 1 ? `
            <div class="package-files-section">
                <h3>Package Contents (${p.file_urls.length} files)</h3>
                <div class="package-files-list">
                    ${p.file_urls.map((f, i) => `
                        <div class="package-file-item">
                            <span class="package-file-icon">File</span>
                            <span class="package-file-name">${f.name}</span>
                            <span class="package-file-size">${(f.size / 1024).toFixed(1)} KB</span>
                            ${p.purchased || (currentUser && currentUser.id === p.user_id) ? 
                                `<a href="${f.url}" download class="package-file-download">↓</a>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
            ${currentUser && (currentUser.id === p.user_id || isAdmin()) ? `
            <div class="owner-actions">
                <button class="btn btn-outline" onclick="go('edit', ${p.id})">Edit Listing</button>
                <button class="btn btn-outline btn-danger" onclick="handleDeletePart(${p.id})">Delete</button>
                ${isAdmin() && currentUser.id !== p.user_id ? '<span class="admin-action-badge">Admin Action</span>' : ''}
            </div>` : ''}
            ${currentUser && currentUser.id === p.user_id && !p.premiered ? `
            <div class="boost-cta">
                <div class="boost-header">
                    <strong>Boost Your Listing</strong>
                    <span>Get more visibility in the Featured section</span>
                </div>
                <button class="btn btn-boost" onclick="handleBoostPart(${p.id})">Make Featured - $20</button>
            </div>` : ''}
            ${p.premiered ? '<div class="featured-status">This listing is Featured until ' + new Date(p.premiered_until).toLocaleDateString() + '</div>' : ''}
            <div class="print-ship-cta">
                <div class="print-ship-header">
                    <div class="print-ship-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></div>
                    <div>
                        <strong>Need it printed?</strong>
                        <span>Get quotes from professional print shops</span>
                    </div>
                </div>
                <div class="print-ship-options">
                    <button class="btn btn-primary" onclick="openQuoteRequestModal(${p.id}, '${(p.title || '').replace(/'/g, "\\'")}', '${(p.images && p.images[0] || '').replace(/'/g, "\\'")}')">
                        Request Print Quotes
                    </button>
                    <button class="btn btn-outline" onclick="go('printshops', ${p.id})">
                        Browse Print Shops
                    </button>
                </div>
            </div>
            ${currentUser && currentUser.id !== p.user_id ? `
            <button class="report-btn" onclick="openReportModal('part', ${p.id})" title="Report this listing">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                Report
            </button>` : ''}
        </div>
    </div>
    <div class="section"><div class="section-head"><h2>Similar Parts</h2></div><div class="grid">${filterPublicParts(parts).filter(x => x.id !== p.id && (x.make === p.make || x.category === p.category)).slice(0, 4).map(cardHTML).join('')}</div></div>
    <div id="lightbox" class="lightbox" onclick="closeLightbox()"><button class="lightbox-close" onclick="closeLightbox()">x</button><img id="lightboxImg" src="" alt="Zoomed image"></div>`;
}

async function handleBuyPart(partId) {
    if (!currentUser) { 
        alert('Please login to purchase and download parts.'); 
        go('login'); 
        return; 
    }
    
    try {
        // v7.5: Use Stripe checkout for purchases
        const result = await api('/api/stripe/checkout/purchase', { 
            method: 'POST',
            body: JSON.stringify({ part_id: partId })
        });
        
        if (result && result.url) {
            // Redirect to Stripe checkout
            window.location.href = result.url;
        } else if (result && result.purchased) {
            // Already purchased - show download
            alert('You already own this part! Refreshing page...');
            go('part', partId);
        } else if (result && result.error) {
            // Handle specific errors
            if (result.error.includes('Seller has not connected Stripe')) {
                alert('This seller has not set up payments yet. Please contact them directly.');
            } else if (result.error.includes('Cannot buy your own part')) {
                alert('You cannot buy your own listing.');
            } else {
                alert('Error: ' + result.error);
            }
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// v5.0: Download modal with actual download + email notification
function showDownloadModal(purchaseResult) {
    const modal = document.createElement('div');
    modal.id = 'downloadModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box download-modal">
            <button class="modal-close" onclick="closeDownloadModal()">×</button>
            <div class="download-success-icon">✓</div>
            <h2>Purchase Complete!</h2>
            <p class="download-subtitle">Your file is ready to download</p>
            
            <div class="download-file-info">
                <div class="download-file-icon">STL</div>
                <div class="download-file-details">
                    <strong>${purchaseResult.part_title || 'Part File'}</strong>
                    <span>${purchaseResult.file_format || 'STL'} • ${purchaseResult.file_size || 'N/A'}</span>
                </div>
            </div>
            
            <a href="${purchaseResult.download_url || purchaseResult.file_url}" download class="btn btn-lg btn-primary download-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download File
            </a>
            
            <div class="download-email-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>A download link has also been sent to <strong>${currentUser.email}</strong></span>
            </div>
            
            <div class="download-actions">
                <button onclick="closeDownloadModal(); go('part', ${purchaseResult.part_id});" class="btn btn-outline">Leave a Review</button>
                <button onclick="closeDownloadModal();" class="btn btn-outline">Close</button>
            </div>
            
            <p class="download-note">Stripe payment integration coming soon. Currently free for testing.</p>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) modal.remove();
}

// v5.1: Download all files as ZIP
async function downloadPackageZip(partId, partTitle) {
    if (typeof JSZip === 'undefined') {
        alert('ZIP library not loaded. Please refresh the page.');
        return;
    }
    
    // Get part data
    let p;
    try {
        p = await api(`/api/parts/${partId}`);
    } catch (e) {
        alert('Error loading part data');
        return;
    }
    
    if (!p.file_urls || p.file_urls.length === 0) {
        alert('No files to download');
        return;
    }
    
    // Show progress modal
    const modal = document.createElement('div');
    modal.id = 'zipProgressModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box" style="text-align:center;">
            <h2>Creating ZIP Package</h2>
            <p id="zipProgress">Downloading file 1 of ${p.file_urls.length}...</p>
            <div class="zip-progress-bar"><div class="zip-progress-fill" id="zipProgressBar" style="width:0%"></div></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    try {
        const zip = new JSZip();
        
        for (let i = 0; i < p.file_urls.length; i++) {
            const file = p.file_urls[i];
            document.getElementById('zipProgress').textContent = `Downloading file ${i + 1} of ${p.file_urls.length}: ${file.name}`;
            document.getElementById('zipProgressBar').style.width = `${((i + 1) / p.file_urls.length) * 80}%`;
            
            const response = await fetch(file.url);
            const blob = await response.blob();
            zip.file(file.name, blob);
        }
        
        document.getElementById('zipProgress').textContent = 'Creating ZIP file...';
        document.getElementById('zipProgressBar').style.width = '90%';
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        document.getElementById('zipProgressBar').style.width = '100%';
        
        // Download the ZIP
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${partTitle.replace(/[^a-z0-9]/gi, '_')}_package.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        modal.remove();
    } catch (err) {
        modal.remove();
        alert('Error creating ZIP: ' + err.message);
    }
}

async function handleBoostPart(partId) {
    if (!currentUser) { alert('Please login first'); go('login'); return; }
    
    if (!confirm('Make this listing Featured for $20?\n\nYour part will appear in the Featured section for 30 days, then returns to a regular listing.')) {
        return;
    }
    
    try {
        await api(`/api/parts/${partId}/boost`, { method: 'POST' });
        alert('Listing boosted! Your part will now appear in the Featured section for 30 days. (Payment via Stripe coming soon)');
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

async function printShopsView(partId) {
    // v7.4: Fetch real print shops from API - no more fake demo data
    let shops = [];
    try {
        shops = await api('/api/printshops');
    } catch (e) {
        shops = [];
    }
    
    const part = partId ? parts.find(x => x.id === partId) : null;
    if (!part && partId) {
        try {
            const fetchedPart = await api(`/api/parts/${partId}`);
            if (fetchedPart) parts.push(fetchedPart);
        } catch (e) {}
    }
    const currentPart = partId ? parts.find(x => x.id === partId) : null;
    
    return `<div class="printshops-page">
        <div class="printshops-header">
            <h1>Find a Print Shop</h1>
            <p>Get your parts professionally printed and shipped to you</p>
        </div>
        
        ${currentPart ? `
        <div class="selected-part-banner">
            <img src="${currentPart.images?.[0] || ''}" alt="${currentPart.title}">
            <div class="selected-part-info">
                <strong>${currentPart.title}</strong>
                <span>${currentPart.make} ${currentPart.model} · ${currentPart.file_format || 'STL'} · ${currentPart.file_size || 'N/A'}</span>
            </div>
            <span class="banner-hint">Select a print shop below to request a quote</span>
        </div>
        ` : ''}
        
        <div class="location-search">
            <input type="text" id="locationInput" placeholder="Enter your city or zip code...">
            <button class="btn" onclick="searchPrintShops()">Search</button>
            <button class="btn btn-outline" onclick="useMyLocation()">Use My Location</button>
        </div>
        
        ${shops.length === 0 ? `
            <div class="no-shops-cta">
                <h3>No print shops yet</h3>
                <p>Are you a 3D printing service? Be the first to register!</p>
                <a href="#" onclick="goToShopSignup(); return false;" class="btn btn-primary" style="color: white !important;">Register as a Print Shop</a>
            </div>
        ` : `
            <div class="print-shops-grid">
                ${shops.map(shop => `
                    <div class="print-shop-card-v2 ${shop.verified ? 'verified' : ''}">
                        <div class="shop-card-header">
                            ${shop.logo_url ? `<img src="${shop.logo_url}" alt="${shop.shop_name}" class="shop-logo">` : `<div class="shop-logo-placeholder">PS</div>`}
                            <div class="shop-card-title">
                                <h3>${shop.shop_name} ${shop.verified ? '<span class="verified-star" title="Verified Print Shop">★</span>' : ''}</h3>
                                <div class="shop-rating">
                                    ${'★'.repeat(Math.floor(shop.avg_rating || 0))}${'☆'.repeat(5 - Math.floor(shop.avg_rating || 0))}
                                    <span>${(shop.avg_rating || 0).toFixed(1)} (${shop.review_count || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                        
                        <p class="shop-address">📍 ${shop.city || ''}${shop.state ? ` (${shop.state})` : ''}${shop.country ? `, ${shop.country}` : (shop.address || 'Location not specified')}</p>
                        
                        <div class="shop-tags">
                            ${(shop.technologies || []).map(t => `<span class="tag tech-tag">${t}</span>`).join('')}
                            ${(shop.services || []).map(s => `<span class="tag service-tag">${s}</span>`).join('')}
                        </div>
                        
                        ${shop.build_size ? `<div class="shop-spec"><span>Max Build:</span> ${shop.build_size}</div>` : ''}
                        ${shop.turnaround ? `<div class="shop-spec"><span>Turnaround:</span> ${shop.turnaround}</div>` : ''}
                        
                        <div class="shop-card-actions">
                            <a href="tel:${shop.phone}" class="btn btn-sm btn-outline">Call</a>
                            <a href="mailto:${shop.email || ''}${currentPart ? `?subject=Quote Request: ${currentPart.title}` : ''}" class="btn btn-sm btn-outline">Email</a>
                            ${currentPart ? `
                                <button class="btn btn-sm btn-primary" onclick="openQuoteRequestModal(${currentPart.id}, '${(currentPart.title || '').replace(/'/g, "\\'")}', '${(currentPart.images?.[0] || '').replace(/'/g, "\\'")}', ${shop.id}, '${(shop.shop_name || '').replace(/'/g, "\\'")}')">
                                    Request Quote
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-primary" onclick="showShopPopup(${shop.id})">View Shop</button>
                            `}
                        </div>
                        
                        ${shop.isDemo ? '<div class="demo-badge">Sample Data</div>' : ''}
                    </div>
                `).join('')}
            </div>
        `}
        
        <div class="printshop-register-cta">
            <h3>Own a 3D Printing Business?</h3>
            <p>Register your shop and start receiving quote requests from customers.</p>
            <a href="#" onclick="goToShopSignup(); return false;" class="btn btn-outline" style="color: white; border-color: white;">Register as a Print Shop</a>
        </div>
    </div>`;
}

function searchPrintShops() {
    const location = document.getElementById('locationInput')?.value;
    if (location) {
        alert(`Search for print shops near "${location}" coming soon!`);
    }
}

function useMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => alert(`Location detected! Finding shops near you... (Coming soon)`),
            err => alert('Could not get your location. Please enter it manually.')
        );
    } else {
        alert('Geolocation not supported. Please enter your location manually.');
    }
}

// Go to signup with print shop role pre-selected
function goToShopSignup() {
    if (currentUser) {
        alert('You are already logged in. To register a print shop, please log out first or create a new account.');
        return;
    }
    go('signup');
    // Wait for page to render, then auto-select print shop
    setTimeout(() => {
        if (typeof selectSignupRole === 'function') {
            selectSignupRole('printshop');
        }
    }, 100);
}

// Pay for a received quote
async function payForQuote(quoteId, amount) {
    if (!confirm(`Proceed to pay $${amount.toFixed(2)} for this print job?\n\n(Stripe payment integration coming soon - this will mark the quote as accepted)`)) {
        return;
    }
    
    try {
        await api(`/api/quotes/${quoteId}/accept`, { method: 'POST' });
        alert('Quote accepted! The print shop will begin your order. (Payment via Stripe coming soon)');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Update quote total based on payment option selection
function updateQuoteTotal(quoteId, servicePrice, filePrice) {
    const serviceOnly = document.querySelector(`input[name="paymentType_${quoteId}"][value="service_only"]`);
    const totalEl = document.getElementById(`quoteTotal_${quoteId}`);
    if (!totalEl) return;
    
    if (serviceOnly && serviceOnly.checked) {
        totalEl.textContent = `$${servicePrice.toFixed(2)}`;
    } else {
        totalEl.textContent = `$${(servicePrice + filePrice).toFixed(2)}`;
    }
}

// Pay for quote with service+file or service only options
async function payForQuoteWithOptions(quoteId, servicePrice, filePrice, partId) {
    const serviceAndFile = document.querySelector(`input[name="paymentType_${quoteId}"][value="service_and_file"]`);
    const includeFile = serviceAndFile && serviceAndFile.checked;
    const total = includeFile ? (servicePrice + filePrice) : servicePrice;
    
    const optionText = includeFile ? 'Print Service + File Purchase' : 'Print Service Only';
    
    if (!confirm(`Proceed to pay $${total.toFixed(2)} for ${optionText}?\n\n(Stripe payment integration coming soon)`)) {
        return;
    }
    
    try {
        await api(`/api/quotes/${quoteId}/accept`, { 
            method: 'POST',
            body: JSON.stringify({ 
                include_file: includeFile,
                total_paid: total,
                part_id: partId
            })
        });
        alert(`Quote accepted! ${includeFile ? 'File purchased and ' : ''}The print shop will begin your order.`);
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Handle file upload for accepted quotes (print service only)
async function handleQuoteFileUpload(e, quoteId) {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['.stl', '.step', '.stp', '.obj', '.3mf'];
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!validTypes.includes(ext)) {
        alert('Invalid file type. Please upload STL, STEP, OBJ, or 3MF files.');
        return;
    }
    
    const fileNameEl = document.getElementById(`quoteFileName_${quoteId}`);
    if (fileNameEl) fileNameEl.textContent = `Uploading ${file.name}...`;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${API_URL}/api/quotes/${quoteId}/upload-file`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Upload failed');
        }
        
        if (fileNameEl) fileNameEl.textContent = `✓ ${file.name} uploaded`;
        alert('File uploaded successfully! The print shop can now access it.');
    } catch (err) {
        if (fileNameEl) fileNameEl.textContent = 'Upload failed - click to try again';
        alert('Error uploading file: ' + err.message);
    }
}

// Customer selects "Pay at Shop" option
async function selectPayAtShop(quoteId) {
    if (!confirm('You\'ve chosen to pay at the shop in person.\n\nThe print shop will be notified and will mark your order as paid when you visit.\n\nContinue?')) {
        return;
    }
    
    try {
        await api(`/api/quotes/${quoteId}/pay-at-shop`, { method: 'POST' });
        alert('The print shop has been notified that you will pay in person. They will contact you with details.');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Print shop marks quote as paid at shop
function openMarkPaidModal(quoteId, quotedPrice, customerName) {
    const modal = document.createElement('div');
    modal.id = 'markPaidModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeMarkPaidModal()">×</button>
            <h2>Mark as Paid at Shop</h2>
            <p>Customer: <strong>${customerName}</strong></p>
            <form onsubmit="submitMarkPaid(event, ${quoteId})">
                <div class="field">
                    <label>Amount Received ($)</label>
                    <input type="number" id="paidAmount" step="0.01" min="0" value="${quotedPrice.toFixed(2)}" required>
                </div>
                <div class="field">
                    <label>Payment Method</label>
                    <select id="paymentMethod">
                        <option value="cash">Cash</option>
                        <option value="card">Card at Shop</option>
                        <option value="transfer">Bank Transfer</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="field">
                    <label>Notes (optional)</label>
                    <textarea id="paymentNotes" rows="2" placeholder="Any notes about the payment..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Confirm Payment Received</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeMarkPaidModal() {
    const modal = document.getElementById('markPaidModal');
    if (modal) modal.remove();
}

async function submitMarkPaid(e, quoteId) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('paidAmount').value);
    const method = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('paymentNotes').value;
    
    try {
        await api(`/api/quotes/${quoteId}/mark-paid`, {
            method: 'POST',
            body: JSON.stringify({ amount, method, notes })
        });
        closeMarkPaidModal();
        alert('Payment recorded! Both you and the customer will receive a receipt.');
        go('dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Download quote receipt as PDF
async function downloadQuoteReceipt(quoteId) {
    try {
        // Fetch quote details
        const quote = await api(`/api/quotes/${quoteId}`);
        
        // Generate PDF receipt
        const receiptHTML = `
            <html>
            <head>
                <title>ForgAuto Receipt #${quoteId}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .header p { margin: 5px 0; color: #666; }
                    .details { margin: 20px 0; }
                    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                    .row strong { font-weight: 600; }
                    .total { font-size: 20px; margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; }
                    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ForgAuto</h1>
                    <p>3D Print Service Receipt</p>
                    <p>Receipt #${quoteId}</p>
                </div>
                <div class="details">
                    <div class="row"><span>Date:</span><strong>${new Date(quote.paid_at || quote.updated_at).toLocaleDateString()}</strong></div>
                    <div class="row"><span>Customer:</span><strong>${quote.customer_name}</strong></div>
                    <div class="row"><span>Print Shop:</span><strong>${quote.shop_name}</strong></div>
                    <div class="row"><span>Part:</span><strong>${quote.part_title || 'Custom Print'}</strong></div>
                    <div class="row"><span>Material:</span><strong>${quote.material || 'Standard'}</strong></div>
                    <div class="row"><span>Quantity:</span><strong>${quote.quantity || 1}</strong></div>
                    ${quote.payment_method ? `<div class="row"><span>Payment Method:</span><strong>${quote.payment_method}</strong></div>` : ''}
                </div>
                <div class="total">
                    <div class="row"><span>Total Paid:</span><strong>$${(quote.total_paid || quote.quoted_price || 0).toFixed(2)}</strong></div>
                </div>
                <div class="footer">
                    <p>Thank you for using ForgAuto!</p>
                    <p>https://forgauto.com</p>
                </div>
            </body>
            </html>
        `;
        
        // Open in new window for printing/saving
        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.print();
    } catch (err) {
        alert('Error generating receipt: ' + err.message);
    }
}

// Message a print shop
function messageShop(shopId, shopName) {
    if (!currentUser) {
        alert('Please login to send messages');
        go('login');
        return;
    }
    go('conversation', shopId);
}

// v6.0: Full resume-style designer profile
async function designerView(id) {
    let d = designers.find(x => x.id === id);
    if (!d) {
        try { d = await api(`/api/users/${id}`); } catch (e) { return '<p>Designer not found.</p>'; }
    }
    if (!d) return '<p>Designer not found.</p>';
    
    // Get designer's parts/portfolio
    let designerParts = [];
    try { designerParts = await api(`/api/parts?user=${id}`); } catch (e) {}
    const validParts = designerParts.filter(p => p.images && p.images.length > 0).slice(0, 6);
    
    // Get reviews
    let reviews = d.reviews || [];
    
    const rating = d.stats?.avgRating || 5;
    const reviewCount = d.stats?.reviewCount || 0;
    const partsCount = d.stats?.parts || validParts.length || 0;
    const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
    
    return `<div class="designer-profile-v6">
        <div class="designer-profile-header">
            <div class="designer-profile-main">
                <img src="${d.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(d.name) + '&background=2563eb&color=fff'}" alt="${d.name}" class="designer-avatar-xl">
                <div class="designer-profile-info">
                    <h1>${d.name}</h1>
                    ${d.location ? `<p class="designer-location-lg">Location: ${d.location}</p>` : ''}
                    <div class="designer-rating-lg">
                        <span class="stars-lg">${stars}</span>
                        <span>${rating.toFixed(1)} rating · ${reviewCount} reviews · ${partsCount} projects</span>
                    </div>
                    <div class="designer-specialties">
                        ${(d.tags || []).map(t => `<span class="specialty-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="designer-profile-cta">
                <div class="rate-display">
                    <span class="rate-label">Rate</span>
                    <span class="rate-value">${d.rate || 'Contact for quote'}</span>
                    ${d.project_rate ? `<span class="rate-alt">or ${d.project_rate}/project</span>` : ''}
                </div>
                <button class="btn btn-lg btn-primary" onclick="openDesignerContact(${d.id}, '${(d.name || '').replace(/'/g, "\\'")}')">Contact Designer</button>
                <button class="btn btn-lg btn-outline" onclick="document.getElementById('requestForm').scrollIntoView({behavior:'smooth'})">Request Quote</button>
            </div>
        </div>
        
        <div class="designer-profile-body">
            <div class="designer-profile-left">
                <section class="profile-section">
                    <h2>About</h2>
                    <p>${d.bio || 'Experienced automotive 3D designer specializing in custom parts and modifications.'}</p>
                </section>
                
                ${d.experience ? `<section class="profile-section">
                    <h2>Experience</h2>
                    <p>${d.experience}</p>
                </section>` : ''}
                
                <section class="profile-section">
                    <h2>Equipment & Software</h2>
                    <div class="equipment-list">
                        ${(d.equipment || 'Fusion 360, SolidWorks, Bambu Lab X1C').split(',').map(e => `<span class="equipment-item">✓ ${e.trim()}</span>`).join('')}
                    </div>
                </section>
                
                <section class="profile-section">
                    <h2>Services Offered</h2>
                    <div class="services-grid">
                        ${(d.services || ['CAD Modeling', '3D Scanning', 'Prototyping', 'Reverse Engineering']).map(s => typeof s === 'string' ? s : s.name).map(s => `
                            <div class="service-item">
                                <span class="service-icon">${getServiceIcon(s)}</span>
                                <span class="service-name">${s}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>
                
                ${validParts.length ? `<section class="profile-section">
                    <h2>Portfolio (${partsCount} projects)</h2>
                    <div class="portfolio-grid-v6">
                        ${validParts.map(p => `
                            <div class="portfolio-item-v6" onclick="go('part', ${p.id})">
                                <img src="${p.images[0]}" alt="${p.title}">
                                <div class="portfolio-overlay">
                                    <span>${truncateText(p.title, 30)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${partsCount > 6 ? `<a href="#" onclick="go('profile', ${d.id}); return false;" class="btn btn-outline btn-sm">View All ${partsCount} Projects</a>` : ''}
                </section>` : ''}
                
                <section class="profile-section" id="requestForm">
                    <h2>Request a Custom Part</h2>
                    <form onsubmit="handleDesignerRequest(event, ${d.id})" class="request-form-v6">
                        <div class="field-row">
                            <div class="field"><label>Your Name</label><input type="text" id="reqName" required></div>
                            <div class="field"><label>Your Email</label><input type="email" id="reqEmail" required></div>
                        </div>
                        <div class="field-row">
                            <div class="field"><label>Car Make</label><select id="reqMake">${carMakes.map(m => `<option>${m}</option>`).join('')}</select></div>
                            <div class="field"><label>Model</label><input type="text" id="reqModel" placeholder="E30, Miata NA..."></div>
                        </div>
                        <div class="field"><label>What do you need?</label><textarea id="reqDesc" rows="4" required placeholder="Describe the part you need, including measurements if possible..."></textarea></div>
                        <div class="field-row">
                            <div class="field"><label>Budget Range</label><input type="text" id="reqBudget" placeholder="$50-100"></div>
                            <div class="field"><label>Timeline</label><select id="reqTimeline"><option>No rush</option><option>Within 1 week</option><option>Within 2 weeks</option><option>Within 1 month</option></select></div>
                        </div>
                        <button type="submit" class="btn btn-lg btn-primary">Send Request</button>
                    </form>
                </section>
            </div>
            
            <div class="designer-profile-right">
                <div class="profile-sidebar-card">
                    <h3>Quick Stats</h3>
                    <div class="stat-row"><span>Projects Completed</span><strong>${partsCount}</strong></div>
                    <div class="stat-row"><span>Avg. Response Time</span><strong>${d.response_time || '< 24 hours'}</strong></div>
                    <div class="stat-row"><span>Member Since</span><strong>${d.member_since || '2024'}</strong></div>
                    <div class="stat-row"><span>Repeat Clients</span><strong>${d.repeat_clients || '85%'}</strong></div>
                </div>
                
                ${reviews.length ? `<div class="profile-sidebar-card">
                    <h3>Reviews (${reviewCount})</h3>
                    ${reviews.slice(0, 3).map(r => `
                        <div class="review-mini">
                            <div class="review-mini-header">
                                <strong>${r.reviewer_name || 'Client'}</strong>
                                <span class="stars-sm">${'★'.repeat(r.rating)}</span>
                            </div>
                            <p>${r.comment || 'Great work!'}</p>
                        </div>
                    `).join('')}
                    ${reviewCount > 3 ? `<a href="#" class="see-all-reviews" onclick="document.querySelectorAll('.reviews-mini .review-mini-card').forEach(r => r.style.display='block'); this.style.display='none'; return false;">See all ${reviewCount} reviews</a>` : ''}
                </div>` : ''}
                
                <div class="profile-sidebar-card verification-card">
                    <h3>Verification</h3>
                    <div class="verification-item ${partsCount >= 5 ? 'verified' : ''}">
                        <span>${partsCount >= 5 ? '✓' : '○'}</span>
                        <span>5+ Projects on ForgAuto</span>
                    </div>
                    <div class="verification-item ${d.avatar_url ? 'verified' : ''}">
                        <span>${d.avatar_url ? '✓' : '○'}</span>
                        <span>Profile Photo</span>
                    </div>
                    <div class="verification-item ${d.email_verified ? 'verified' : ''}">
                        <span>${d.email_verified ? '✓' : '○'}</span>
                        <span>Email Verified</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Helper for service icons - using text abbreviations instead of emojis
function getServiceIcon(service) {
    const icons = {
        'CAD Modeling': 'CAD',
        '3D Scanning': 'SCAN',
        '3D Editing': 'EDIT',
        'Prototyping': 'PROTO',
        'Reverse Engineering': 'REV',
        'Interior Parts': 'INT',
        'Exterior Parts': 'EXT',
        'Performance Parts': 'PERF'
    };
    return icons[service] || '';
}

// v6.0: Contact designer modal
function openDesignerContact(designerId, designerName) {
    if (!currentUser) { alert('Please login to contact designers'); go('login'); return; }
    
    const modal = document.createElement('div');
    modal.id = 'designerContactModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="document.getElementById('designerContactModal').remove()">×</button>
            <h2>Message ${designerName}</h2>
            <form onsubmit="sendDesignerMessage(event, ${designerId})">
                <div class="field">
                    <label>Your Message</label>
                    <textarea id="designerMessage" rows="5" placeholder="Hi, I'm interested in your design services..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function sendDesignerMessage(e, designerId) {
    e.preventDefault();
    const content = document.getElementById('designerMessage').value;
    try {
        await api('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ recipient_id: designerId, content })
        });
        document.getElementById('designerContactModal').remove();
        alert('Message sent!');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ========== PRINT SHOP QUOTE REQUEST MODAL ==========

function openQuoteRequestModal(partId, partTitle, partImage, shopId = null, shopName = null) {
    if (!currentUser) { 
        alert('Please login to request quotes'); 
        go('login'); 
        return; 
    }
    
    // Must select a specific shop - redirect to print shops page if none selected
    if (!shopId) {
        go('printshops', partId);
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'quoteRequestModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box modal-box-lg">
            <button class="modal-close" onclick="closeQuoteRequestModal()">×</button>
            
            <div class="quote-request-header">
                <h2>Request a Print Quote</h2>
                <p>From: <strong>${shopName}</strong></p>
            </div>
            
            <div class="quote-part-preview">
                ${partImage ? `<img src="${partImage}" alt="${partTitle}">` : '<div class="no-image">3D</div>'}
                <div>
                    <strong>${partTitle}</strong>
                    <span>Part ID: #${partId}</span>
                </div>
            </div>
            
            <form onsubmit="submitQuoteRequest(event, ${partId}, ${shopId || 'null'})">
                <div class="quote-form-grid">
                    <div class="field">
                        <label>Your Name *</label>
                        <input type="text" id="quoteReqName" value="${currentUser.name || ''}" required>
                    </div>
                    <div class="field">
                        <label>Your Email *</label>
                        <input type="email" id="quoteReqEmail" value="${currentUser.email || ''}" required>
                    </div>
                </div>
                
                <div class="quote-form-grid">
                    <div class="field">
                        <label>Preferred Material *</label>
                        <select id="quoteReqMaterial" required>
                            <option value="">Select material...</option>
                            <option value="PLA">PLA (Standard)</option>
                            <option value="PETG">PETG (Stronger)</option>
                            <option value="ABS">ABS (Heat resistant)</option>
                            <option value="ASA">ASA (UV resistant)</option>
                            <option value="Nylon">Nylon (Flexible)</option>
                            <option value="TPU">TPU (Flexible rubber)</option>
                            <option value="Resin">Resin (High detail)</option>
                            <option value="Carbon Fiber">Carbon Fiber</option>
                            <option value="Other">Other (specify in notes)</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Color Preference</label>
                        <input type="text" id="quoteReqColor" placeholder="e.g., Black, Carbon fiber look">
                    </div>
                </div>
                
                <div class="quote-form-grid">
                    <div class="field">
                        <label>Quantity *</label>
                        <input type="number" id="quoteReqQty" value="1" min="1" required>
                    </div>
                    <div class="field">
                        <label>Timeline</label>
                        <select id="quoteReqTimeline">
                            <option value="Standard">Standard (1-2 weeks)</option>
                            <option value="Rush">Rush (3-5 days) +$</option>
                            <option value="No Rush">No rush (whenever)</option>
                        </select>
                    </div>
                </div>
                
                <div class="field">
                    <label>Shipping Address</label>
                    <input type="text" id="quoteReqAddress" placeholder="Your shipping address for delivery estimates">
                </div>
                
                <div class="field">
                    <label>Additional Notes</label>
                    <textarea id="quoteReqNotes" rows="3" placeholder="Any special requirements? Infill percentage, surface finish, tolerances..."></textarea>
                </div>
                
                <div class="quote-submit-section">
                    <button type="submit" class="btn btn-lg btn-primary">Send Quote Request</button>
                    <p class="quote-note">You'll receive a response in your Quotes tab</p>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeQuoteRequestModal() {
    const modal = document.getElementById('quoteRequestModal');
    if (modal) modal.remove();
}

async function submitQuoteRequest(e, partId, shopId) {
    e.preventDefault();
    
    const quoteData = {
        part_id: partId,
        shop_id: shopId, // null means send to all
        customer_name: document.getElementById('quoteReqName').value,
        customer_email: document.getElementById('quoteReqEmail').value,
        material: document.getElementById('quoteReqMaterial').value,
        color: document.getElementById('quoteReqColor').value,
        quantity: parseInt(document.getElementById('quoteReqQty').value),
        timeline: document.getElementById('quoteReqTimeline').value,
        shipping_address: document.getElementById('quoteReqAddress').value,
        notes: document.getElementById('quoteReqNotes').value
    };
    
    try {
        const result = await api('/api/quotes', {
            method: 'POST',
            body: JSON.stringify(quoteData)
        });
        
        closeQuoteRequestModal();
        
        if (shopId) {
            alert(`Quote request sent! The print shop will contact you at ${quoteData.customer_email} with pricing.`);
        } else {
            alert(`Quote request sent to ${result.shops_notified || 'all'} print shops! They will contact you at ${quoteData.customer_email} with pricing.`);
        }
    } catch (err) {
        alert('Error sending quote request: ' + err.message);
    }
}

async function handleDesignerRequest(e, designerId) {
    e.preventDefault();
    const request = {
        name: document.getElementById('reqName').value,
        email: document.getElementById('reqEmail').value,
        make: document.getElementById('reqMake').value,
        model: document.getElementById('reqModel').value,
        description: document.getElementById('reqDesc').value,
        budget: document.getElementById('reqBudget').value,
        timeline: document.getElementById('reqTimeline')?.value
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

// v6.0: Become a Designer page
async function becomeDesignerView() {
    if (!currentUser) {
        return `<div class="auth-prompt"><h2>Login Required</h2><p>You need to be logged in to become a designer.</p><a href="#" onclick="go('login'); return false;" class="btn btn-primary">Login</a></div>`;
    }
    
    // Check how many parts user has
    let userParts = [];
    try { userParts = await api(`/api/parts?user=${currentUser.id}`); } catch (e) {}
    const partsCount = userParts.length;
    const canApply = partsCount >= 5;
    
    return `<div class="become-designer-page">
        <div class="become-designer-header">
            <h1>Become a Designer</h1>
            <p>Join ForgAuto as a verified 3D designer and get hired for custom projects.</p>
        </div>
        
        <div class="requirements-section">
            <h2>Requirements</h2>
            <div class="requirements-grid">
                <div class="requirement-item ${partsCount >= 5 ? 'met' : 'unmet'}">
                    <div class="req-icon">${partsCount >= 5 ? '✓' : '○'}</div>
                    <div class="req-text">
                        <strong>5+ Parts Listed</strong>
                        <span>You have ${partsCount} part${partsCount !== 1 ? 's' : ''} ${partsCount >= 5 ? '✓' : `(need ${5 - partsCount} more)`}</span>
                    </div>
                </div>
                <div class="requirement-item ${currentUser.avatar_url ? 'met' : 'unmet'}">
                    <div class="req-icon">${currentUser.avatar_url ? '✓' : '○'}</div>
                    <div class="req-text">
                        <strong>Profile Photo</strong>
                        <span>${currentUser.avatar_url ? 'Uploaded ✓' : 'Required - go to Settings'}</span>
                    </div>
                </div>
                <div class="requirement-item met">
                    <div class="req-icon">✓</div>
                    <div class="req-text">
                        <strong>Email Verified</strong>
                        <span>Your account is verified</span>
                    </div>
                </div>
            </div>
        </div>
        
        ${canApply ? `
        <div class="designer-application">
            <h2>Complete Your Designer Profile</h2>
            <form onsubmit="submitDesignerApplication(event)">
                <div class="field">
                    <label>Location (City, Country)</label>
                    <input type="text" id="dLocation" placeholder="Los Angeles, USA" required>
                </div>
                <div class="field">
                    <label>Bio / About You</label>
                    <textarea id="dBio" rows="4" placeholder="Tell clients about your experience, background, and what makes you unique..." required></textarea>
                </div>
                <div class="field">
                    <label>Years of Experience</label>
                    <input type="text" id="dExperience" placeholder="5 years designing automotive parts">
                </div>
                <div class="field">
                    <label>Equipment & Software (comma separated)</label>
                    <input type="text" id="dEquipment" placeholder="Fusion 360, SolidWorks, Bambu Lab X1C, Creality K1" required>
                </div>
                <div class="field">
                    <label>Specialties (select all that apply)</label>
                    <div class="checkbox-grid">
                        ${designerSpecialties.map(s => `<label class="checkbox-item"><input type="checkbox" name="specialty" value="${s}"> ${s}</label>`).join('')}
                    </div>
                </div>
                <div class="field-row">
                    <div class="field">
                        <label>Hourly Rate</label>
                        <input type="text" id="dHourlyRate" placeholder="$50/hr">
                    </div>
                    <div class="field">
                        <label>Or Project Rate</label>
                        <input type="text" id="dProjectRate" placeholder="Starting at $100">
                    </div>
                </div>
                <button type="submit" class="btn btn-lg btn-primary">Submit Application</button>
            </form>
        </div>
        ` : `
        <div class="not-eligible">
            <h2>Not Eligible Yet</h2>
            <p>You need to upload at least 5 parts before becoming a designer. This ensures all our designers have proven experience.</p>
            <a href="#" onclick="go('sell'); return false;" class="btn btn-primary">Upload a Part</a>
        </div>
        `}
    </div>`;
}

async function submitDesignerApplication(e) {
    e.preventDefault();
    
    const specialties = Array.from(document.querySelectorAll('input[name="specialty"]:checked')).map(c => c.value);
    
    const application = {
        location: document.getElementById('dLocation').value,
        bio: document.getElementById('dBio').value,
        experience: document.getElementById('dExperience').value,
        equipment: document.getElementById('dEquipment').value,
        tags: specialties,
        rate: document.getElementById('dHourlyRate').value,
        project_rate: document.getElementById('dProjectRate').value,
        role: 'designer'
    };
    
    try {
        await api('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(application)
        });
        alert('Congratulations! Your designer profile is now live.');
        currentUser = { ...currentUser, ...application };
        go('designer', currentUser.id);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// FIX 9: Show all parts with warnings when viewing own profile
async function profileView(id) {
    // v7.4: If no ID provided, redirect to current user's profile or dashboard
    if (!id) {
        if (currentUser) {
            setTimeout(() => go('dashboard'), 0);
            return '<div class="loading-state"><p>Redirecting to dashboard...</p></div>';
        } else {
            setTimeout(() => go('login'), 0);
            return '<div class="loading-state"><p>Please login to view your profile.</p></div>';
        }
    }
    
    let user, userParts = [];
    try { user = await api(`/api/users/${id}`); } catch (e) { return '<p>User not found.</p>'; }
    try { userParts = await api(`/api/parts?user=${id}`); } catch (e) { userParts = []; }
    
    // FIX 9: If viewing own profile, show all parts with warnings
    const isOwnProfile = currentUser && currentUser.id === parseInt(id);
    const activeParts = isOwnProfile ? userParts : filterPublicParts(userParts);
    const cardFn = isOwnProfile ? sellerCardHTML : cardHTML;
    
    return `<div class="profile-page">
        <div class="profile-header">
            <div class="profile-avatar">${user.avatar_url ? `<img src="${user.avatar_url}">` : user.name.charAt(0)}</div>
            <div>
                <h1>${user.name}</h1>
                <p>${user.role === 'designer' ? 'Designer' : 'Seller'}</p>
                <p>${user.bio || ''}</p>
                <p class="profile-stats">${activeParts.length} listings</p>
            </div>
        </div>
        ${activeParts.length ? `
        <div class="section">
            <div class="section-head"><h2>Listings by ${user.name}</h2></div>
            <div class="grid">${activeParts.map(p => cardFn(p)).join('')}</div>
        </div>` : '<p class="empty-state">No listings yet.</p>'}
    </div>`;
}

// ============ IMAGE VALIDATION HELPERS ============

// Check if a URL is a valid image URL (not base64, not placeholder)
function isValidImageUrl(url) {
    if (!url) return false;
    if (url.startsWith('data:')) return false; // Corrupt base64
    if (url.includes('placehold.co')) return false; // Placeholder
    if (url.includes('placeholder')) return false;
    return true;
}

// Get first valid image from a part
function getValidImage(p) {
    if (p.images && p.images.length > 0) {
        const valid = p.images.find(url => isValidImageUrl(url));
        if (valid) return valid;
    }
    if (p.img && isValidImageUrl(p.img)) return p.img;
    return null;
}

// Check if part has valid image for public display
function hasValidImage(p) {
    return getValidImage(p) !== null;
}

// FIX 3: Filter parts - allow undefined status
function filterPublicParts(partsArray) {
    return partsArray.filter(p => hasValidImage(p) && (!p.status || p.status === 'active'));
}

// ============ CARD RENDERING ============

// CHARACTER LIMITS
const TITLE_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 500;

// Truncate text helper
function truncateText(text, maxLen) {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

// PUBLIC card - NEVER shows placeholder, only renders if valid image exists
// v5.0: Added seller username + avatar, character limits, featured border
function cardHTML(p) {
    const img = getValidImage(p);
    // If no valid image, don't render card at all in public view
    if (!img) return '';
    
    const errorFallback = "this.onerror=null; this.src='data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#333" width="400" height="300"/><text x="50%" y="50%" fill="#999" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">Image unavailable</text></svg>') + "'";
    
    // v7.4: Sanitize user-generated content
    const displayTitle = sanitize(truncateText(p.title, TITLE_MAX_LENGTH));
    const sellerName = sanitize(p.seller_name || 'Seller');
    const sellerInitial = sellerName.charAt(0).toUpperCase();
    const sellerAvatar = p.seller_avatar_url;
    const category = sanitize(p.category || 'Part');
    const make = sanitize(p.make || '');
    const model = sanitize(p.model || '');
    
    // Featured border
    const isFeatured = p.featured || p.premiered;
    const cardClass = isFeatured ? 'card card-featured' : 'card';
    
    return `<div class="${cardClass}" onclick="go('part', ${p.id}); return false;">
        <div class="card-image">
            <img src="${img}" alt="${displayTitle}" onerror="${errorFallback}">
            <span class="card-badge">${category}</span>
            ${isFeatured ? '<span class="card-featured-badge">★ FEATURED</span>' : ''}
        </div>
        <div class="card-body">
            <div class="card-title">${displayTitle}</div>
            <div class="card-seller">
                <div class="card-seller-avatar">${sellerAvatar ? `<img src="${sellerAvatar}" alt="${sellerName}">` : sellerInitial}</div>
                <span class="card-seller-name">${sellerName}</span>
            </div>
            <div class="card-meta">
                <span class="card-cat">${make && make !== 'Non-Specific' ? make : ''}${model && model !== 'All' && model !== 'Any' ? ' ' + model : ''}</span>
                <span class="card-price">$${(p.price || 0).toFixed(2)}</span>
            </div>
        </div>
    </div>`;
}

// SELLER DASHBOARD card - shows gray placeholder with RED warning if missing image
function sellerCardHTML(p) {
    const img = getValidImage(p);
    const hasImage = !!img;
    const hasFile = !!p.file_url;
    const isComplete = hasImage && hasFile;
    
    // Build missing info
    let missingInfo = [];
    if (!hasFile) missingInfo.push('3D File');
    if (!hasImage) missingInfo.push('Photo');
    
    // Card classes
    const isFeatured = p.featured || p.premiered;
    const cardClass = `card ${!isComplete ? 'card-warning' : ''} ${isFeatured ? 'card-featured' : ''}`;
    
    // Image: use valid image or gray placeholder (NEVER blue)
    const displayImg = img || 'https://placehold.co/600x450/333333/999999?text=';
    
    // Truncate title
    const displayTitle = truncateText(p.title, TITLE_MAX_LENGTH);
    
    return `<div class="${cardClass}" onclick="go('part', ${p.id}); return false;">
        <div class="card-image">
            <img src="${displayImg}" alt="${displayTitle}">
            <span class="card-badge">${p.category || 'Part'}</span>
            ${!isComplete ? `<span class="warning-badge">IMAGE REQUIRED</span>` : ''}
            ${isFeatured ? '<span class="card-featured-badge">★ FEATURED</span>' : ''}
        </div>
        <div class="card-body">
            <div class="card-title">${displayTitle}</div>
            ${!isComplete ? `<div class="warning-text">Not visible publicly. Missing: ${missingInfo.join(', ')}</div>` : ''}
            <div class="card-meta">
                <span class="card-cat">${p.make && p.make !== 'Non-Specific' ? p.make : ''}${p.model && p.model !== 'All' && p.model !== 'Any' ? ' ' + p.model : ''}</span>
                <span class="card-price">$${(p.price || 0).toFixed(2)}</span>
            </div>
        </div>
    </div>`;
}

// v5.0: Character counter for title/description
function updateCharCount(inputId, counterId, maxLen) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (input && counter) {
        const len = input.value.length;
        counter.textContent = `${len}/${maxLen}`;
        counter.classList.toggle('char-limit-warning', len > maxLen * 0.9);
        counter.classList.toggle('char-limit-full', len >= maxLen);
    }
}

// v5.3: Compress images before upload (max 1200px, 80% quality)
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                
                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with compression
                canvas.toBlob((blob) => {
                    if (blob) {
                        // Create new file with original name
                        const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                        console.log(`Compressed: ${(file.size/1024).toFixed(0)}KB → ${(blob.size/1024).toFixed(0)}KB`);
                        resolve(compressedFile);
                    } else {
                        resolve(file); // Fallback to original
                    }
                }, 'image/jpeg', quality);
            };
            img.onerror = () => resolve(file); // Fallback on error
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

async function handlePhotoUpload(event) {
    for (let file of event.target.files) {
        if (uploadedPhotos.length >= 10) break;
        
        // v5.3: Compress image before adding
        const compressedFile = await compressImage(file);
        uploadedPhotoFiles.push(compressedFile);
        
        const reader = new FileReader();
        reader.onload = e => {
            uploadedPhotos.push(e.target.result);
            renderPhotoGrid();
        };
        reader.readAsDataURL(compressedFile);
    }
}
function renderPhotoGrid() { const grid = document.getElementById('photoGrid'); if (!grid) return; grid.innerHTML = uploadedPhotos.map((photo, i) => `<div class="photo-item"><img src="${photo}"><button class="photo-remove" onclick="removePhoto(${i})">x</button></div>`).join('') + (uploadedPhotos.length < 10 ? `<div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div>` : ''); }
function removePhoto(index) { uploadedPhotos.splice(index, 1); uploadedPhotoFiles.splice(index, 1); renderPhotoGrid(); }
function useMyLocation() { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { document.getElementById('locationInput').value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`; }); } }

// Contact Seller Modal - shows product info
function openContactModal(sellerId, sellerName, partTitle, partId, partImage) {
    if (!currentUser) { alert('Please login to contact sellers'); go('login'); return; }
    if (currentUser.id === sellerId) { alert('This is your own listing'); return; }
    
    // Create modal with product preview
    const modal = document.createElement('div');
    modal.id = 'contactModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeContactModal()">×</button>
            <h2>Contact Seller</h2>
            <div class="contact-product-preview">
                ${partImage ? `<img src="${partImage}" alt="${partTitle}">` : ''}
                <div class="contact-product-info">
                    <strong>${partTitle}</strong>
                    <span>Seller: ${sellerName}</span>
                </div>
            </div>
            <form onsubmit="sendContactMessage(event, ${sellerId}, '${partTitle.replace(/'/g, "\\'")}', ${partId || 'null'})">
                <div class="field">
                    <label>Your Message</label>
                    <textarea id="contactMessage" rows="4" placeholder="Hi, I have a question about this part..." required></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" onclick="closeContactModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.remove();
}

async function sendContactMessage(e, sellerId, partTitle, partId) {
    e.preventDefault();
    const content = document.getElementById('contactMessage').value.trim();
    if (!content) return;
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    try {
        await api('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ 
                recipient_id: sellerId, 
                content: content,
                part_id: partId,
                part_title: partTitle,
                notify_email: true
            })
        });
        closeContactModal();
        alert('Message sent! The seller will be notified by email.');
        go('conversation', sellerId);
    } catch (err) {
        alert('Error: ' + err.message);
        btn.textContent = 'Send Message';
        btn.disabled = false;
    }
}

// FIX 11: Thingiverse-style 3D viewer - complete rewrite
let currentPartData = null;
let viewerInstance = null;

// v5.3: Initialize viewer with specific file URL (for package file switching)
function initViewerWithUrl(fileUrl, partData) {
    // Call initViewer with -1 as partId and pass fileUrl override
    initViewer(-1, fileUrl);
}

function initViewer(partId, overrideFileUrl = null) {
    const container = document.getElementById('viewer3d');
    if (!container) return;
    
    // Cleanup previous viewer
    if (viewerInstance) {
        if (viewerInstance.animationId) cancelAnimationFrame(viewerInstance.animationId);
        if (viewerInstance.renderer) viewerInstance.renderer.dispose();
        viewerInstance = null;
    }
    
    const p = currentPartData || parts.find(x => x.id === partId);
    if (!p) return;
    
    if (!window.THREE) {
        container.innerHTML = '<div class="viewer-fallback"><p>3D viewer could not load</p></div>';
        return;
    }
    
    // v5.3: Use override URL if provided (for file switching)
    const fileUrl = overrideFileUrl || p.file_url;
    if (!fileUrl) {
        const img = (p.images && p.images[0]) ? p.images[0] : null;
        if (img) {
            container.innerHTML = `<div class="viewer-image-fallback"><img src="${img}" alt="${p.title}"></div>`;
        } else {
            container.innerHTML = '<div class="viewer-fallback"><p>No 3D file or preview available</p></div>';
        }
        return;
    }
    
    const ext = fileUrl.toLowerCase().split('.').pop().split('?')[0];
    const isSTL = ext === 'stl';
    const isOBJ = ext === 'obj';
    
    if (!isSTL && !isOBJ) {
        container.innerHTML = `<div class="viewer-fallback"><p>3D preview for .${ext} files coming soon</p><p class="viewer-fallback-sub">Download the file to view in your slicer</p></div>`;
        return;
    }
    
    // Show loading bar
    container.innerHTML = `
        <div class="viewer-loading-screen" id="viewerLoading">
            <div class="viewer-loading-bar-container">
                <div class="viewer-loading-bar" id="viewerLoadingBar" style="width: 0%"></div>
            </div>
            <p class="viewer-loading-text" id="viewerLoadingText">Loading 3D model...</p>
        </div>
    `;
    
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(100, 80, 100);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 5;
    controls.maxDistance = 2000;
    controls.target.set(0, 0, 0);
    
    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.3);
    scene.add(hemiLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(50, 100, 50);
    keyLight.castShadow = true;
    scene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-50, 50, -50);
    scene.add(fillLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 50, -100);
    scene.add(rimLight);
    
    // Grid floor
    const gridHelper = new THREE.GridHelper(200, 40, 0x2a2a4e, 0x1e1e3a);
    scene.add(gridHelper);
    
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.01;
    ground.receiveShadow = true;
    scene.add(ground);
    
    function onModelLoaded(geometry, isMesh) {
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        let mesh;
        if (isMesh) {
            mesh = geometry;
        } else {
            geometry.computeBoundingBox();
            geometry.center();
            const material = new THREE.MeshPhongMaterial({
                color: 0xb0b0b0,
                specular: 0x333333,
                shininess: 40,
                flatShading: false
            });
            geometry.computeVertexNormals();
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        
        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 60 / maxDim;
        mesh.scale.set(scale, scale, scale);
        
        const scaledBox = new THREE.Box3().setFromObject(mesh);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        const scaledSize = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        
        mesh.position.x -= scaledCenter.x;
        mesh.position.z -= scaledCenter.z;
        mesh.position.y -= scaledBox.min.y;
        
        scene.add(mesh);
        
        const fitDist = maxDim * scale * 1.8;
        camera.position.set(fitDist * 0.8, fitDist * 0.6, fitDist * 0.8);
        controls.target.set(0, scaledSize.y * 0.3, 0);
        controls.update();
        
        addViewerToolbar(container, controls, mesh, renderer, scene, camera);
        
        viewerInstance = { renderer, animationId: null, mesh };
        
        function animate() {
            viewerInstance.animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        
        window.addEventListener('resize', () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w && h) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        });
    }
    
    function onProgress(event) {
        if (event.total && event.total > 0) {
            const pct = Math.round((event.loaded / event.total) * 100);
            const bar = document.getElementById('viewerLoadingBar');
            const text = document.getElementById('viewerLoadingText');
            if (bar) bar.style.width = pct + '%';
            if (text) text.textContent = `Loading 3D model... ${pct}%`;
        }
    }
    
    function onError(error) {
        const img = (p.images && p.images[0]) ? p.images[0] : null;
        if (img) {
            container.innerHTML = `<div class="viewer-image-fallback"><img src="${img}" alt="${p.title}"><div class="viewer-fallback-overlay">3D preview unavailable</div></div>`;
        } else {
            container.innerHTML = '<div class="viewer-fallback"><p>Failed to load 3D model</p></div>';
        }
    }
    
    if (isSTL) {
        const loader = new THREE.STLLoader();
        loader.load(fileUrl, (geometry) => onModelLoaded(geometry, false), onProgress, onError);
    } else if (isOBJ && window.THREE.OBJLoader) {
        const loader = new THREE.OBJLoader();
        loader.load(fileUrl, (obj) => {
            obj.traverse(child => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0xb0b0b0,
                        specular: 0x333333,
                        shininess: 40
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            onModelLoaded(obj, true);
        }, onProgress, onError);
    } else {
        onError(new Error('Format not supported'));
    }
}

function addViewerToolbar(container, controls, mesh, renderer, scene, camera) {
    const toolbar = document.createElement('div');
    toolbar.className = 'viewer-toolbar';
    toolbar.innerHTML = `
        <button class="viewer-btn" id="btnAutoRotate" title="Auto-Rotate">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/><polyline points="21 3 21 9 15 9"/></svg>
        </button>
        <button class="viewer-btn" id="btnWireframe" title="Wireframe">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </button>
        <button class="viewer-btn" id="btnResetView" title="Reset View">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m-10-10h4m12 0h4"/></svg>
        </button>
        <button class="viewer-btn" id="btnFullscreen" title="Fullscreen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
        </button>
    `;
    container.appendChild(toolbar);
    
    const hint = document.createElement('div');
    hint.className = 'viewer-hint';
    hint.textContent = 'Drag to rotate · Scroll to zoom · Right-click to pan';
    container.appendChild(hint);
    setTimeout(() => { hint.style.opacity = '0'; }, 3000);
    
    let isWireframe = false;
    let isAutoRotate = false;
    
    document.getElementById('btnAutoRotate').onclick = () => {
        isAutoRotate = !isAutoRotate;
        controls.autoRotate = isAutoRotate;
        document.getElementById('btnAutoRotate').classList.toggle('active', isAutoRotate);
    };
    
    document.getElementById('btnWireframe').onclick = () => {
        isWireframe = !isWireframe;
        if (mesh.isMesh) {
            mesh.material.wireframe = isWireframe;
        } else {
            mesh.traverse(child => { if (child.isMesh) child.material.wireframe = isWireframe; });
        }
        document.getElementById('btnWireframe').classList.toggle('active', isWireframe);
    };
    
    document.getElementById('btnResetView').onclick = () => {
        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fitDist = maxDim * 1.8;
        camera.position.set(fitDist * 0.8, fitDist * 0.6, fitDist * 0.8);
        controls.target.set(0, size.y * 0.3, 0);
        controls.update();
    };
    
    document.getElementById('btnFullscreen').onclick = () => {
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {});
        } else {
            document.exitFullscreen();
        }
    };
}

// FIX 13: Gallery functions for switching between 3D and images
// v5.3: Show 3D viewer with specific file from package
function show3DViewer(fileIndex = 0) {
    document.querySelectorAll('.thumb, .thumb-3d').forEach(t => t.classList.remove('active'));
    // Activate the correct 3D button
    const btn = document.querySelector(`.thumb-3d[data-file-index="${fileIndex}"]`);
    if (btn) btn.classList.add('active');
    
    const viewer = document.getElementById('viewer3d');
    if (viewer) viewer.style.display = 'block';
    const heroImg = document.getElementById('galleryHeroImage');
    if (heroImg) heroImg.style.display = 'none';
    
    // v5.3: Load specific file from package
    if (currentPartData) {
        let fileUrl = currentPartData.file_url;
        if (currentPartData.file_urls && currentPartData.file_urls.length > fileIndex) {
            fileUrl = currentPartData.file_urls[fileIndex].url;
        }
        initViewerWithUrl(fileUrl, currentPartData);
    }
}

function showGalleryImage(src, el) {
    document.querySelectorAll('.thumb, .thumb-3d').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const viewer = document.getElementById('viewer3d');
    if (viewer) viewer.style.display = 'none';
    let heroImg = document.getElementById('galleryHeroImage');
    if (!heroImg) {
        heroImg = document.createElement('div');
        heroImg.id = 'galleryHeroImage';
        heroImg.className = 'gallery-hero-image';
        viewer.parentElement.insertBefore(heroImg, viewer.nextSibling);
    }
    heroImg.style.display = 'block';
    heroImg.innerHTML = `<img src="${src}" alt="Part photo" onclick="openLightbox('${src}')">`;
}

// v7.5: Handle Stripe return URLs
function handleStripeReturn() {
    const hash = window.location.hash;
    if (hash.includes('listing_paid=true')) {
        setTimeout(() => alert('✅ Listing is now live!'), 500);
    }
    if (hash.includes('purchased=true')) {
        setTimeout(() => alert('✅ Purchase complete! You can now download the file.'), 500);
    }
    if (hash.includes('boosted=true')) {
        setTimeout(() => alert('✅ Your listing is now featured for 30 days!'), 500);
    }
    if (hash.includes('stripe=success')) {
        setTimeout(() => alert('✅ Stripe account connected! You can now receive payments.'), 500);
    }
    if (hash.includes('registered=true')) {
        setTimeout(() => alert('✅ Print shop registered successfully!'), 500);
    }
    if (hash.includes('stripe=refresh')) {
        // Retry Stripe onboarding
        connectStripeAccount();
    }
}

// v7.5: Stripe Connect - create seller account
async function connectStripeAccount() {
    if (!currentUser) { go('login'); return; }
    try {
        const res = await api('/api/stripe/connect-account', { method: 'POST' });
        if (res && res.url) {
            window.location.href = res.url;
        } else if (res && res.onboarded) {
            alert('Your Stripe account is already connected!');
        }
    } catch (e) {
        alert('Error connecting Stripe: ' + e.message);
    }
}

// v7.5: Open Stripe dashboard
async function openStripeDashboard() {
    try {
        const res = await api('/api/stripe/dashboard-link');
        if (res && res.url) {
            window.open(res.url, '_blank');
        }
    } catch (e) {
        alert('Error opening dashboard: ' + e.message);
    }
}

// v7.5: Check Stripe account status
async function getStripeStatus() {
    try {
        const res = await api('/api/stripe/account-status');
        return res || { has_account: false, is_onboarded: false };
    } catch (e) {
        return { has_account: false, is_onboarded: false };
    }
}

// Initialize
console.log(`ForgAuto v${VERSION} loaded`);
// Initialize app
checkAuth().then(() => {
    handleStripeReturn();
    const initialData = initFromHash();
    // Set initial state in history
    history.replaceState({ view, data: initialData }, '', window.location.hash || '#home');
    render(initialData);
});

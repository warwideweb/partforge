// ForgAuto — 3D Marketplace for Cars
// Version 4.0 - Major Fixes

const VERSION = '5.1';
const API_URL = 'https://forgauto-api.warwideweb.workers.dev'; // Cloudflare Worker API

// State
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Check auth on load
async function checkAuth() {
    // Check for OAuth callback token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('token');
    const oauthUser = urlParams.get('user');
    
    if (oauthToken && oauthUser) {
        // Google OAuth callback - save token and user
        authToken = oauthToken;
        localStorage.setItem('authToken', authToken);
        try {
            currentUser = JSON.parse(decodeURIComponent(oauthUser));
            updateNavAuth();
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
            go('dashboard');
            return;
        } catch (e) {
            console.error('Failed to parse OAuth user:', e);
        }
    }
    
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

// Google OAuth login
function loginWithGoogle() {
    window.location.href = `${API_URL}/api/auth/google`;
}

function updateNavAuth() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser && currentUser.name) {
        loginBtn.textContent = currentUser.name.split(' ')[0];
        loginBtn.onclick = () => go('dashboard');
    } else if (currentUser && currentUser.email) {
        loginBtn.textContent = currentUser.email.split('@')[0];
        loginBtn.onclick = () => go('dashboard');
    } else if (currentUser) {
        loginBtn.textContent = 'Account';
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

let view = 'home', filter = '', filterCat = '', filterMake = '', filterModel = '', uploadedPhotos = [], uploadedPhotoFiles = [], uploadedFile = null;
let parts = demoParts;
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
        const realParts = data || [];
        
        // FIX 6: Only use demo parts if there are ZERO real parts
        if (realParts.length === 0) {
            parts = demoParts.map(p => ({...p, isDemo: true, seller_name: 'ForgAuto Sample'}));
        } else {
            parts = realParts;
        }
    } catch (e) {
        // API error - fall back to demo data
        parts = demoParts.map(p => ({...p, isDemo: true, seller_name: 'ForgAuto Sample'}));
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

function go(v, data, skipHistory = false) { 
    view = v; 
    if (!skipHistory) {
        const url = data ? `#${v}/${data}` : `#${v}`;
        history.pushState({ view: v, data: data }, '', url);
    }
    render(data); 
    window.scrollTo(0, 0); 
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
    if (view === 'home') { await loadParts(); app.innerHTML = homeView(); }
    else if (view === 'browse') { await loadParts(); app.innerHTML = browseView(); }
    else if (view === 'designers') { await loadDesigners(); app.innerHTML = designersView(); }
    else if (view === 'sell') app.innerHTML = sellView();
    else if (view === 'edit') app.innerHTML = await editView(data);
    else if (view === 'part') { app.innerHTML = await partView(data); initViewer(data); }
    else if (view === 'designer') app.innerHTML = await designerView(data);
    else if (view === 'printshops') app.innerHTML = printShopsView(data);
    else if (view === 'login') app.innerHTML = loginView();
    else if (view === 'signup') app.innerHTML = signupView();
    else if (view === 'forgot-password') app.innerHTML = forgotPasswordView();
    else if (view === 'dashboard') app.innerHTML = await dashboardView();
    else if (view === 'conversation') app.innerHTML = await conversationView(data);
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
            
            <button onclick="loginWithGoogle()" class="btn btn-google" style="width:100%; margin-bottom:20px; background:#4285f4; color:white; display:flex; align-items:center; justify-content:center; gap:10px;">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
            </button>
            
            <div style="text-align:center; margin:15px 0; color:#666;">— or —</div>
            
            <form onsubmit="handleLogin(event)">
                <div class="field"><label>Email</label><input type="email" id="loginEmail" required></div>
                <div class="field"><label>Password</label><input type="password" id="loginPassword" required></div>
                <div id="loginError" class="error-msg"></div>
                <button type="submit" class="btn btn-lg btn-primary" style="width:100%">Login with Email</button>
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
                        <div class="message-content">${m.content}</div>
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
                <div class="message-content">${m.content}</div>
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
    return `<div class="auth-container">
        <div class="auth-box">
            <h1>Create Account</h1>
            <p>Join ForgAuto as a seller or designer</p>
            
            <button onclick="loginWithGoogle()" class="btn btn-google" style="width:100%; margin-bottom:20px; background:#4285f4; color:white; display:flex; align-items:center; justify-content:center; gap:10px;">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign up with Google
            </button>
            
            <div style="text-align:center; margin:15px 0; color:#666;">— or sign up with email —</div>
            
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
            <p class="auth-switch">Already have an account? <a href="#" onclick="go('login'); return false;">Login</a></p>
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
                <a href="#sell" onclick="go('sell'); return false;" class="btn btn-primary">+ New Listing</a>
                <button onclick="handleLogout()" class="btn btn-outline">Logout</button>
            </div>
        </div>
        
        <div class="dashboard-nav">
            <button class="dash-tab active" onclick="showDashTab('listings')">My Listings</button>
            <button class="dash-tab" onclick="showDashTab('messages')">Messages ${unreadCount > 0 ? `<span class="badge-unread">${unreadCount}</span>` : ''}</button>
            <button class="dash-tab" onclick="showDashTab('sales')">Sales</button>
            <button class="dash-tab" onclick="showDashTab('purchases')">Purchases</button>
            <button class="dash-tab" onclick="showDashTab('settings')">Settings</button>
        </div>
        
        <div id="dashListings" class="dash-content">
            <h2>My Listings (${myParts.length})</h2>
            ${myParts.length ? `<div class="grid">${myParts.map(p => sellerCardHTML(p)).join('')}</div>` : '<p class="empty-state">No listings yet. <a href="#" onclick="go(\'sell\'); return false;">Create your first listing</a></p>'}
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
            ${validParts.length ? `<div class="grid">${validParts.slice(0, 8).map(cardHTML).join('')}</div>` : 
            `<div class="empty-cta"><h3>Be the first to list a part</h3><p>Start selling your 3D automotive designs today.</p><a href="#" onclick="go('sell'); return false;" class="btn btn-lg btn-primary">Create Listing - $10</a></div>`}
        </div>

        <div class="section featured-designers"><div class="section-head"><h2>Top Designers</h2><a href="#" onclick="go('designers'); return false;">View all</a></div>
            <div class="designers-preview">${designers.slice(0, 3).map(d => `<div class="designer-mini" onclick="go('designer', ${d.id})"><img src="${d.avatar_url}" alt="${d.name}"><div class="designer-mini-info"><strong>${d.name}</strong><span>${d.bio?.substring(0, 50)}...</span><span class="designer-mini-rate">${d.rate} - ${d.stats?.avgRating || 5} stars</span></div></div>`).join('')}</div>
        </div>

        <div class="stats-bar">
            <div class="stat"><span class="stat-num">${validParts.length}</span><span class="stat-label">${validParts.length === 1 ? 'Part' : 'Parts'} Listed</span></div>
            <div class="stat"><span class="stat-num">${demoDesigners.length}</span><span class="stat-label">${demoDesigners.length === 1 ? 'Designer' : 'Designers'}</span></div>
            <div class="stat"><span class="stat-num">${carMakes.length - 1}</span><span class="stat-label">Car Brands</span></div>
            <div class="stat"><span class="stat-num">$10</span><span class="stat-label">Flat Fee</span></div>
        </div>
        <div class="version-tag">v${VERSION}</div>
    `;
}

function browseView() {
    // Start with only parts that have valid images
    let filtered = filterPublicParts(parts);
    if (filter) { const q = filter.toLowerCase(); filtered = filtered.filter(p => (p.title||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (p.make||'').toLowerCase().includes(q) || (p.model||'').toLowerCase().includes(q)); }
    if (filterCat) filtered = filtered.filter(p => p.category === filterCat);
    if (filterMake) filtered = filtered.filter(p => p.make === filterMake);
    if (filterModel) filtered = filtered.filter(p => p.model === filterModel);
    const title = filterMake && filterModel ? `${filterMake} ${filterModel}` : filterMake ? filterMake : filterCat ? filterCat : filter ? `"${filter}"` : 'All Parts';
    
    // v5.0: Sort featured parts to top
    const featuredParts = filtered.filter(p => p.featured || p.premiered);
    const regularParts = filtered.filter(p => !p.featured && !p.premiered);
    const sortedParts = [...featuredParts, ...regularParts];
    
    return `<div class="browse">
        <aside class="sidebar">
            <h3>Category</h3>
            <select class="filter-select" onchange="filterCat=this.value;go('browse');">
                <option value="">All Categories</option>
                ${categories.map(c => `<option value="${c.name}" ${filterCat===c.name?'selected':''}>${c.name}</option>`).join('')}
            </select>
            <h3>Make</h3>
            <select class="filter-select" onchange="filterMake=this.value;filterModel='';go('browse');">
                <option value="">All Makes</option>
                ${carMakes.filter(m => m !== 'Non-Specific').map(m => `<option value="${m}" ${filterMake===m?'selected':''}>${m}</option>`).join('')}
            </select>
            ${filterMake && carModels[filterMake] ? `<h3>Model</h3>
            <select class="filter-select" onchange="filterModel=this.value;go('browse');">
                <option value="">All ${filterMake} Models</option>
                ${carModels[filterMake].map(m => `<option value="${m}" ${filterModel===m?'selected':''}>${m}</option>`).join('')}
            </select>` : ''}
            <div class="sidebar-cta"><p>Don't have a printer?</p><a href="#" onclick="go('printshops'); return false;" class="btn btn-outline" style="width:100%">Find Print Shop</a></div>
        </aside>
        <div><div class="browse-head"><h1>${title}</h1><span style="color:var(--muted)">${sortedParts.length} parts</span></div>
            ${featuredParts.length > 0 ? `<div class="browse-featured-label"><span>★</span> Featured Listings</div>` : ''}
            <div class="grid">${sortedParts.length ? sortedParts.map(cardHTML).join('') : '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:48px 0;">No parts found.</p>'}</div>
        </div>
    </div>`;
}

function designersView() {
    // Filter out invalid designers - if none valid, use demo data
    let validDesigners = designers.filter(d => d.name && d.name !== 'undefined' && d.avatar_url && d.avatar_url.startsWith('http'));
    
    // Fall back to demo designers if API returned garbage
    if (validDesigners.length === 0) {
        validDesigners = demoDesigners;
    }
    
    return `<div class="page-header"><h1>Find a Designer</h1><p>Need a custom part? Work with automotive specialists.</p></div>
        <div class="designers-grid">${validDesigners.map(d => `<div class="designer" onclick="go('designer', ${d.id})"><div class="designer-top"><img src="${d.avatar_url}" alt="${d.name}" onerror="this.style.display='none'"><div><h3>${d.name}</h3><p>${d.bio ? d.bio.substring(0, 60) + '...' : ''}</p></div></div><div class="designer-stats"><span class="designer-rate">${d.rate || 'Contact for rate'}</span><span class="designer-rating">${d.stats?.avgRating || 5} stars</span></div><div class="tags">${(d.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}</div><div class="designer-projects">${d.stats?.parts || 0} projects</div></div>`).join('')}</div>`;
}

function sellView() {
    if (!currentUser) {
        return `<div class="auth-prompt"><h2>Login Required</h2><p>You need to be logged in to sell parts.</p><a href="#" onclick="go('login'); return false;" class="btn btn-primary">Login</a> <a href="#" onclick="go('signup'); return false;" class="btn btn-outline">Sign Up</a></div>`;
    }
    
    return `<div class="sell-layout">
        <div class="sell-info"><h1>Sell your car parts</h1><p>Upload your designs, set your price, start earning.</p>
            <div class="steps"><div class="step"><div class="step-num">1</div><div><h4>Upload files</h4><p>3D files + photos</p></div></div><div class="step"><div class="step-num">2</div><div><h4>Pay listing fee</h4><p>One-time $10</p></div></div><div class="step"><div class="step-num">3</div><div><h4>Get paid</h4><p>Keep 100%</p></div></div></div>
            <div class="pricing"><div class="pricing-big">$10</div><div class="pricing-sub">one-time listing fee</div><ul><li>Keep 100% of sales</li><li>No monthly fees</li><li>No commission</li><li>Listing never expires</li></ul></div>
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
                    <div class="dropzone-icon">📦</div>
                    <p>Drop 3D files here or click to upload</p>
                    <span>STL, STEP, OBJ, 3MF • Multiple files allowed</span>
                </div>
                <input type="file" id="fileInput" hidden multiple accept=".stl,.step,.stp,.obj,.3mf" onchange="handleMultiFileSelect(event)">
                <div class="uploaded-files-list" id="uploadedFilesList"></div>
            </div>
            <div class="field"><label>Photos <span class="required-star">*</span> (First photo = thumbnail)</label><div class="photo-grid" id="photoGrid"><div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div></div><input type="file" id="photoInput" accept="image/*" multiple hidden onchange="handlePhotoUpload(event)"><p class="field-hint">At least 1 photo required</p></div>
            <div class="upsell-box"><label class="upsell-label"><input type="checkbox" id="featuredCheckbox" onchange="updateTotal()"><div class="upsell-content"><span class="upsell-badge">FEATURED</span><strong>Get Featured Placement +$20</strong><p>Your listing appears in the Featured section for 30 days.</p></div></label></div>
            <div class="form-total"><span>Total</span><span id="totalPrice">$10.00</span></div>
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
                    <div class="file-icon">📄</div>
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

function updateTotal() { document.getElementById('totalPrice').textContent = document.getElementById('featuredCheckbox')?.checked ? '$30.00' : '$10.00'; }

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
    
    const images = p.images || [p.img] || ['https://via.placeholder.com/600x450'];
    const reviews = p.reviews || [];
    
    // FIX 13: Show 3D viewer + images together like Thingiverse
    const hasFile = !!p.file_url;
    
    return `<div class="detail">
        <div class="detail-gallery">
            <div class="viewer-container" id="viewer3d"></div>
            <div class="gallery-thumbs">
                ${hasFile ? `<button class="thumb-3d active" onclick="show3DViewer()">3D</button>` : ''}
                ${images.map((img, i) => `<img src="${img}" alt="${p.title}" class="thumb" onclick="showGalleryImage('${img}', this)">`).join('')}
            </div>
        </div>
        <div class="detail-info">
            ${p.featured ? '<span class="detail-featured-badge">Featured</span>' : ''}
            <div class="detail-breadcrumb">${p.make} / ${p.model} / ${p.category}</div>
            <h1>${p.title}</h1>
            <div class="detail-seller"><span class="seller-avatar">${(p.seller_name||'S').charAt(0)}</span><span>by <strong>${p.seller_name || 'Seller'}</strong></span><span class="detail-downloads">${p.downloads || 0} downloads</span></div>
            <div class="detail-price">$${(p.price || 0).toFixed(2)}</div>
            <div class="detail-trust"><span>Secure Payment</span><span>Instant Download</span><span>$10 Listing Fee</span></div>
            <div class="detail-actions">
                ${p.purchased || (currentUser && currentUser.id === p.user_id) ? 
                    (p.file_urls && p.file_urls.length > 1 ? 
                        `<button class="btn btn-lg btn-primary" onclick="downloadPackageZip(${p.id}, '${(p.title || 'part').replace(/'/g, "\\'")}')">📦 Download All (${p.file_urls.length} files)</button>` :
                        `<a href="${p.file_url}" download class="btn btn-lg btn-primary">Download File</a>`) :
                    `<button class="btn btn-lg btn-primary" onclick="handleBuyPart(${p.id})">Buy Now - $${(p.price || 0).toFixed(2)}</button>`}
                <button class="btn btn-lg btn-outline" onclick="openContactModal(${p.user_id}, '${(p.seller_name || 'Seller').replace(/'/g, "\\'")}', '${(p.title || '').replace(/'/g, "\\'")}', ${p.id}, '${(p.images && p.images[0] || '').replace(/'/g, "\\'")}')">Contact Seller</button>
            </div>
            ${p.file_urls && p.file_urls.length > 1 ? `
            <div class="package-files-section">
                <h3>📦 Package Contents (${p.file_urls.length} files)</h3>
                <div class="package-files-list">
                    ${p.file_urls.map((f, i) => `
                        <div class="package-file-item">
                            <span class="package-file-icon">📄</span>
                            <span class="package-file-name">${f.name}</span>
                            <span class="package-file-size">${(f.size / 1024).toFixed(1)} KB</span>
                            ${p.purchased || (currentUser && currentUser.id === p.user_id) ? 
                                `<a href="${f.url}" download class="package-file-download">↓</a>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
            ${currentUser && currentUser.id === p.user_id ? `
            <div class="owner-actions">
                <button class="btn btn-outline" onclick="go('edit', ${p.id})">Edit Listing</button>
                <button class="btn btn-outline btn-danger" onclick="handleDeletePart(${p.id})">Delete</button>
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
            <div class="print-ship-cta"><div class="print-ship-header"><div><strong>Print & Ship</strong><span>Don't have a printer? We'll print and ship it to you.</span></div></div><div class="print-ship-options"><button class="btn btn-sm" onclick="go('printshops', ${p.id})">Find Local Shop</button><button class="btn btn-sm btn-primary" onclick="alert('Print & Ship coming soon!')">Get Instant Quote</button></div></div>
            <div class="detail-desc"><h2>Description</h2><p>${p.description || ''}</p></div>
            <div class="specs"><h2>Specifications</h2><div class="spec-row"><span>Vehicle</span><span>${p.make} ${p.model}</span></div><div class="spec-row"><span>Category</span><span>${p.category}</span></div><div class="spec-row"><span>Format</span><span>${p.file_format || 'STL'}</span></div><div class="spec-row"><span>File Size</span><span>${p.file_size || 'N/A'}</span></div><div class="spec-row"><span>Material</span><span>${p.material || 'PLA'}</span></div><div class="spec-row"><span>Infill</span><span>${p.infill || '25%'}</span></div></div>
            
            ${reviews.length ? `<div class="reviews-section"><h2>Reviews (${reviews.length})</h2>${reviews.map(r => `<div class="review"><div class="review-header"><strong>${r.reviewer_name}</strong><span class="review-rating">${'*'.repeat(r.rating)} (${r.rating}/5)</span></div><p>${r.comment || ''}</p></div>`).join('')}</div>` : ''}
            
            ${currentUser ? `<div class="write-review"><h3>Write a Review</h3><form onsubmit="handleReview(event, ${p.id})"><div class="field"><label>Rating</label><select id="reviewRating"><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Terrible</option></select></div><div class="field"><label>Comment</label><textarea id="reviewComment" rows="3" placeholder="Share your experience..."></textarea></div><button type="submit" class="btn btn-primary">Submit Review</button></form></div>` : ''}
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
        const result = await api(`/api/parts/${partId}/purchase`, { method: 'POST' });
        
        // v5.0: Show download modal with actual download link
        showDownloadModal(result);
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
                <div class="download-file-icon">📦</div>
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

function printShopsView(partId) {
    const part = partId ? parts.find(x => x.id === partId) : null;
    return `<div class="page-header"><h1>Find a Print Shop</h1><p>Get your part printed and shipped to you.</p></div>
        ${part ? `<div class="selected-part-banner"><img src="${part.images?.[0] || part.img}" alt="${part.title}"><div class="selected-part-info"><strong>${part.title}</strong><span>${part.make} ${part.model} - ${part.file_format} - ${part.file_size}</span></div></div>` : ''}
        <div class="location-search"><input type="text" id="locationInput" placeholder="Enter your city or zip code..."><button class="btn" onclick="alert('Search coming soon')">Search</button><button class="btn btn-outline" onclick="useMyLocation()">Use My Location</button></div>
        <div class="sample-disclaimer">Sample data — real print shops coming soon</div>
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

// FIX 9: Show all parts with warnings when viewing own profile
async function profileView(id) {
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
    
    // Truncate title to max length
    const displayTitle = truncateText(p.title, TITLE_MAX_LENGTH);
    
    // Seller info
    const sellerName = p.seller_name || 'Seller';
    const sellerInitial = sellerName.charAt(0).toUpperCase();
    const sellerAvatar = p.seller_avatar_url;
    
    // Featured border
    const isFeatured = p.featured || p.premiered;
    const cardClass = isFeatured ? 'card card-featured' : 'card';
    
    return `<div class="${cardClass}" onclick="go('part', ${p.id}); return false;">
        <div class="card-image">
            <img src="${img}" alt="${displayTitle}" onerror="${errorFallback}">
            <span class="card-badge">${p.category || 'Part'}</span>
            ${isFeatured ? '<span class="card-featured-badge">★ FEATURED</span>' : ''}
        </div>
        <div class="card-body">
            <div class="card-title">${displayTitle}</div>
            <div class="card-seller">
                <div class="card-seller-avatar">${sellerAvatar ? `<img src="${sellerAvatar}" alt="${sellerName}">` : sellerInitial}</div>
                <span class="card-seller-name">${sellerName}</span>
            </div>
            <div class="card-meta">
                <span class="card-cat">${p.make && p.make !== 'Non-Specific' ? p.make : ''}${p.model && p.model !== 'All' && p.model !== 'Any' ? ' ' + p.model : ''}</span>
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

function handlePhotoUpload(event) { for (let file of event.target.files) { if (uploadedPhotos.length >= 10) break; uploadedPhotoFiles.push(file); const reader = new FileReader(); reader.onload = e => { uploadedPhotos.push(e.target.result); renderPhotoGrid(); }; reader.readAsDataURL(file); } }
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

function initViewer(partId) {
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
    
    const fileUrl = p.file_url;
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
function show3DViewer() {
    document.querySelectorAll('.thumb, .thumb-3d').forEach(t => t.classList.remove('active'));
    document.querySelector('.thumb-3d')?.classList.add('active');
    const viewer = document.getElementById('viewer3d');
    if (viewer) viewer.style.display = 'block';
    const heroImg = document.getElementById('galleryHeroImage');
    if (heroImg) heroImg.style.display = 'none';
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

// Initialize
console.log(`ForgAuto v${VERSION} loaded`);
// Initialize app
checkAuth().then(() => {
    const initialData = initFromHash();
    // Set initial state in history
    history.replaceState({ view, data: initialData }, '', window.location.hash || '#home');
    render(initialData);
});

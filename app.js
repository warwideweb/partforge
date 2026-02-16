// ForgAuto — 3D Marketplace for Cars
// Version: 2.3

const VERSION = '2.3';

// Dark mode
let darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) document.body.classList.add('dark');

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark', darkMode);
    document.getElementById('darkToggle').textContent = darkMode ? 'Light' : 'Dark';
}

// Data
const parts = [
    { id: 1, title: "Tesla-Style Phone Mount", cat: "Interior", make: "Universal", model: "All", price: 3.99, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop"], seller: "AutoParts3D", email: "auto@example.com", desc: "Minimalist phone mount for car vents with ball joint design for 360 rotation. Fits phones up to 6.7 inches.", format: "STL, STEP", size: "1.8 MB", material: "PLA", infill: "25%", downloads: 567, featured: true, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 2, title: "BMW E30 Phone Dock", cat: "Interior", make: "BMW", model: "E30", price: 5.99, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=450&fit=crop"], seller: "BimmerParts", email: "bmw@example.com", desc: "Custom phone dock that fits perfectly in the BMW E30 center console.", format: "STL", size: "2.1 MB", material: "PETG", infill: "30%", downloads: 312, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 3, title: "Toyota Supra MK4 Vent Gauge Pod", cat: "Gauges", make: "Toyota", model: "Supra MK4", price: 8.99, img: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&h=450&fit=crop"], seller: "JDMParts3D", email: "jdm@example.com", desc: "52mm gauge pod that replaces the center vent on MK4 Supra. Perfect fit.", format: "STL, STEP", size: "3.4 MB", material: "ABS", infill: "40%", downloads: 523, featured: true, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 4, title: "Honda Civic EG Cup Holder", cat: "Interior", make: "Honda", model: "Civic EG", price: 4.49, img: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=450&fit=crop"], seller: "HondaHacks", email: "honda@example.com", desc: "Dual cup holder insert for Honda Civic EG center console. Snug fit.", format: "STL", size: "1.6 MB", material: "PLA", infill: "25%", downloads: 445, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 5, title: "Mazda Miata NA Phone Mount", cat: "Interior", make: "Mazda", model: "Miata NA", price: 6.99, img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=450&fit=crop"], seller: "MiataMods", email: "miata@example.com", desc: "Low-profile phone mount for NA Miata. Attaches to tombstone.", format: "STL", size: "1.9 MB", material: "PETG", infill: "30%", downloads: 678, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 6, title: "BMW E46 Coin Holder Delete", cat: "Interior", make: "BMW", model: "E46", price: 3.49, img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=450&fit=crop"], seller: "BimmerParts", email: "bmw@example.com", desc: "Clean delete panel for the E46 coin holder.", format: "STL", size: "0.8 MB", material: "PLA", infill: "20%", downloads: 234, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 7, title: "Nissan 350Z Triple Gauge Pod", cat: "Gauges", make: "Nissan", model: "350Z", price: 12.99, img: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&h=450&fit=crop"], seller: "ZCarParts", email: "zcar@example.com", desc: "A-pillar triple gauge pod for 350Z. Fits three 52mm gauges.", format: "STL, STEP", size: "4.8 MB", material: "ABS", infill: "35%", downloads: 389, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 8, title: "Subaru WRX Shift Boot Surround", cat: "Interior", make: "Subaru", model: "WRX", price: 4.99, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=450&fit=crop"], seller: "SubieParts", email: "subie@example.com", desc: "Custom shift boot surround for GD WRX.", format: "STL", size: "1.4 MB", material: "PETG", infill: "25%", downloads: 456, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 9, title: "Ford Mustang S550 Cup Holder Insert", cat: "Interior", make: "Ford", model: "Mustang S550", price: 5.49, img: "https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=600&h=450&fit=crop"], seller: "StangMods", email: "stang@example.com", desc: "Rubber-lined cup holder insert to prevent rattling.", format: "STL", size: "1.1 MB", material: "TPU", infill: "30%", downloads: 567, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 10, title: "VW Golf MK7 Air Vent Phone Mount", cat: "Interior", make: "Volkswagen", model: "Golf MK7", price: 4.99, img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=450&fit=crop"], seller: "VWMods", email: "vw@example.com", desc: "Secure phone mount that clips into MK7 Golf air vents.", format: "STL", size: "1.3 MB", material: "PETG", infill: "25%", downloads: 612, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 11, title: "Universal Exhaust Tip 3in Inlet", cat: "Exterior", make: "Universal", model: "All", price: 9.99, img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=450&fit=crop"], seller: "ExhaustMods", email: "exhaust@example.com", desc: "Aggressive slash-cut exhaust tip with 3in inlet.", format: "STL, STEP", size: "2.2 MB", material: "ASA", infill: "50%", downloads: 234, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 12, title: "Honda S2000 Arm Rest Delete", cat: "Interior", make: "Honda", model: "S2000", price: 7.99, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop"], seller: "S2KParts", email: "s2k@example.com", desc: "Clean arm rest delete panel for AP1/AP2 S2000.", format: "STL", size: "1.5 MB", material: "ABS", infill: "30%", downloads: 345, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 13, title: "Chevrolet Camaro 6th Gen Phone Mount", cat: "Interior", make: "Chevrolet", model: "Camaro 6th Gen", price: 5.99, img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=450&fit=crop"], seller: "CamaroParts", email: "camaro@example.com", desc: "Dash-mounted phone holder for 6th gen Camaro.", format: "STL", size: "1.7 MB", material: "PETG", infill: "25%", downloads: 423, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 14, title: "Toyota GR86 / BRZ Shifter Surround", cat: "Interior", make: "Toyota", model: "GR86", price: 6.49, img: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=600&h=450&fit=crop"], seller: "86Parts", email: "86@example.com", desc: "Replacement shifter surround for GR86/BRZ with cleaner design.", format: "STL, STEP", size: "2.0 MB", material: "ABS", infill: "30%", downloads: 289, featured: true, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" },
    { id: 15, title: "Universal License Plate Frame", cat: "Exterior", make: "Universal", model: "All", price: 2.99, img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=450&fit=crop"], seller: "AutoMods", email: "auto@example.com", desc: "Simple, clean license plate frame. No dealer branding.", format: "STL", size: "0.9 MB", material: "ASA", infill: "40%", downloads: 1234, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_tilt.stl" },
    { id: 16, title: "Porsche 911 997 Key Holder", cat: "Accessories", make: "Porsche", model: "911 997", price: 8.99, img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=450&fit=crop", imgs: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=450&fit=crop"], seller: "PorscheParts", email: "porsche@example.com", desc: "Wall-mounted key holder shaped like 997 silhouette.", format: "STL", size: "1.8 MB", material: "PLA", infill: "20%", downloads: 567, stl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl" }
];

const recentSales = [
    { part: "Tesla-Style Phone Mount", buyer: "Mike T.", location: "California", time: "2 min ago" },
    { part: "BMW E30 Phone Dock", buyer: "Sarah K.", location: "Texas", time: "5 min ago" },
    { part: "Miata NA Phone Mount", buyer: "Jake R.", location: "Florida", time: "8 min ago" },
    { part: "VW Golf MK7 Mount", buyer: "Emma L.", location: "New York", time: "12 min ago" },
    { part: "Supra MK4 Gauge Pod", buyer: "Chris P.", location: "Germany", time: "15 min ago" },
    { part: "S2000 Arm Rest Delete", buyer: "David M.", location: "Japan", time: "18 min ago" },
    { part: "350Z Triple Gauge Pod", buyer: "Alex W.", location: "UK", time: "22 min ago" },
    { part: "License Plate Frame", buyer: "Lisa H.", location: "Canada", time: "25 min ago" }
];

const affiliateProducts = [
    { name: "Creality Ender 3 V3", type: "3D Printer", price: "$199", link: "https://amazon.com" },
    { name: "Bambu Lab P1S", type: "3D Printer", price: "$699", link: "https://amazon.com" },
    { name: "Hatchbox PLA Filament", type: "Filament", price: "$23", link: "https://amazon.com" },
    { name: "Overture PETG", type: "Filament", price: "$20", link: "https://amazon.com" },
    { name: "Digital Calipers", type: "Tool", price: "$15", link: "https://amazon.com" },
    { name: "Heat Gun", type: "Tool", price: "$25", link: "https://amazon.com" }
];

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

const designers = [
    { id: 1, name: "Alex Chen", title: "Automotive Engineer", rate: "$50/hr", rating: 4.9, reviews: 47, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", email: "alex@example.com", tags: ["JDM", "European", "Interior"], bio: "10+ years designing aftermarket auto parts. Fusion 360 and SolidWorks expert.", projects: 127 },
    { id: 2, name: "Mike Rodriguez", title: "JDM Specialist", rate: "$40/hr", rating: 4.8, reviews: 89, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop", email: "mike@example.com", tags: ["Honda", "Toyota", "Nissan"], bio: "JDM enthusiast with 200+ parts designed for Honda, Toyota, and Nissan platforms.", projects: 213 },
    { id: 3, name: "Sarah Miller", title: "Interior Specialist", rate: "$45/hr", rating: 5.0, reviews: 34, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop", email: "sarah@example.com", tags: ["Interior", "Trim", "Luxury"], bio: "Former BMW interior designer. Creating premium-feel parts for enthusiast cars.", projects: 89 },
    { id: 4, name: "James Park", title: "Performance Parts Designer", rate: "$55/hr", rating: 4.7, reviews: 28, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", email: "james@example.com", tags: ["Performance", "Aero", "Cooling"], bio: "Ex-Tesla engineer specializing in functional aero and cooling parts.", projects: 78 },
    { id: 5, name: "Emily Watson", title: "Euro Car Expert", rate: "$45/hr", rating: 4.9, reviews: 62, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", email: "emily@example.com", tags: ["BMW", "VW", "Porsche"], bio: "European car specialist. Perfect fitment guaranteed for German vehicles.", projects: 156 },
    { id: 6, name: "David Kim", title: "Muscle Car Specialist", rate: "$40/hr", rating: 4.8, reviews: 41, img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop", email: "david@example.com", tags: ["Mustang", "Camaro", "American"], bio: "American muscle car enthusiast. Designing parts for Mustangs and Camaros.", projects: 98 }
];

const printShops = [
    { name: "3D Print Lab Bangkok", address: "123 Sukhumvit Rd, Bangkok", distance: "2.3 km", rating: 4.8, reviews: 156, phone: "+66 2 123 4567", email: "contact@3dprintlab.th", verified: true, instantQuote: true, printAndShip: true, turnaround: "2-3 days" },
    { name: "MakerSpace BKK", address: "456 Silom Rd, Bangkok", distance: "4.1 km", rating: 4.6, reviews: 89, phone: "+66 2 234 5678", email: "hello@makerspace.co.th", verified: true, instantQuote: true, printAndShip: false, turnaround: "3-5 days" },
    { name: "Proto3D Thailand", address: "789 Rama IV, Bangkok", distance: "5.8 km", rating: 4.9, reviews: 234, phone: "+66 2 345 6789", email: "orders@proto3d.th", verified: true, instantQuote: true, printAndShip: true, turnaround: "1-2 days" },
    { name: "QuickPrint Shop", address: "321 Rama III, Bangkok", distance: "7.2 km", rating: 4.4, reviews: 67, phone: "+66 2 456 7890", email: "info@quickprint.th", verified: false, instantQuote: false, printAndShip: false, turnaround: "5-7 days" }
];

let view = 'home', filter = '', filterCat = '', filterMake = '', filterModel = '', uploadedPhotos = [];

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

function render(data) {
    const app = document.getElementById('app');
    if (view === 'home') app.innerHTML = homeView();
    else if (view === 'browse') app.innerHTML = browseView();
    else if (view === 'designers') app.innerHTML = designersView();
    else if (view === 'sell') app.innerHTML = sellView();
    else if (view === 'part') { app.innerHTML = partView(data); initViewer(data); }
    else if (view === 'designer') app.innerHTML = designerView(data);
    else if (view === 'printshops') app.innerHTML = printShopsView(data);
}

function openLightbox(src) { document.getElementById('lightbox').classList.add('active'); document.getElementById('lightboxImg').src = src; }
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); }

function homeView() {
    const trendingParts = [...parts].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
    const featuredParts = parts.filter(p => p.featured);
    
    return `
        <div class="sold-ticker"><div class="ticker-content">
            ${recentSales.concat(recentSales).map(s => `<span class="ticker-item"><strong>${s.buyer}</strong> from ${s.location} bought <strong>${s.part}</strong> - ${s.time}</span>`).join('')}
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

        <div class="section affiliate-section"><div class="section-head"><h2>Recommended Gear</h2><span class="affiliate-note">We may earn commission</span></div>
            <div class="affiliate-grid">${affiliateProducts.map(p => `<a href="${p.link}" target="_blank" class="affiliate-item"><div class="affiliate-info"><strong>${p.name}</strong><span>${p.type}</span></div><span class="affiliate-price">${p.price}</span></a>`).join('')}</div>
        </div>

        <div class="section featured-designers"><div class="section-head"><h2>Top Designers</h2><a href="#" onclick="go('designers')">View all</a></div>
            <div class="designers-preview">${designers.slice(0, 3).map(d => `<div class="designer-mini" onclick="go('designer', ${d.id})"><img src="${d.img}" alt="${d.name}"><div class="designer-mini-info"><strong>${d.name}</strong><span>${d.title}</span><span class="designer-mini-rate">${d.rate} - ${d.rating} stars</span></div></div>`).join('')}</div>
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
    if (filter) { const q = filter.toLowerCase(); filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || (p.make && p.make.toLowerCase().includes(q)) || (p.model && p.model.toLowerCase().includes(q))); }
    if (filterCat) filtered = filtered.filter(p => p.cat === filterCat);
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
        <div class="designers-grid">${designers.map(d => `<div class="designer" onclick="go('designer', ${d.id})"><div class="designer-top"><img src="${d.img}" alt="${d.name}"><div><h3>${d.name}</h3><p>${d.title}</p></div></div><div class="designer-stats"><span class="designer-rate">${d.rate}</span><span class="designer-rating">${d.rating} stars (${d.reviews})</span></div><div class="tags">${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div><div class="designer-projects">${d.projects} completed projects</div></div>`).join('')}</div>`;
}

function sellView() {
    return `<div class="sell-layout">
        <div class="sell-info"><h1>Sell your car parts</h1><p>Upload your designs, set your price, start earning.</p>
            <div class="steps"><div class="step"><div class="step-num">1</div><div><h4>Upload files</h4><p>3D files + photos</p></div></div><div class="step"><div class="step-num">2</div><div><h4>Pay listing fee</h4><p>One-time $5</p></div></div><div class="step"><div class="step-num">3</div><div><h4>Get paid</h4><p>Keep 100%</p></div></div></div>
            <div class="pricing"><div class="pricing-big">$5</div><div class="pricing-sub">one-time listing fee</div><ul><li>Keep 100% of sales</li><li>No monthly fees</li><li>No commission</li><li>Listing never expires</li></ul></div>
        </div>
        <div class="form"><h2>Create Listing</h2>
            <div class="field"><label>Part Name</label><input type="text" placeholder="e.g., BMW E30 Phone Mount"></div>
            <div class="field"><label>Description</label><textarea rows="4" placeholder="Describe fitment, materials..."></textarea></div>
            <div class="field-row"><div class="field"><label>Make</label><select id="sellMake" onchange="updateSellModels()">${carMakes.map(m => `<option>${m}</option>`).join('')}</select></div><div class="field"><label>Model</label><select id="sellModel"><option>Select model...</option></select></div></div>
            <div class="field-row"><div class="field"><label>Category</label><select>${categories.map(c => `<option>${c.name}</option>`).join('')}</select></div><div class="field"><label>Price (USD)</label><input type="number" placeholder="4.99" min="0.99" step="0.01"></div></div>
            <div class="field"><label>3D File *</label><div class="dropzone"><div class="dropzone-icon">+</div><p>Drop 3D file here</p><span>STL, STEP, OBJ, 3MF</span></div></div>
            <div class="field"><label>Photos *</label><div class="photo-grid" id="photoGrid"><div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div></div><input type="file" id="photoInput" accept="image/*" multiple hidden onchange="handlePhotoUpload(event)"></div>
            <div class="field"><label>Your Email</label><input type="email" placeholder="you@example.com"></div>
            <div class="upsell-box"><label class="upsell-label"><input type="checkbox" id="featuredCheckbox" onchange="updateTotal()"><div class="upsell-content"><span class="upsell-badge">FEATURED</span><strong>Get Featured Placement +$10</strong><p>Your listing appears in the Featured section for 30 days.</p></div></label></div>
            <div class="form-total"><span>Total</span><span id="totalPrice">$5.00</span></div>
            <button class="btn btn-lg" style="width:100%">Continue to Payment</button>
        </div>
    </div>`;
}

function updateTotal() { document.getElementById('totalPrice').textContent = document.getElementById('featuredCheckbox')?.checked ? '$15.00' : '$5.00'; }

function partView(id) {
    const p = parts.find(x => x.id === id);
    if (!p) return '<p>Part not found.</p>';
    return `<div class="detail">
        <div class="detail-gallery">
            <div class="viewer-container" id="viewer3d"><div class="viewer-hint">Drag to rotate - Scroll to zoom</div></div>
            <div class="gallery-thumbs">${(p.imgs || [p.img]).map((img, i) => `<img src="${img}" alt="${p.title}" class="thumb ${i===0?'active':''}" onclick="openLightbox('${img}')">`).join('')}</div>
        </div>
        <div class="detail-info">
            ${p.featured ? '<span class="detail-featured-badge">Featured</span>' : ''}
            <div class="detail-breadcrumb">${p.make} / ${p.model} / ${p.cat}</div>
            <h1>${p.title}</h1>
            <div class="detail-seller"><span class="seller-avatar">${p.seller.charAt(0)}</span><span>by <strong>${p.seller}</strong></span><span class="detail-downloads">${p.downloads} downloads</span></div>
            <div class="detail-price">$${p.price.toFixed(2)}</div>
            <div class="detail-trust"><span>Secure</span><span>Instant Download</span><span>Money Back</span></div>
            <div class="detail-actions"><button class="btn btn-lg btn-primary">Buy Now - $${p.price.toFixed(2)}</button><a href="mailto:${p.email}?subject=Question: ${p.title}" class="btn btn-lg btn-outline">Contact Seller</a></div>
            <div class="print-ship-cta"><div class="print-ship-header"><div><strong>Print & Ship</strong><span>Don't have a printer? We'll print it and ship it to you.</span></div></div><div class="print-ship-options"><button class="btn btn-sm" onclick="go('printshops', ${p.id})">Find Local Shop</button><button class="btn btn-sm btn-primary" onclick="alert('Print & Ship coming soon!')">Get Instant Quote</button></div></div>
            <div class="detail-desc"><h2>Description</h2><p>${p.desc}</p></div>
            <div class="specs"><h2>Specifications</h2><div class="spec-row"><span>Vehicle</span><span>${p.make} ${p.model}</span></div><div class="spec-row"><span>Category</span><span>${p.cat}</span></div><div class="spec-row"><span>Format</span><span>${p.format}</span></div><div class="spec-row"><span>File Size</span><span>${p.size}</span></div><div class="spec-row"><span>Material</span><span>${p.material}</span></div><div class="spec-row"><span>Infill</span><span>${p.infill}</span></div></div>
            <div class="part-actions-secondary"><button class="btn btn-outline btn-sm">Save</button><button class="btn btn-outline btn-sm">Share</button><button class="btn btn-outline btn-sm">Report</button></div>
        </div>
    </div>
    <div class="section"><div class="section-head"><h2>Similar Parts</h2></div><div class="grid">${parts.filter(x => x.id !== p.id && (x.make === p.make || x.cat === p.cat)).slice(0, 4).map(cardHTML).join('')}</div></div>
    <div id="lightbox" class="lightbox" onclick="closeLightbox()"><button class="lightbox-close" onclick="closeLightbox()">x</button><img id="lightboxImg" src="" alt="Zoomed image"></div>`;
}

function printShopsView(partId) {
    const part = partId ? parts.find(x => x.id === partId) : null;
    return `<div class="page-header"><h1>Find a Print Shop</h1><p>Get your part printed and shipped to you.</p></div>
        ${part ? `<div class="selected-part-banner"><img src="${part.img}" alt="${part.title}"><div class="selected-part-info"><strong>${part.title}</strong><span>${part.make} ${part.model} - ${part.format} - ${part.size}</span></div></div>` : ''}
        <div class="location-search"><input type="text" id="locationInput" placeholder="Enter your city or zip code..."><button class="btn" onclick="searchPrintShops()">Search</button><button class="btn btn-outline" onclick="useMyLocation()">Use My Location</button></div>
        <div class="print-shops-list">${printShops.map(shop => `<div class="print-shop-card ${shop.verified ? 'verified' : ''}"><div class="print-shop-header"><div><h3>${shop.name} ${shop.verified ? '<span class="verified-badge">Verified</span>' : ''}</h3>${shop.instantQuote ? '<span class="instant-badge">Instant Quotes</span>' : ''}${shop.printAndShip ? '<span class="ship-badge">Print & Ship</span>' : ''}</div><span class="print-shop-distance">${shop.distance}</span></div><p class="print-shop-address">${shop.address}</p><div class="print-shop-meta"><span>${shop.rating} stars (${shop.reviews})</span><span>${shop.turnaround}</span></div><div class="print-shop-actions"><a href="tel:${shop.phone}" class="btn btn-sm btn-outline">Call</a>${shop.instantQuote ? `<button class="btn btn-sm btn-primary" onclick="alert('Instant quote: ~$${(Math.random() * 20 + 10).toFixed(2)}')">Instant Quote</button>` : ''}<a href="mailto:${shop.email}${part ? `?subject=Print: ${part.title}` : ''}" class="btn btn-sm btn-outline">Email</a></div></div>`).join('')}</div>`;
}

function designerView(id) {
    const d = designers.find(x => x.id === id);
    if (!d) return '<p>Designer not found.</p>';
    return `<div class="designer-profile"><div class="designer-header"><img src="${d.img}" alt="${d.name}" class="designer-avatar-lg"><div class="designer-header-info"><h1>${d.name}</h1><p class="designer-title">${d.title}</p><div class="designer-meta"><span>${d.rating} stars (${d.reviews} reviews)</span><span>${d.projects} projects</span></div><div class="tags">${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div><div class="designer-cta"><div class="designer-rate-lg">${d.rate}</div><a href="mailto:${d.email}?subject=Custom Part Request" class="btn btn-lg btn-primary">Hire ${d.name.split(' ')[0]}</a></div></div><div class="designer-body"><div class="designer-about"><h2>About</h2><p>${d.bio}</p></div><div class="designer-portfolio"><h2>Recent Work</h2><div class="portfolio-grid">${parts.slice(0, 4).map(p => `<div class="portfolio-item" onclick="go('part', ${p.id})"><img src="${p.img}"><span>${p.title}</span></div>`).join('')}</div></div></div></div>`;
}

function cardHTML(p, showTrending = false, showFeatured = false) {
    return `<div class="card ${showFeatured ? 'card-featured' : ''}" onclick="go('part', ${p.id})"><div class="card-image"><img src="${p.img}" alt="${p.title}"><span class="card-badge">${p.cat}</span>${showTrending ? '<span class="trending-badge">HOT</span>' : ''}${showFeatured || p.featured ? '<span class="featured-badge-card">*</span>' : ''}</div><div class="card-body"><div class="card-title">${p.title}</div><div class="card-meta"><span class="card-cat">${p.make}${p.model && p.model !== 'All' ? ' ' + p.model : ''}</span><span class="card-price">$${p.price.toFixed(2)}</span></div></div></div>`;
}

function handlePhotoUpload(event) { for (let file of event.target.files) { if (uploadedPhotos.length >= 10) break; const reader = new FileReader(); reader.onload = e => { uploadedPhotos.push(e.target.result); renderPhotoGrid(); }; reader.readAsDataURL(file); } }
function renderPhotoGrid() { const grid = document.getElementById('photoGrid'); if (!grid) return; grid.innerHTML = uploadedPhotos.map((photo, i) => `<div class="photo-item"><img src="${photo}"><button class="photo-remove" onclick="removePhoto(${i})">x</button></div>`).join('') + (uploadedPhotos.length < 10 ? `<div class="photo-add" onclick="document.getElementById('photoInput').click()"><span class="photo-add-icon">+</span><span>Add</span></div>` : ''); }
function removePhoto(index) { uploadedPhotos.splice(index, 1); renderPhotoGrid(); }
function updateSellModels() { const make = document.getElementById('sellMake')?.value; const modelSelect = document.getElementById('sellModel'); if (!modelSelect || !make) return; modelSelect.innerHTML = '<option>Select model...</option>'; if (carModels[make]) carModels[make].forEach(m => { modelSelect.innerHTML += `<option value="${m}">${m}</option>`; }); }
function searchPrintShops() { alert('Searching for print shops in your area...'); }
function useMyLocation() { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { document.getElementById('locationInput').value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`; }); } }

function initViewer(partId) {
    const container = document.getElementById('viewer3d');
    if (!container || !window.THREE) return;
    const p = parts.find(x => x.id === partId);
    if (!p || !p.stl) return;
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
    const loader = new THREE.STLLoader();
    loader.load(p.stl, geometry => {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x2563eb, shininess: 50 }));
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        mesh.position.sub(center);
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        const scale = 50 / Math.max(size.x, size.y, size.z);
        mesh.scale.set(scale, scale, scale);
        scene.add(mesh);
    });
    (function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); })();
}

console.log(`ForgAuto v${VERSION} loaded`);
render();

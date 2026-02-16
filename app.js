// PartForge — Complete App Logic

// =============================================================================
// DATA
// =============================================================================

const parts = [
    {
        id: 1,
        title: "Universal Drone Motor Mount",
        category: "drone",
        price: 4.99,
        images: [
            "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=600&fit=crop"
        ],
        seller: "DroneBuilder",
        email: "dronebuilder@example.com",
        description: "Universal motor mount compatible with 2204-2306 motors. Designed for 5\" racing quads. Features integrated vibration dampening and easy installation with M3 hardware.",
        format: "STL",
        size: "2.4 MB",
        downloads: 234,
        material: "PETG or ABS recommended",
        infill: "40%"
    },
    {
        id: 2,
        title: "Tesla-Style Phone Mount",
        category: "automotive",
        price: 3.99,
        images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"
        ],
        seller: "AutoParts3D",
        email: "autoparts@example.com",
        description: "Minimalist phone mount for car vents. Ball joint design allows 360° rotation. Fits phones up to 6.7 inches with most cases.",
        format: "STL, STEP",
        size: "1.8 MB",
        downloads: 567,
        material: "PLA or PETG",
        infill: "25%"
    },
    {
        id: 3,
        title: "Raspberry Pi 4 Case with Fan",
        category: "electronics",
        price: 2.99,
        images: [
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&h=600&fit=crop"
        ],
        seller: "MakerSteve",
        email: "steve@makerspace.com",
        description: "Compact case for Raspberry Pi 4 with 40mm fan mount, GPIO access slots, and ventilation. Snap-fit design requires no screws for assembly.",
        format: "STL",
        size: "890 KB",
        downloads: 1205,
        material: "PLA",
        infill: "20%"
    },
    {
        id: 4,
        title: "Planetary Gear Set 5:1",
        category: "mechanical",
        price: 7.99,
        images: [
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=600&fit=crop"
        ],
        seller: "GearHead",
        email: "gearhead@example.com",
        description: "Fully printable 5:1 ratio planetary gearbox. Designed for NEMA 17 stepper motors. Smooth operation with proper lubrication.",
        format: "STL, STEP",
        size: "4.2 MB",
        downloads: 892,
        material: "PETG",
        infill: "60%"
    },
    {
        id: 5,
        title: "Modular Cable Management System",
        category: "home",
        price: 1.99,
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
        ],
        seller: "CleanDesk",
        email: "cleandesk@example.com",
        description: "Snap-together cable management system. Includes straight sections, corners, and T-junctions. Mounts with 3M adhesive strips.",
        format: "STL",
        size: "1.2 MB",
        downloads: 2341,
        material: "PLA",
        infill: "15%"
    },
    {
        id: 6,
        title: "RC Car Suspension Arms",
        category: "hobby",
        price: 5.99,
        images: [
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop"
        ],
        seller: "RCMaster",
        email: "rcmaster@example.com",
        description: "Replacement front suspension arms for 1/10 scale RC cars. Compatible with Traxxas Slash and similar vehicles. Reinforced design.",
        format: "STL",
        size: "3.1 MB",
        downloads: 445,
        material: "Nylon or PETG",
        infill: "50%"
    },
    {
        id: 7,
        title: "GoPro FPV Mount 30°",
        category: "drone",
        price: 2.49,
        images: [
            "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=600&fit=crop"
        ],
        seller: "FPVPilot",
        email: "fpvpilot@example.com",
        description: "30° tilted GoPro mount for FPV freestyle drones. TPU recommended for crash resistance. Fits Hero 8, 9, 10, 11, and 12.",
        format: "STL",
        size: "560 KB",
        downloads: 1123,
        material: "TPU 95A",
        infill: "100%"
    },
    {
        id: 8,
        title: "Arduino Uno Project Box",
        category: "electronics",
        price: 1.49,
        images: [
            "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&h=600&fit=crop"
        ],
        seller: "ElectroMaker",
        email: "em@example.com",
        description: "Clean project enclosure for Arduino Uno. Features lid with snap fit, ventilation holes, and mounting standoffs for the board.",
        format: "STL, STEP",
        size: "1.5 MB",
        downloads: 876,
        material: "PLA or PETG",
        infill: "20%"
    },
    {
        id: 9,
        title: "GT2 Timing Pulley Set",
        category: "mechanical",
        price: 4.49,
        images: [
            "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=600&fit=crop"
        ],
        seller: "CNCBuilder",
        email: "cnc@example.com",
        description: "GT2 timing pulleys in 16T, 20T, and 36T configurations. For CNC machines and 3D printer builds. 5mm bore standard.",
        format: "STL, STEP",
        size: "2.8 MB",
        downloads: 654,
        material: "PLA",
        infill: "100%"
    },
    {
        id: 10,
        title: "Dashboard Phone Holder",
        category: "automotive",
        price: 3.49,
        images: [
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"
        ],
        seller: "CarMods3D",
        email: "carmods@example.com",
        description: "Low-profile dashboard mount with spring-loaded grip. Uses 3M VHB tape for secure mounting. Fits phones with or without cases.",
        format: "STL",
        size: "980 KB",
        downloads: 432,
        material: "PETG",
        infill: "30%"
    },
    {
        id: 11,
        title: "Minimal Headphone Stand",
        category: "home",
        price: 2.99,
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop"
        ],
        seller: "DeskSetup",
        email: "desk@example.com",
        description: "Minimalist headphone stand with hidden cable management channel. Weighted base for stability. Fits all over-ear headphones.",
        format: "STL",
        size: "2.1 MB",
        downloads: 1567,
        material: "PLA",
        infill: "20%"
    },
    {
        id: 12,
        title: "9g Servo Mount Set",
        category: "hobby",
        price: 1.99,
        images: [
            "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&h=600&fit=crop"
        ],
        seller: "AeroRC",
        email: "aero@example.com",
        description: "Universal servo mounts for 9g micro servos. Set of 4 with different mounting angles for control surfaces on RC planes.",
        format: "STL",
        size: "450 KB",
        downloads: 234,
        material: "PLA",
        infill: "25%"
    }
];

const designers = [
    {
        id: 1,
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        title: "Mechanical Engineer",
        email: "alex@designstudio.com",
        rate: "$45/hr",
        projects: 127,
        rating: 4.9,
        tags: ["Mechanical", "Automotive", "Prototyping"],
        bio: "10+ years in product design. Specialized in functional mechanical parts and automotive components. I work with Fusion 360 and SolidWorks to deliver production-ready designs.",
        portfolio: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop"
        ]
    },
    {
        id: 2,
        name: "Sarah Miller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        title: "Industrial Designer",
        email: "sarah@creativeparts.io",
        rate: "$55/hr",
        projects: 89,
        rating: 5.0,
        tags: ["Consumer Products", "Enclosures", "Artistic"],
        bio: "Former Apple contractor specializing in consumer electronics. I design parts that look as good as they function. Expert in creating professional enclosures and aesthetic components.",
        portfolio: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
        ]
    },
    {
        id: 3,
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
        title: "Drone & RC Specialist",
        email: "mike@dronepartspro.com",
        rate: "$35/hr",
        projects: 213,
        rating: 4.8,
        tags: ["Drones", "FPV", "RC", "Hobby"],
        bio: "FPV pilot with 5 years of design experience. I've created parts for thousands of builds. Specializing in mounts, frames, and functional RC components that survive crashes.",
        portfolio: [
            "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop"
        ]
    },
    {
        id: 4,
        name: "Emily Watson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
        title: "Rapid Prototyper",
        email: "emily@protofast.design",
        rate: "$50/hr",
        projects: 156,
        rating: 4.9,
        tags: ["Prototyping", "Startups", "Fast Turnaround"],
        bio: "I help startups go from idea to physical prototype in days. 48-hour turnaround on most projects. Expert in both SLA and FDM design optimization.",
        portfolio: [
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop"
        ]
    },
    {
        id: 5,
        name: "James Park",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
        title: "Automotive Parts Designer",
        email: "james@autofab.design",
        rate: "$60/hr",
        projects: 78,
        rating: 4.7,
        tags: ["Automotive", "Carbon Fiber", "Performance"],
        bio: "Ex-Tesla engineer specializing in parts that handle real-world stress. Expert in automotive applications, especially EV and performance vehicles.",
        portfolio: [
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop"
        ]
    },
    {
        id: 6,
        name: "Lisa Tanaka",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
        title: "Electronics Enclosure Expert",
        email: "lisa@enclosurelab.com",
        rate: "$40/hr",
        projects: 198,
        rating: 4.9,
        tags: ["Electronics", "Enclosures", "IoT"],
        bio: "I design enclosures that protect your electronics and look professional. Waterproof, snap-fit, and custom solutions for any project size.",
        portfolio: [
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
        ]
    }
];

const categoryNames = {
    all: 'All Parts',
    drone: 'Drone & FPV',
    automotive: 'Automotive',
    electronics: 'Electronics',
    mechanical: 'Mechanical',
    home: 'Home & Office',
    hobby: 'RC & Hobby'
};

// =============================================================================
// STATE
// =============================================================================

let currentView = 'home';
let currentCategory = 'all';
let searchTimeout = null;

// =============================================================================
// NAVIGATION
// =============================================================================

function navigate(view, data = null) {
    // Update URL hash
    if (data) {
        window.location.hash = `${view}/${data}`;
    } else {
        window.location.hash = view;
    }
    
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show target view
    const viewEl = document.getElementById(view + 'View');
    if (viewEl) {
        viewEl.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === view) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu
    document.getElementById('mobileMenu').classList.remove('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    currentView = view;
    
    // Handle view-specific rendering
    if (view === 'browse') {
        renderBrowse();
    } else if (view === 'designers') {
        renderDesigners();
    } else if (view === 'part' && data) {
        renderPartDetail(parseInt(data));
    } else if (view === 'designer' && data) {
        renderDesignerDetail(parseInt(data));
    }
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// =============================================================================
// SEARCH
// =============================================================================

function handleNavSearch(event) {
    clearTimeout(searchTimeout);
    const query = event.target.value.trim();
    
    if (query.length < 2) {
        hideSearchResults();
        return;
    }
    
    searchTimeout = setTimeout(() => {
        const results = searchParts(query);
        showSearchDropdown(results);
    }, 200);
    
    if (event.key === 'Enter' && query) {
        hideSearchResults();
        currentCategory = 'all';
        navigate('browse');
        setTimeout(() => {
            document.getElementById('browseTitle').textContent = `Search: "${query}"`;
            renderBrowse(results);
        }, 100);
    }
}

function handleHeroSearch(event) {
    if (event.key === 'Enter') {
        performHeroSearch();
    }
}

function performHeroSearch() {
    const query = document.getElementById('heroSearchInput').value.trim();
    if (!query) return;
    
    const results = searchParts(query);
    currentCategory = 'all';
    navigate('browse');
    setTimeout(() => {
        document.getElementById('browseTitle').textContent = `Search: "${query}"`;
        renderBrowse(results);
    }, 100);
}

function searchParts(query) {
    const q = query.toLowerCase();
    return parts.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q)
    );
}

function showSearchDropdown(results) {
    const dropdown = document.getElementById('searchDropdown');
    
    if (results.length === 0) {
        dropdown.innerHTML = '<div class="search-result"><span>No results found</span></div>';
    } else {
        dropdown.innerHTML = results.slice(0, 5).map(part => `
            <div class="search-result" onclick="navigate('part', ${part.id})">
                <img src="${part.images[0]}" alt="${part.title}">
                <div class="search-result-info">
                    <h4>${part.title}</h4>
                    <span>$${part.price.toFixed(2)} · ${categoryNames[part.category]}</span>
                </div>
            </div>
        `).join('');
    }
    
    dropdown.classList.add('active');
}

function showSearchResults() {
    const query = document.getElementById('navSearch').value.trim();
    if (query.length >= 2) {
        const results = searchParts(query);
        showSearchDropdown(results);
    }
}

function hideSearchResults() {
    setTimeout(() => {
        document.getElementById('searchDropdown').classList.remove('active');
    }, 200);
}

// =============================================================================
// BROWSE & FILTER
// =============================================================================

function browseCategory(category) {
    currentCategory = category;
    navigate('browse');
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update active filter
    document.querySelectorAll('#categoryFilters .filter-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update title
    document.getElementById('browseTitle').textContent = categoryNames[category] || 'All Parts';
    
    renderBrowse();
}

function applyFilters() {
    renderBrowse();
}

function applySort() {
    renderBrowse();
}

function renderBrowse(customParts = null) {
    let filtered = customParts || [...parts];
    
    // Category filter
    if (!customParts && currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Price filter
    const minPrice = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Sort
    const sort = document.getElementById('sortSelect')?.value || 'newest';
    switch (sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filtered.sort((a, b) => b.downloads - a.downloads);
            break;
        default:
            filtered.sort((a, b) => b.id - a.id);
    }
    
    // Update count
    const countEl = document.getElementById('resultCount');
    if (countEl) {
        countEl.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    }
    
    // Render grid
    const grid = document.getElementById('browseGrid');
    if (grid) {
        grid.innerHTML = renderPartCards(filtered);
    }
}

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

function renderPartCards(partsToRender) {
    return partsToRender.map(part => `
        <div class="part-card" onclick="navigate('part', ${part.id})">
            <div class="part-card-image">
                <img src="${part.images[0]}" alt="${part.title}">
            </div>
            <div class="part-card-body">
                <h3 class="part-card-title">${part.title}</h3>
                <div class="part-card-meta">
                    <span class="part-card-category">${categoryNames[part.category]}</span>
                    <span class="part-card-price">$${part.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFeaturedParts() {
    const grid = document.getElementById('featuredParts');
    if (grid) {
        const featured = [...parts].sort((a, b) => b.downloads - a.downloads).slice(0, 8);
        grid.innerHTML = renderPartCards(featured);
    }
}

function renderDesigners() {
    const grid = document.getElementById('designersGrid');
    if (grid) {
        grid.innerHTML = designers.map(d => `
            <div class="designer-card" onclick="navigate('designer', ${d.id})">
                <div class="designer-header">
                    <img src="${d.avatar}" alt="${d.name}" class="designer-avatar">
                    <div class="designer-info">
                        <h3>${d.name}</h3>
                        <p>${d.title}</p>
                    </div>
                </div>
                <div class="designer-stats">
                    <span><strong>${d.projects}</strong> projects</span>
                    <span><strong>${d.rating}</strong> rating</span>
                </div>
                <div class="designer-rate">${d.rate}</div>
                <div class="designer-tags">
                    ${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
}

function renderPartDetail(id) {
    const part = parts.find(p => p.id === id);
    if (!part) return;
    
    const container = document.getElementById('partDetail');
    container.innerHTML = `
        <div class="part-gallery">
            <div class="part-main-image">
                <img src="${part.images[0]}" alt="${part.title}" id="mainImage">
            </div>
            ${part.images.length > 1 ? `
                <div class="part-thumbnails">
                    ${part.images.map((img, i) => `
                        <div class="part-thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
                            <img src="${img}" alt="View ${i + 1}">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        <div class="part-info-panel">
            <h1>${part.title}</h1>
            <p class="part-category">${categoryNames[part.category]} · by ${part.seller}</p>
            <div class="part-price">$${part.price.toFixed(2)}</div>
            <div class="part-actions">
                <button class="btn btn-primary btn-large" onclick="buyPart(${part.id})">Buy Now</button>
                <a href="mailto:${part.email}?subject=Question about: ${part.title}" class="btn btn-secondary btn-large">Contact Seller</a>
            </div>
            <div class="part-description">
                <h2>Description</h2>
                <p>${part.description}</p>
            </div>
            <div class="part-specs">
                <h2>Details</h2>
                <div class="spec-row">
                    <span>File Format</span>
                    <span>${part.format}</span>
                </div>
                <div class="spec-row">
                    <span>File Size</span>
                    <span>${part.size}</span>
                </div>
                <div class="spec-row">
                    <span>Recommended Material</span>
                    <span>${part.material}</span>
                </div>
                <div class="spec-row">
                    <span>Recommended Infill</span>
                    <span>${part.infill}</span>
                </div>
                <div class="spec-row">
                    <span>Downloads</span>
                    <span>${part.downloads.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

function renderDesignerDetail(id) {
    const designer = designers.find(d => d.id === id);
    if (!designer) return;
    
    const container = document.getElementById('designerDetail');
    container.innerHTML = `
        <div class="part-detail">
            <div>
                <div class="designer-header" style="margin-bottom: 32px;">
                    <img src="${designer.avatar}" alt="${designer.name}" class="designer-avatar" style="width: 100px; height: 100px;">
                    <div class="designer-info">
                        <h1 style="font-size: 1.75rem; margin-bottom: 4px;">${designer.name}</h1>
                        <p>${designer.title}</p>
                        <div class="designer-stats" style="margin-top: 12px;">
                            <span><strong>${designer.projects}</strong> projects</span>
                            <span><strong>${designer.rating}</strong> rating</span>
                        </div>
                    </div>
                </div>
                <div class="part-description">
                    <h2>About</h2>
                    <p>${designer.bio}</p>
                </div>
                <div style="margin-top: 32px;">
                    <h2 style="margin-bottom: 16px;">Portfolio</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        ${designer.portfolio.map(img => `
                            <div style="aspect-ratio: 1; border-radius: 8px; overflow: hidden;">
                                <img src="${img}" alt="Portfolio" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="part-info-panel">
                <div class="designer-rate" style="font-size: 2rem; margin-bottom: 24px;">${designer.rate}</div>
                <div class="part-actions">
                    <a href="mailto:${designer.email}?subject=Design Project Inquiry" class="btn btn-primary btn-large">Hire ${designer.name.split(' ')[0]}</a>
                    <a href="mailto:${designer.email}" class="btn btn-secondary btn-large">Send Message</a>
                </div>
                <div class="designer-tags" style="margin-top: 24px;">
                    ${designer.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function changeImage(src, el) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.part-thumbnail').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

// =============================================================================
// PURCHASE FLOW
// =============================================================================

function buyPart(id) {
    const part = parts.find(p => p.id === id);
    if (!part) return;
    
    // TODO: Integrate with Stripe
    alert(`Stripe checkout coming soon!\n\nPart: ${part.title}\nPrice: $${part.price.toFixed(2)}\n\nContact seller directly for now.`);
}

// =============================================================================
// FILE UPLOAD HANDLING
// =============================================================================

function setupFileUpload() {
    const dropZone = document.getElementById('fileDropZone');
    if (!dropZone) return;
    
    const input = dropZone.querySelector('input');
    const selected = document.getElementById('fileSelected');
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selected.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
            selected.classList.add('active');
        }
    });
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#000';
        dropZone.style.background = '#f5f5f5';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '';
        dropZone.style.background = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '';
        dropZone.style.background = '';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            input.files = e.dataTransfer.files;
            selected.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
            selected.classList.add('active');
        }
    });
}

function triggerImageUpload(index) {
    const slots = document.querySelectorAll('.image-upload-slot input');
    if (slots[index]) {
        slots[index].click();
    }
}

function handleImageUpload(input, index) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const slot = input.parentElement;
        let img = slot.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            slot.appendChild(img);
        }
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// =============================================================================
// FORM HANDLING
// =============================================================================

function setupListingForm() {
    const form = document.getElementById('listingForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // TODO: Replace with actual Stripe + R2 upload
        alert('Listing submission coming soon!\n\nWe\'re finalizing Stripe and file storage integration.');
    });
}

// =============================================================================
// ROUTING
// =============================================================================

function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [view, id] = hash.split('/');
    navigate(view, id);
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedParts();
    setupFileUpload();
    setupListingForm();
    handleRoute();
});

window.addEventListener('hashchange', handleRoute);

// Close search on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) {
        hideSearchResults();
    }
});

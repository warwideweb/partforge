// Data
const parts = [
    { id: 1, title: "Universal Drone Motor Mount", cat: "Drone", price: 4.99, img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=450&fit=crop", seller: "DroneBuilder", email: "drone@example.com", desc: "Universal motor mount compatible with 2204-2306 motors. Designed for 5\" racing quads with integrated vibration dampening.", format: "STL", size: "2.4 MB", material: "PETG", infill: "40%", downloads: 234 },
    { id: 2, title: "Tesla-Style Phone Mount", cat: "Auto", price: 3.99, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop", seller: "AutoParts3D", email: "auto@example.com", desc: "Minimalist phone mount for car vents with ball joint design for 360° rotation. Fits phones up to 6.7 inches.", format: "STL, STEP", size: "1.8 MB", material: "PLA", infill: "25%", downloads: 567 },
    { id: 3, title: "Raspberry Pi 4 Case", cat: "Electronics", price: 2.99, img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=450&fit=crop", seller: "MakerSteve", email: "steve@example.com", desc: "Compact case for Raspberry Pi 4 with 40mm fan mount and GPIO access. Snap-fit design requires no screws.", format: "STL", size: "890 KB", material: "PLA", infill: "20%", downloads: 1205 },
    { id: 4, title: "Planetary Gear Set 5:1", cat: "Mechanical", price: 7.99, img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=450&fit=crop", seller: "GearHead", email: "gear@example.com", desc: "Fully printable 5:1 ratio planetary gearbox designed for NEMA 17 stepper motors. Smooth operation.", format: "STL, STEP", size: "4.2 MB", material: "PETG", infill: "60%", downloads: 892 },
    { id: 5, title: "Modular Cable Clips", cat: "Home", price: 1.99, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=450&fit=crop", seller: "CleanDesk", email: "desk@example.com", desc: "Snap-together cable management. Includes straight sections, corners, and T-junctions.", format: "STL", size: "1.2 MB", material: "PLA", infill: "15%", downloads: 2341 },
    { id: 6, title: "RC Car Suspension Arms", cat: "Hobby", price: 5.99, img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=450&fit=crop", seller: "RCMaster", email: "rc@example.com", desc: "Replacement front suspension for 1/10 scale RC cars. Compatible with Traxxas Slash.", format: "STL", size: "3.1 MB", material: "Nylon", infill: "50%", downloads: 445 },
    { id: 7, title: "GoPro FPV Mount 30°", cat: "Drone", price: 2.49, img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&h=450&fit=crop", seller: "FPVPilot", email: "fpv@example.com", desc: "30° tilted GoPro mount for FPV freestyle. TPU recommended. Fits Hero 8-12.", format: "STL", size: "560 KB", material: "TPU", infill: "100%", downloads: 1123 },
    { id: 8, title: "Arduino Project Box", cat: "Electronics", price: 1.49, img: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=450&fit=crop", seller: "ElectroMaker", email: "em@example.com", desc: "Clean enclosure for Arduino Uno with ventilation and mounting standoffs.", format: "STL, STEP", size: "1.5 MB", material: "PLA", infill: "20%", downloads: 876 }
];

const categories = [
    { name: "Drone", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=300&fit=crop" },
    { name: "Auto", img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&h=300&fit=crop" },
    { name: "Electronics", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop" },
    { name: "Mechanical", img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop" },
    { name: "Home", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" },
    { name: "Hobby", img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=300&fit=crop" }
];

const designers = [
    { id: 1, name: "Alex Chen", title: "Mechanical Engineer", rate: "$45/hr", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", email: "alex@example.com", tags: ["Mechanical", "Automotive"], bio: "10+ years in product design. Fusion 360 and SolidWorks expert.", projects: 127 },
    { id: 2, name: "Sarah Miller", title: "Industrial Designer", rate: "$55/hr", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop", email: "sarah@example.com", tags: ["Consumer", "Enclosures"], bio: "Former Apple contractor. Beautiful, functional designs.", projects: 89 },
    { id: 3, name: "Mike Rodriguez", title: "Drone Specialist", rate: "$35/hr", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop", email: "mike@example.com", tags: ["Drones", "FPV", "RC"], bio: "FPV pilot turned designer. Parts for thousands of builds.", projects: 213 },
    { id: 4, name: "Emily Watson", title: "Rapid Prototyper", rate: "$50/hr", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", email: "emily@example.com", tags: ["Prototyping", "Startups"], bio: "Idea to prototype in 48 hours. SLA and FDM expert.", projects: 156 },
    { id: 5, name: "James Park", title: "Automotive Designer", rate: "$60/hr", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", email: "james@example.com", tags: ["Automotive", "Performance"], bio: "Ex-Tesla engineer. Parts that handle real stress.", projects: 78 },
    { id: 6, name: "Lisa Tanaka", title: "Enclosure Expert", rate: "$40/hr", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop", email: "lisa@example.com", tags: ["Electronics", "IoT"], bio: "Professional enclosures for any project.", projects: 198 }
];

let view = 'home';
let filter = '';

function go(v, data) {
    view = v;
    render(data);
    window.scrollTo(0, 0);
}

function search(e) {
    if (e.key === 'Enter') {
        filter = e.target.value;
        go('browse');
    }
}

function render(data) {
    const app = document.getElementById('app');
    
    if (view === 'home') app.innerHTML = homeView();
    else if (view === 'browse') app.innerHTML = browseView();
    else if (view === 'designers') app.innerHTML = designersView();
    else if (view === 'sell') app.innerHTML = sellView();
    else if (view === 'part') app.innerHTML = partView(data);
    else if (view === 'designer') app.innerHTML = designerView(data);
}

function homeView() {
    return `
        <div class="hero">
            <h1>3D parts marketplace</h1>
            <p>Buy STL files instantly. Sell your designs and keep 100%.</p>
            <div class="hero-search">
                <input type="text" placeholder="Search for parts..." onkeyup="search(event)">
                <button class="btn" onclick="go('browse')">Search</button>
            </div>
        </div>
        
        <div class="categories">
            <h2>Categories</h2>
            <div class="cat-grid">
                ${categories.map(c => `
                    <a href="#" class="cat-item" onclick="filter='${c.name}';go('browse')">
                        <img src="${c.img}" alt="${c.name}">
                        <span>${c.name}</span>
                    </a>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-head">
                <h2>Popular Parts</h2>
                <a href="#" onclick="go('browse')">View all</a>
            </div>
            <div class="grid">
                ${parts.slice(0, 8).map(cardHTML).join('')}
            </div>
        </div>
    `;
}

function browseView() {
    let filtered = parts;
    if (filter) {
        const q = filter.toLowerCase();
        filtered = parts.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.cat.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q)
        );
    }
    
    return `
        <div class="browse">
            <aside class="sidebar">
                <h3>Categories</h3>
                <ul>
                    <li><a href="#" onclick="filter='';go('browse')" class="${!filter?'active':''}">All Parts</a></li>
                    ${categories.map(c => `
                        <li><a href="#" onclick="filter='${c.name}';go('browse')" class="${filter===c.name?'active':''}">${c.name}</a></li>
                    `).join('')}
                </ul>
            </aside>
            <div>
                <div class="browse-head">
                    <h1>${filter || 'All Parts'}</h1>
                    <select onchange="sortParts(this.value)">
                        <option>Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Most Popular</option>
                    </select>
                </div>
                <div class="grid">
                    ${filtered.length ? filtered.map(cardHTML).join('') : '<p>No parts found.</p>'}
                </div>
            </div>
        </div>
    `;
}

function designersView() {
    return `
        <div style="text-align:center;margin-bottom:48px">
            <h1>Hire a Designer</h1>
            <p style="color:var(--muted);margin-top:8px">Need a custom part? Work with experienced designers.</p>
        </div>
        <div class="designers-grid">
            ${designers.map(d => `
                <div class="designer" onclick="go('designer', ${d.id})">
                    <div class="designer-top">
                        <img src="${d.img}" alt="${d.name}">
                        <div>
                            <h3>${d.name}</h3>
                            <p>${d.title}</p>
                        </div>
                    </div>
                    <div class="designer-rate">${d.rate}</div>
                    <div class="tags">
                        ${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function sellView() {
    return `
        <div class="sell-layout">
            <div class="sell-info">
                <h1>Sell your 3D parts</h1>
                <p>Upload your design, set your price, start earning.</p>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-num">1</div>
                        <div>
                            <h4>Upload your file</h4>
                            <p>STL, STEP, OBJ, or 3MF</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-num">2</div>
                        <div>
                            <h4>Pay $5 listing fee</h4>
                            <p>One-time. Listing stays forever.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-num">3</div>
                        <div>
                            <h4>Get paid instantly</h4>
                            <p>Keep 100% of every sale.</p>
                        </div>
                    </div>
                </div>
                
                <div class="pricing">
                    <div class="pricing-big">$5</div>
                    <div class="pricing-sub">one-time listing fee</div>
                    <ul>
                        <li>Keep 100% of sales</li>
                        <li>No monthly fees</li>
                        <li>No commission</li>
                        <li>Listing never expires</li>
                    </ul>
                </div>
            </div>
            
            <div class="form">
                <h2>Create Listing</h2>
                
                <div class="field">
                    <label>Title</label>
                    <input type="text" placeholder="e.g., Universal Motor Mount">
                </div>
                
                <div class="field">
                    <label>Description</label>
                    <textarea rows="4" placeholder="Describe your part, materials, print settings..."></textarea>
                </div>
                
                <div class="field-row">
                    <div class="field">
                        <label>Category</label>
                        <select>
                            <option value="">Select</option>
                            ${categories.map(c => `<option>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="field">
                        <label>Price (USD)</label>
                        <input type="number" placeholder="4.99" min="0.99" step="0.01">
                    </div>
                </div>
                
                <div class="field">
                    <label>3D File</label>
                    <div class="dropzone">
                        <p>Drop file here or click to browse</p>
                        <span>STL, STEP, OBJ, 3MF</span>
                    </div>
                </div>
                
                <div class="field">
                    <label>Your Email</label>
                    <input type="email" placeholder="you@example.com">
                    <div class="field-hint">For earnings and buyer questions</div>
                </div>
                
                <div class="form-total">
                    <span>Total</span>
                    <span>$5.00</span>
                </div>
                
                <button class="btn btn-lg" style="width:100%">Continue to Payment</button>
            </div>
        </div>
    `;
}

function partView(id) {
    const p = parts.find(x => x.id === id);
    if (!p) return '<p>Part not found.</p>';
    
    return `
        <div class="detail">
            <div class="detail-gallery">
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div class="detail-info">
                <h1>${p.title}</h1>
                <div class="detail-cat">${p.cat} · by ${p.seller}</div>
                <div class="detail-price">$${p.price.toFixed(2)}</div>
                <div class="detail-actions">
                    <button class="btn btn-lg">Buy Now</button>
                    <a href="mailto:${p.email}?subject=Question: ${p.title}" class="btn btn-lg btn-outline">Contact Seller</a>
                </div>
                <div class="detail-desc">
                    <h2>Description</h2>
                    <p>${p.desc}</p>
                </div>
                <div class="specs">
                    <div class="spec-row"><span>Format</span><span>${p.format}</span></div>
                    <div class="spec-row"><span>File Size</span><span>${p.size}</span></div>
                    <div class="spec-row"><span>Material</span><span>${p.material}</span></div>
                    <div class="spec-row"><span>Infill</span><span>${p.infill}</span></div>
                    <div class="spec-row"><span>Downloads</span><span>${p.downloads}</span></div>
                </div>
            </div>
        </div>
    `;
}

function designerView(id) {
    const d = designers.find(x => x.id === id);
    if (!d) return '<p>Designer not found.</p>';
    
    return `
        <div class="detail">
            <div>
                <div class="designer-top" style="margin-bottom:24px">
                    <img src="${d.img}" alt="${d.name}" style="width:80px;height:80px">
                    <div>
                        <h1 style="font-size:24px;margin-bottom:4px">${d.name}</h1>
                        <p style="color:var(--muted)">${d.title}</p>
                    </div>
                </div>
                <div class="detail-desc">
                    <h2>About</h2>
                    <p>${d.bio}</p>
                </div>
                <div class="tags" style="margin-top:24px">
                    ${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="detail-info">
                <div class="detail-price">${d.rate}</div>
                <div style="color:var(--muted);margin-bottom:24px">${d.projects} completed projects</div>
                <div class="detail-actions">
                    <a href="mailto:${d.email}?subject=Design Project Inquiry" class="btn btn-lg">Hire ${d.name.split(' ')[0]}</a>
                    <a href="mailto:${d.email}" class="btn btn-lg btn-outline">Send Message</a>
                </div>
            </div>
        </div>
    `;
}

function cardHTML(p) {
    return `
        <div class="card" onclick="go('part', ${p.id})">
            <img src="${p.img}" alt="${p.title}">
            <div class="card-body">
                <div class="card-title">${p.title}</div>
                <div class="card-meta">
                    <span class="card-cat">${p.cat}</span>
                    <span class="card-price">$${p.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

// Init
render();

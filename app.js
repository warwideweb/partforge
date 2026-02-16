// PartForge — App Logic

// Sample Data
const listings = [
  {
    id: 1, title: "Mercedes 190E Hood Vents", seller: "ErrorByHuman", sellerRating: 4.9, sellerSales: 47,
    make: "Mercedes", model: "190E (W201)", year: "1982-1993", category: "Exterior",
    price: 29, description: "Precision-designed hood vents for the Mercedes 190E. Adds aggressive cooling and style. Snap-fit design requires no drilling — uses existing hood mounting points. Tested for 200+ km/h wind resistance in CFD simulation.",
    material: "ASA", infill: 40, supports: "Minimal", printTime: "8-10 hours",
    reviews: [{user:"JDM_Mike",rating:5,text:"Perfect fit on my 190E 2.3-16. Looks factory."},{user:"PrinterPro",rating:5,text:"Clean design, easy print. Seller was very helpful."}],
    views: 342, downloads: 28, date: "2026-02-10", popular: 95,
    images: ["🏎️"]
  },
  {
    id: 2, title: "BMW E30 Intake Manifold Spacer", seller: "BimmerBits", sellerRating: 4.7, sellerSales: 23,
    make: "BMW", model: "E30 325i", year: "1985-1991", category: "Engine Bay",
    price: 15, description: "Intake manifold spacer designed to improve airflow on the M20 engine. Adds ~5mm spacing for better thermal isolation. Print in PETG or ABS for heat resistance.",
    material: "PETG", infill: 60, supports: "No", printTime: "3-4 hours",
    reviews: [{user:"E30_Dave",rating:4,text:"Works great. Noticed smoother idle after install."}],
    views: 189, downloads: 15, date: "2026-02-12", popular: 78,
    images: ["⚡"]
  },
  {
    id: 3, title: "Honda Civic EK9 Cup Holder", seller: "CivicMods3D", sellerRating: 4.8, sellerSales: 61,
    make: "Honda", model: "Civic EK9", year: "1996-2000", category: "Interior",
    price: 8, description: "Finally, a proper cup holder for the EK9! Clips into the center console with no modifications. Holds standard and large cups securely. Two-piece design for easy printing.",
    material: "PLA", infill: 20, supports: "No", printTime: "2-3 hours",
    reviews: [{user:"TypeR_Owner",rating:5,text:"Been wanting this forever. Perfect fit!"},{user:"HondaHead",rating:5,text:"Simple, clean, functional. 10/10"}],
    views: 567, downloads: 89, date: "2026-02-14", popular: 120,
    images: ["🪑"]
  },
  {
    id: 4, title: "Toyota AE86 Gauge Pod", seller: "HachiRokuParts", sellerRating: 4.6, sellerSales: 18,
    make: "Toyota", model: "AE86 Corolla", year: "1983-1987", category: "Interior",
    price: 12, description: "Triple gauge pod that mounts to the A-pillar of the AE86. Fits 52mm gauges (boost, oil temp, oil pressure). Clean OEM-like finish when printed in black.",
    material: "PLA", infill: 25, supports: "Yes", printTime: "5-6 hours",
    reviews: [{user:"InitialD_Fan",rating:5,text:"Tofu delivery approved! 🏔️"}],
    views: 234, downloads: 19, date: "2026-02-08", popular: 67,
    images: ["🎯"]
  },
  {
    id: 5, title: "Mazda Miata NA Vent Rings", seller: "MiataMods", sellerRating: 4.9, sellerSales: 82,
    make: "Mazda", model: "Miata NA (MX-5)", year: "1989-1997", category: "Interior",
    price: 10, description: "Replacement vent rings for the NA Miata. The OEM ones always crack — these are stronger and come in any color you can print. Set of 4 included.",
    material: "PLA", infill: 20, supports: "No", printTime: "1-2 hours",
    reviews: [{user:"MiataGang",rating:5,text:"Way better than the brittle OEM ones."},{user:"Roadster_Life",rating:4,text:"Good fit. Slightly tight on one vent but filed down easily."}],
    views: 445, downloads: 67, date: "2026-02-15", popular: 110,
    images: ["🔘"]
  },
  {
    id: 6, title: "Ford Mustang Phone Mount", seller: "StangParts", sellerRating: 4.5, sellerSales: 34,
    make: "Ford", model: "Mustang S550", year: "2015-2023", category: "Accessories",
    price: 7, description: "Dash-mounted phone holder for the S550 Mustang. Clips to the air vent with a spring-loaded grip. Fits phones up to 6.7 inches. No adhesive needed.",
    material: "PETG", infill: 30, supports: "Minimal", printTime: "2-3 hours",
    reviews: [{user:"Pony_Power",rating:4,text:"Solid mount, doesn't rattle at all."}],
    views: 278, downloads: 31, date: "2026-02-11", popular: 72,
    images: ["📱"]
  },
  {
    id: 7, title: "Nissan 240SX Drift Knob", seller: "DriftKingDesigns", sellerRating: 4.8, sellerSales: 56,
    make: "Nissan", model: "240SX S13/S14", year: "1989-1998", category: "Interior",
    price: 9, description: "Weighted shift knob designed for drifting. Fits M10x1.25 thread (standard Nissan). Hollow core can be filled with steel BBs for extra weight. Ergonomic teardrop shape.",
    material: "PETG", infill: 100, supports: "No", printTime: "3-4 hours",
    reviews: [{user:"SideWays_Sam",rating:5,text:"Filled with BBs, feels amazing. Short throws feel so much better."},{user:"S14_Silvia",rating:5,text:"Clean design, perfect thread fit."}],
    views: 389, downloads: 45, date: "2026-02-13", popular: 88,
    images: ["🎮"]
  },
  {
    id: 8, title: "Universal OBD2 Port Cover", seller: "CleanBayClub", sellerRating: 4.4, sellerSales: 12,
    make: "Universal", model: "Universal", year: "1996+", category: "Accessories",
    price: 5, description: "Clean cover for your OBD2 port. Keeps dust and debris out. Universal fit for standard OBD2 ports. Simple snap-on design.",
    material: "PLA", infill: 15, supports: "No", printTime: "30-45 min",
    reviews: [{user:"DetailKing",rating:4,text:"Simple but effective. Looks OEM."}],
    views: 156, downloads: 22, date: "2026-02-09", popular: 45,
    images: ["🔌"]
  },
  {
    id: 9, title: "Porsche 944 Headlight Bracket", seller: "PorschePrintWorks", sellerRating: 4.7, sellerSales: 29,
    make: "Porsche", model: "944", year: "1982-1991", category: "Brackets/Mounts",
    price: 18, description: "Replacement headlight adjustment bracket for the 944. The OEM plastic brackets are notorious for breaking. This redesigned version is 3x stronger with reinforced mounting points.",
    material: "ABS", infill: 50, supports: "Yes", printTime: "4-5 hours",
    reviews: [{user:"944_Turbo",rating:5,text:"Saved me $200 vs OEM. Stronger than original."},{user:"TransaxleGang",rating:5,text:"Perfect. Every 944 owner needs these."}],
    views: 312, downloads: 38, date: "2026-02-07", popular: 82,
    images: ["💡"]
  },
  {
    id: 10, title: "VW Golf MK2 Switch Panel", seller: "DubPrintShop", sellerRating: 4.6, sellerSales: 41,
    make: "VW", model: "Golf MK2", year: "1983-1992", category: "Interior",
    price: 14, description: "Custom switch panel blanking plate for the MK2 Golf. Replaces the blank switch panel with a clean design featuring cutouts for 3 toggle switches (not included). Perfect for rally builds.",
    material: "PLA", infill: 25, supports: "No", printTime: "2-3 hours",
    reviews: [{user:"DubLove",rating:5,text:"Looks factory. Perfect for my rally MK2 build."}],
    views: 198, downloads: 21, date: "2026-02-06", popular: 58,
    images: ["🎛️"]
  },
  {
    id: 11, title: "Mercedes W201 Mirror Cap", seller: "ErrorByHuman", sellerRating: 4.9, sellerSales: 47,
    make: "Mercedes", model: "W201 (190E)", year: "1982-1993", category: "Exterior",
    price: 12, description: "Replacement side mirror cap for the W201. OEM caps crack from UV exposure — this version is designed for ASA printing for maximum UV resistance. Left and right included.",
    material: "ASA", infill: 30, supports: "Yes", printTime: "3-4 hours",
    reviews: [{user:"BenzLife",rating:5,text:"Perfect color match when printed in black ASA."}],
    views: 167, downloads: 14, date: "2026-02-14", popular: 55,
    images: ["🪞"]
  },
  {
    id: 12, title: "Subaru WRX Turbo Heat Shield", seller: "BoxerPrintCo", sellerRating: 4.8, sellerSales: 37,
    make: "Subaru", model: "WRX/STI", year: "2002-2007", category: "Engine Bay",
    price: 22, description: "Turbo heat shield that protects the intake and nearby components from radiant heat. Print in ABS or ASA for heat resistance. Includes mounting tabs for zip-tie installation.",
    material: "ABS", infill: 35, supports: "Minimal", printTime: "6-8 hours",
    reviews: [{user:"SubiNation",rating:4,text:"Dropped intake temps by ~10°F. Worth it."},{user:"BoxerFlat4",rating:5,text:"Great design. Easy install with zip ties."}],
    views: 423, downloads: 52, date: "2026-02-15", popular: 98,
    images: ["🛡️"]
  }
];

// Color palette for part card gradients
const cardColors = [
  ['#1a1a2e','#16213e'],['#0f0f23','#1a1a3e'],['#1a0a2e','#2d1b4e'],
  ['#0a1a2e','#0f2b3e'],['#1a1a1a','#2a2a3a'],['#0f1a2e','#1b2d4e'],
  ['#1a0f2e','#2e1b4e'],['#0a2e1a','#1b3e2d'],['#2e1a0a','#3e2b1b'],
  ['#1a2e0a','#2d3e1b'],['#2e0a1a','#3e1b2d'],['#0a1a2e','#1b2d3e']
];

// Navigation
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (page === 'browse') filterListings();
  if (page === 'dashboard') renderDashboard();
}

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('active');
}

// Listing Card HTML
function listingCard(item) {
  const colors = cardColors[item.id % cardColors.length];
  const stars = '★'.repeat(Math.floor(item.sellerRating)) + (item.sellerRating % 1 ? '½' : '');
  return `
    <div class="listing-card" onclick="showDetail(${item.id})">
      <div class="card-image" style="background:linear-gradient(135deg,${colors[0]},${colors[1]})">
        <span class="card-emoji">${item.images[0]}</span>
        <span class="card-category">${item.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-compat">${item.make} ${item.model} · ${item.year}</p>
        <div class="card-footer">
          <span class="card-price">$${item.price}</span>
          <span class="card-seller">${item.seller} <span class="stars">${stars}</span></span>
        </div>
      </div>
    </div>`;
}

// Render featured
function renderFeatured() {
  const featured = [...listings].sort((a,b) => b.popular - a.popular).slice(0, 4);
  document.getElementById('featuredGrid').innerHTML = featured.map(listingCard).join('');
}

// Filter & Render Browse
function filterListings() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase();
  const cat = document.getElementById('filterCategory').value;
  const make = document.getElementById('filterMake').value;
  const price = document.getElementById('filterPrice').value;
  const sort = document.getElementById('filterSort').value;

  let filtered = listings.filter(item => {
    if (q && !(item.title.toLowerCase().includes(q) || item.make.toLowerCase().includes(q) || item.model.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))) return false;
    if (cat && item.category !== cat) return false;
    if (make && item.make !== make) return false;
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (item.price < min || item.price > max) return false;
    }
    return true;
  });

  switch(sort) {
    case 'price-asc': filtered.sort((a,b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a,b) => b.price - a.price); break;
    case 'popular': filtered.sort((a,b) => b.popular - a.popular); break;
    default: filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
  }

  document.getElementById('browseGrid').innerHTML = filtered.length
    ? filtered.map(listingCard).join('')
    : '<div class="no-results"><p>No parts found. Try adjusting your filters.</p></div>';
  document.getElementById('resultCount').textContent = `${filtered.length} part${filtered.length !== 1 ? 's' : ''} found`;
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterMake').value = '';
  document.getElementById('filterPrice').value = '';
  document.getElementById('filterSort').value = 'newest';
  filterListings();
}

function browseCategory(cat) {
  navigate('browse');
  document.getElementById('filterCategory').value = cat;
  filterListings();
}

function toggleFilters() {
  document.getElementById('filtersPanel').classList.toggle('open');
}

// Detail Page
function showDetail(id) {
  const item = listings.find(l => l.id === id);
  if (!item) return;
  const colors = cardColors[id % cardColors.length];
  const reviewsHtml = item.reviews.map(r => `
    <div class="review">
      <div class="review-header">
        <strong>${r.user}</strong>
        <span class="stars">${'★'.repeat(r.rating)}</span>
      </div>
      <p>${r.text}</p>
    </div>
  `).join('');

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-gallery" style="background:linear-gradient(135deg,${colors[0]},${colors[1]})">
      <span class="detail-emoji">${item.images[0]}</span>
    </div>
    <div class="detail-info">
      <span class="detail-category">${item.category}</span>
      <h1>${item.title}</h1>
      <p class="detail-compat">${item.make} ${item.model} · ${item.year}</p>
      <div class="detail-price-row">
        <span class="detail-price">$${item.price}</span>
        <span class="detail-price-label">STL File Download</span>
      </div>
      <button class="btn btn-primary btn-lg btn-block" onclick="showBuyModal(${item.id})">Buy Now — $${item.price}</button>
      <div class="detail-description">
        <h3>Description</h3>
        <p>${item.description}</p>
      </div>
      <div class="detail-specs">
        <h3>Print Specifications</h3>
        <div class="specs-grid">
          <div class="spec"><span class="spec-label">Material</span><span class="spec-value">${item.material}</span></div>
          <div class="spec"><span class="spec-label">Infill</span><span class="spec-value">${item.infill}%</span></div>
          <div class="spec"><span class="spec-label">Supports</span><span class="spec-value">${item.supports}</span></div>
          <div class="spec"><span class="spec-label">Print Time</span><span class="spec-value">${item.printTime}</span></div>
        </div>
      </div>
      <div class="detail-seller">
        <h3>Seller</h3>
        <div class="seller-card">
          <div class="seller-avatar">${item.seller[0]}</div>
          <div class="seller-info">
            <strong>${item.seller}</strong>
            <span class="stars">${'★'.repeat(Math.floor(item.sellerRating))} ${item.sellerRating}</span>
            <span class="seller-stat">${item.sellerSales} sales</span>
          </div>
        </div>
      </div>
      <div class="detail-reviews">
        <h3>Reviews (${item.reviews.length})</h3>
        ${reviewsHtml}
      </div>
      <div class="detail-meta">
        <span>${item.views} views</span> · <span>${item.downloads} downloads</span> · <span>Listed ${item.date}</span>
      </div>
    </div>
  `;
  navigate('detail');
}

// Buy Modal
function showBuyModal(id) {
  const item = listings.find(l => l.id === id);
  document.getElementById('modalContent').innerHTML = `
    <div class="buy-modal">
      <h2>Complete Purchase</h2>
      <div class="buy-summary">
        <span>${item.title}</span>
        <span class="detail-price">$${item.price}</span>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" placeholder="your@email.com" class="modal-input">
      </div>
      <div class="form-group">
        <label>Card Number</label>
        <input type="text" placeholder="4242 4242 4242 4242" class="modal-input" maxlength="19">
      </div>
      <div class="form-row">
        <div class="form-group"><label>Expiry</label><input type="text" placeholder="MM/YY" class="modal-input" maxlength="5"></div>
        <div class="form-group"><label>CVC</label><input type="text" placeholder="123" class="modal-input" maxlength="4"></div>
      </div>
      <button class="btn btn-primary btn-lg btn-block" onclick="completePurchase()">Pay $${item.price}</button>
      <p class="modal-secure">🔒 Secured by Stripe · Instant STL download after payment</p>
    </div>
  `;
  openModal();
}

function completePurchase() {
  document.getElementById('modalContent').innerHTML = `
    <div class="buy-modal success-modal">
      <div class="success-icon">✅</div>
      <h2>Purchase Complete!</h2>
      <p>Your STL file is ready for download.</p>
      <button class="btn btn-primary btn-lg btn-block" onclick="closeModal()">Download STL File</button>
    </div>
  `;
}

function openModal() { document.getElementById('modalOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); document.body.style.overflow = ''; }

// Sell Form
function handleSellSubmit(e) {
  e.preventDefault();
  document.getElementById('modalContent').innerHTML = `
    <div class="buy-modal">
      <h2>Preview Your Listing</h2>
      <div class="preview-card">
        <h3>${document.getElementById('sellTitle').value}</h3>
        <p>${document.getElementById('sellMake').value} ${document.getElementById('sellModel').value} · ${document.getElementById('sellYear').value}</p>
        <p class="detail-price">$${document.getElementById('sellPrice').value}</p>
        <p>${document.getElementById('sellDesc').value}</p>
      </div>
      <div class="listing-fee-card">
        <div class="fee-info"><span class="fee-label">Listing Fee</span><span class="fee-amount">$5.00</span></div>
      </div>
      <button class="btn btn-primary btn-lg btn-block" onclick="confirmListing()">Pay $5 & Publish</button>
    </div>
  `;
  openModal();
  return false;
}

function confirmListing() {
  document.getElementById('modalContent').innerHTML = `
    <div class="buy-modal success-modal">
      <div class="success-icon">🎉</div>
      <h2>Listing Published!</h2>
      <p>Your part is now live on PartForge.</p>
      <button class="btn btn-primary btn-lg btn-block" onclick="closeModal();navigate('dashboard')">View Dashboard</button>
    </div>
  `;
}

function handleFileUpload(e) {
  const preview = document.getElementById('uploadPreview');
  const placeholder = document.querySelector('.upload-placeholder');
  preview.innerHTML = '';
  if (e.target.files.length > 0) {
    placeholder.style.display = 'none';
    Array.from(e.target.files).forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML += `<div class="preview-thumb"><img src="${ev.target.result}"><span class="remove-thumb" onclick="event.stopPropagation();this.parentElement.remove()">✕</span></div>`;
      };
      reader.readAsDataURL(f);
    });
  } else {
    placeholder.style.display = '';
  }
}

// Dashboard
function renderDashboard() {
  const myListings = listings.filter(l => l.seller === 'ErrorByHuman');
  document.getElementById('dashListings').innerHTML = myListings.map(item => `
    <div class="dash-listing-row">
      <div class="dash-listing-info">
        <span class="card-emoji-sm">${item.images[0]}</span>
        <div>
          <strong>${item.title}</strong>
          <span class="dash-listing-meta">$${item.price} · ${item.views} views · ${item.downloads} downloads</span>
        </div>
      </div>
      <div class="dash-listing-actions">
        <span class="badge badge-active">Active</span>
        <button class="btn btn-outline btn-sm">Edit</button>
      </div>
    </div>
  `).join('');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Init
renderFeatured();

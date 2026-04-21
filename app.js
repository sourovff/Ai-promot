// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
  apiKey: "AIzaSyA6-8Uhm46GrrciXK3kyzAm-dt-ITgz1IA",
  authDomain: "ai-photo-16cf6.firebaseapp.com",
  databaseURL: "https://ai-photo-16cf6-default-rtdb.firebaseio.com",
  projectId: "ai-photo-16cf6",
  storageBucket: "ai-photo-16cf6.firebasestorage.app",
  messagingSenderId: "288735705819",
  appId: "1:288735705819:web:75f336ad158340b8f16afe"
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("prompts");
const storage = firebase.storage();
const auth = firebase.auth();

// ==================== CREATE APP STRUCTURE ====================
function createAppStructure() {
  const root = document.getElementById('app-root');
  
  root.innerHTML = `
    <!-- Navigation -->
    <nav class="navbar-modern">
      <div class="container">
        <div class="navbar-flex">
          <div class="logo-area">
            <i class="bi bi-stars fs-3" style="color: var(--primary);"></i>
            <span class="logo">SoURoV<span style="background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; color: transparent;">.</span>AI</span>
            <span class="logo-badge">Prompt HUB</span>
          </div>
          <div class="action-buttons">
            <button class="btn-icon" onclick="toggleTheme()">
              <i class="bi bi-moon-stars" id="theme-icon"></i>
              <span class="d-none d-md-inline ms-1">Theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Secret Admin Trigger -->
      <button class="secret-admin-trigger" id="secretAdminTrigger" onclick="triggerAdminLogin()"></button>

      <!-- Admin Login Modal -->
      <div id="adminLoginModal" class="admin-login-modal">
        <div class="admin-login-box">
          <div class="text-center mb-4">
            <i class="bi bi-shield-lock fs-1" style="color: var(--primary);"></i>
            <h3 class="mt-2">Admin Access</h3>
            <p class="text-secondary small">Secure Firebase Login</p>
          </div>
          <input type="email" id="adminEmail" class="form-modern mb-3" placeholder="Admin Email" autocomplete="email">
          <input type="password" id="adminPassword" class="form-modern mb-3" placeholder="Password" autocomplete="current-password">
          <div class="d-flex gap-2">
            <button class="btn-primary-gradient flex-grow-1" onclick="adminLogin()">
              <i class="bi bi-box-arrow-in-right me-1"></i> Login
            </button>
            <button class="btn-icon" onclick="closeAdminLogin()">Cancel</button>
          </div>
          <div id="loginError" class="text-danger small mt-2 text-center" style="display: none;"></div>
          <div class="text-center mt-3">
            <button class="btn-link text-secondary small" onclick="sendPasswordReset()" style="background: none; border: none; text-decoration: underline;">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Panel -->
      <div id="adminPanel" class="admin-panel-modern">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="fw-bold mb-0" id="adminPanelTitle">
            <i class="bi bi-cloud-upload-fill me-2" style="color: var(--primary);"></i> Create New Prompt
          </h4>
          <button class="btn-icon" onclick="logoutAdmin()" style="padding: 5px 15px;">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold small mb-2">Image URL (Optional)</label>
            <input type="text" id="imgUrl" class="form-modern" placeholder="https://example.com/image.jpg">
            <div class="form-text text-secondary small mt-1">Or upload image below</div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold small mb-2">Upload Image (JPG/PNG)</label>
            <input type="file" id="imageUpload" accept="image/jpeg,image/png,image/jpg,image/webp" class="form-modern">
            <div id="imagePreviewContainer" style="margin-top: 10px;"></div>
            <div id="uploadProgressContainer" class="progress-bar-custom mt-2" style="display: none;">
              <div class="progress-fill" id="uploadProgressFill"></div>
            </div>
            <div id="uploadStatus" class="small mt-1" style="display: none;"></div>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small mb-2">Category</label>
            <input type="text" id="category" class="form-modern" placeholder="e.g., Cinematic, Portrait">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small mb-2">&nbsp;</label>
            <button class="btn-primary-gradient w-100" id="publishBtn" onclick="savePost()">
              <i class="bi bi-send-fill me-1"></i> Publish
            </button>
          </div>
          <div class="col-12">
            <label class="form-label fw-semibold small mb-2">Prompt Description *</label>
            <textarea id="promptDesc" class="form-modern" rows="3" placeholder="Enter your AI prompt text here..."></textarea>
          </div>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="search-filter-bar">
        <div class="row g-3">
          <div class="col-md-5">
            <div class="position-relative">
              <i class="bi bi-search position-absolute" style="left: 15px; top: 12px; color: var(--text-secondary);"></i>
              <input type="text" id="searchInput" class="form-modern" placeholder="Search prompts by title or description..." style="padding-left: 40px;">
            </div>
          </div>
          <div class="col-md-3">
            <select id="categoryFilter" class="form-modern">
              <option value="all">📁 All Categories</option>
            </select>
          </div>
          <div class="col-md-2">
            <select id="sortBy" class="form-modern">
              <option value="newest">🆕 Newest First</option>
              <option value="oldest">📅 Oldest First</option>
              <option value="az">🔤 A to Z</option>
              <option value="za">🔤 Z to A</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn-icon w-100" onclick="clearFilters()">
              <i class="bi bi-eraser"></i> Clear
            </button>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div id="filterStats" class="text-secondary small"></div>
          <div>
            <button class="btn-icon btn-sm" onclick="toggleFavoriteView()" id="favViewBtn">
              <i class="bi bi-star-fill"></i>
              <span id="favViewText">Show Favorites</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Delete Bar -->
      <div id="bulkDeleteBar" class="bulk-delete-bar">
        <span id="selectedCount" class="me-3">0 items selected</span>
        <button class="btn-primary-gradient" onclick="bulkDelete()" style="padding: 6px 16px;">
          <i class="bi bi-trash-fill"></i> Delete Selected
        </button>
        <button class="btn-icon ms-2" onclick="clearSelection()" style="padding: 6px 16px;">Cancel</button>
      </div>

      <!-- Edit Modal -->
      <div id="editModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000; align-items: center; justify-content: center;">
        <div style="background: var(--bg-secondary); border-radius: var(--border-radius); padding: 2rem; max-width: 500px; width: 90%;">
          <h4 class="mb-3">Edit Prompt</h4>
          <input type="hidden" id="editKey">
          <label class="form-label">Image URL</label>
          <input type="text" id="editImageUrl" class="form-modern mb-3">
          <label class="form-label">Category</label>
          <input type="text" id="editCategory" class="form-modern mb-3">
          <label class="form-label">Prompt Text</label>
          <textarea id="editPrompt" class="form-modern mb-3" rows="4"></textarea>
          <div class="d-flex gap-2">
            <button class="btn-primary-gradient" onclick="updatePrompt()">Update</button>
            <button class="btn-icon" onclick="closeEditModal()">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 mt-3">
        <div>
          <h1 class="fw-bold mb-1" style="font-size: 2rem;">
            <i class="bi bi-grid-3x3-gap-fill me-2" style="color: var(--primary);"></i> Prompt Gallery
          </h1>
          <p class="text-secondary mb-0">Click on images to view full size • Copy prompts • Long press image to save</p>
        </div>
        <div class="stats-modern">
          <i class="bi bi-images me-1"></i>
          <span id="totalCount">0</span> prompts
          <span id="favoriteCount" class="ms-2" style="color: var(--accent);"></span>
        </div>
      </div>

      <!-- Loader -->
      <div id="loader" class="loader-modern" style="display: none;">
        <div class="spinner-border text-primary" style="width: 2.5rem; height: 2.5rem;" role="status"></div>
        <span class="ms-3 text-secondary">Loading prompts...</span>
      </div>

      <!-- Gallery Container -->
      <div class="row g-4" id="gallery-container"></div>

      <!-- No Results Message -->
      <div id="noResults" class="no-results" style="display: none;">
        <i class="bi bi-inbox fs-1 mb-3 d-block"></i>
        <h5>No prompts found</h5>
        <p class="text-secondary">Try adjusting your search or filters</p>
      </div>

      <!-- Footer -->
      <footer id="footer">
        <div class="container">
            <div class="footer-social mb-3">
                <a href="https://facebook.com/sourovxray" target="_blank"><i class="bi bi-facebook"></i></a>
                <a href="https://instagram.com/sourovxray" target="_blank"><i class="bi bi-instagram"></i></a>
                <a href="https://t.me/sourovxray" target="_blank"><i class="bi bi-telegram"></i></a>
                <a href="https://twitter.com/sourovxray" target="_blank"><i class="bi bi-twitter-x"></i></a>
                <a href="https://github.com/sourovff" target="_blank"><i class="bi bi-github"></i></a>
                <a href="https://wa.me/8801789538134" target="_blank"><i class="bi bi-whatsapp"></i></a>
            </div>
            <p class="mb-0">© 2026 SOUROV RAY | STATUS: <span class="text-success">ONLINE</span></p>
            <p>
        <i class="fas fa-copyright"></i>— 
        Developed with <i class="fas fa-heart" style="color: #ef4444;"></i> by 
        <strong style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; background-clip: text; color: transparent;">SoURoV</strong>
       </p>
        </div>
    </footer>


    <!-- PWA Install Button -->
    <button id="installPwaBtn" class="install-pwa">
      <i class="bi bi-download"></i> Install App
    </button>
  `;
}

// Call the function to build the app
createAppStructure();

// ==================== GLOBAL VARIABLES ====================
let isAdminLoggedIn = false;
let adminSessionTimeout = null;
let allPrompts = [];
let favorites = JSON.parse(localStorage.getItem('sourovFavorites') || '[]');
let showOnlyFavorites = false;
let deferredPrompt = null;
let selectedPrompts = [];

// ==================== AUTHENTICATION STATE OBSERVER ====================
auth.onAuthStateChanged((user) => {
  if (user) {
    isAdminLoggedIn = true;
    document.getElementById('adminPanel')?.classList.add('active');
    document.getElementById('adminLoginModal').style.display = 'none';
    
    const panelTitle = document.getElementById('adminPanelTitle');
    if (panelTitle) {
      panelTitle.innerHTML = `<i class="bi bi-cloud-upload-fill me-2" style="color: var(--primary);"></i> Welcome, SoURoV RaY`;
    }
    
    setAdminSession();
    filterAndRender();
  } else {
    isAdminLoggedIn = false;
    document.getElementById('adminPanel')?.classList.remove('active');
    
    const panelTitle = document.getElementById('adminPanelTitle');
    if (panelTitle) {
      panelTitle.innerHTML = `<i class="bi bi-cloud-upload-fill me-2" style="color: var(--primary);"></i> Create New Prompt`;
    }
    
    filterAndRender();
  }
});

// ==================== ADMIN LOGIN FUNCTIONS ====================
function adminLogin() {
  const email = document.getElementById('adminEmail')?.value.trim();
  const password = document.getElementById('adminPassword')?.value;
  const errorDiv = document.getElementById('loginError');
  
  if (!email || !password) {
    errorDiv.innerHTML = '❌ Email and password required';
    errorDiv.style.display = 'block';
    return;
  }
  
  errorDiv.style.display = 'none';
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('adminLoginModal').style.display = 'none';
      document.getElementById('adminEmail').value = '';
      document.getElementById('adminPassword').value = '';
      showToast('✅ Login successful!', 'success');
    })
    .catch((error) => {
      errorDiv.innerHTML = '❌ ' + error.message;
      errorDiv.style.display = 'block';
      showToast('❌ Login failed', 'error');
    });
}

function sendPasswordReset() {
  const email = document.getElementById('adminEmail')?.value.trim();
  if (!email) {
    showToast('❌ Enter your email first', 'error');
    return;
  }
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      showToast('📧 Password reset email sent! Check your inbox', 'success');
    })
    .catch((error) => {
      showToast('❌ ' + error.message, 'error');
    });
}

function logoutAdmin() {
  auth.signOut().then(() => {
    if (adminSessionTimeout) clearTimeout(adminSessionTimeout);
    showToast('🔒 Logged out successfully', 'info');
  }).catch((error) => {
    showToast('❌ Logout failed', 'error');
  });
}

function triggerAdminLogin() {
  if (auth.currentUser) {
    showToast('✅ Already logged in as ' + auth.currentUser.email, 'info');
    document.getElementById('adminPanel')?.classList.add('active');
  } else {
    document.getElementById('adminLoginModal').style.display = 'flex';
  }
}

function closeAdminLogin() {
  document.getElementById('adminLoginModal').style.display = 'none';
  document.getElementById('adminEmail').value = '';
  document.getElementById('adminPassword').value = '';
  document.getElementById('loginError').style.display = 'none';
}

function setAdminSession() {
  if (adminSessionTimeout) clearTimeout(adminSessionTimeout);
  adminSessionTimeout = setTimeout(() => {
    if (auth.currentUser) logoutAdmin();
  }, 30 * 60 * 1000);
}

// ==================== IMAGE PREVIEW ====================
document.addEventListener('change', function(e) {
  if (e.target.id === 'imageUpload') {
    const file = e.target.files[0];
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        previewContainer.innerHTML = `
          <div style="position: relative; display: inline-block;">
            <img src="${event.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 12px; border: 2px solid var(--primary);">
            <button onclick="this.parentElement.parentElement.innerHTML = ''; document.getElementById('imageUpload').value = ''" style="position: absolute; top: -8px; right: -8px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;"> ✕ </button>
          </div>
        `;
      };
      reader.readAsDataURL(file);
    } else {
      previewContainer.innerHTML = '';
    }
  }
});

// ==================== DOWNLOAD IMAGE ====================
async function downloadImage(imageUrl, fileName = 'sourov-ai-image.jpg') {
  const loadingId = showLoadingToast();
  try {
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry/i.test(navigator.userAgent);
    
    if (isMobile) {
      hideLoadingToast(loadingId);
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); 
        z-index: 10000; display: flex; flex-direction: column; justify-content: center; 
        align-items: center; padding: 20px;
      `;
      modal.innerHTML = `
        <img src="${imageUrl}" style="max-width: 90%; max-height: 70vh; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
        <div style="background: var(--bg-secondary); padding: 20px; border-radius: 16px; text-align: center; width: 90%;">
          <i class="bi bi-hand-index-thumb-fill" style="font-size: 32px; color: var(--primary); display: block; margin-bottom: 10px;"></i>
          <p style="color: var(--text-primary); margin-bottom: 15px; font-size: 16px;">
            📱 Long press on the image<br>and select <strong>"Save Image"</strong>
          </p>
          <button onclick="this.parentElement.parentElement.remove()" style="background: var(--primary); color: white; border: none; padding: 10px 24px; border-radius: 40px; font-weight: bold; cursor: pointer;"> Close </button>
        </div>
      `;
      document.body.appendChild(modal);
      showToast("📱 Image opened! Long press to save", "info", 4000);
    } else {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      hideLoadingToast(loadingId);
      showToast("✅ Image downloaded!", "success");
    }
  } catch (error) {
    console.error("Download error:", error);
    hideLoadingToast(loadingId);
    window.open(imageUrl, '_blank');
    showToast("📱 Long press image to save", "info", 4000);
  }
}

// Loading Toast Functions
let loadingToastId = null;
function showLoadingToast() {
  const id = Date.now();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.id = `toast-${id}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
      <span>Preparing download...</span>
    </div>
  `;
  document.body.appendChild(toast);
  loadingToastId = id;
  return id;
}

function hideLoadingToast(id) {
  const toast = document.getElementById(`toast-${id}`);
  if (toast) toast.remove();
  if (loadingToastId === id) loadingToastId = null;
}

function showToast(message, type = 'success', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  const icon = type === 'success' ? 'check-circle-fill' : type === 'error' ? 'exclamation-triangle-fill' : 'info-circle-fill';
  const iconColor = type === 'success' ? '#06ffa5' : type === 'error' ? '#dc2626' : '#f59e0b';
  toast.innerHTML = `<i class="bi bi-${icon}" style="margin-right: 8px; color: ${iconColor}"></i>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ==================== PWA INSTALL ====================
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installPwaBtn').style.display = 'flex';
});

document.addEventListener('click', async (e) => {
  if (e.target.closest('#installPwaBtn') && deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      document.getElementById('installPwaBtn').style.display = 'none';
      showToast("✅ App installed successfully!", "success");
    }
    deferredPrompt = null;
  }
});

// ==================== FAVORITE FUNCTIONS ====================
function toggleFavorite(promptId) {
  if (favorites.includes(promptId)) {
    favorites = favorites.filter(id => id !== promptId);
    showToast("⭐ Removed from favorites", "info");
  } else {
    favorites.push(promptId);
    showToast("❤️ Added to favorites!", "success");
  }
  localStorage.setItem('sourovFavorites', JSON.stringify(favorites));
  updateFavoriteCount();
  filterAndRender();
}

function isFavorite(promptId) {
  return favorites.includes(promptId);
}

function updateFavoriteCount() {
  const favCount = favorites.length;
  const favCountElem = document.getElementById('favoriteCount');
  if (favCountElem) favCountElem.innerHTML = `⭐ ${favCount}`;
}

function toggleFavoriteView() {
  showOnlyFavorites = !showOnlyFavorites;
  const btnText = document.getElementById('favViewText');
  if (showOnlyFavorites) {
    btnText.innerHTML = 'Show All';
    showToast("⭐ Showing only favorites", "info");
  } else {
    btnText.innerHTML = 'Show Favorites';
    showToast("📁 Showing all prompts", "info");
  }
  filterAndRender();
}

// ==================== BULK DELETE FUNCTIONS ====================
function toggleSelectPrompt(promptId) {
  if (selectedPrompts.includes(promptId)) {
    selectedPrompts = selectedPrompts.filter(id => id !== promptId);
  } else {
    selectedPrompts.push(promptId);
  }
  updateBulkDeleteUI();
  filterAndRender();
}

function updateBulkDeleteUI() {
  const bulkDeleteBar = document.getElementById('bulkDeleteBar');
  const selectedCountSpan = document.getElementById('selectedCount');
  if (selectedPrompts.length > 0) {
    bulkDeleteBar.style.display = 'flex';
    selectedCountSpan.innerHTML = `${selectedPrompts.length} item${selectedPrompts.length !== 1 ? 's' : ''} selected`;
  } else {
    bulkDeleteBar.style.display = 'none';
  }
}

function bulkDelete() {
  if (selectedPrompts.length === 0) return;
  if (confirm(`⚠️ Delete ${selectedPrompts.length} prompt${selectedPrompts.length !== 1 ? 's' : ''}? This cannot be undone!`)) {
    selectedPrompts.forEach(id => {
      db.child(id).remove((error) => {
        if (!error) {
          if (favorites.includes(id)) {
            favorites = favorites.filter(favId => favId !== id);
            localStorage.setItem('sourovFavorites', JSON.stringify(favorites));
          }
        }
      });
    });
    showToast(`🗑️ ${selectedPrompts.length} prompt${selectedPrompts.length !== 1 ? 's' : ''} deleted`, "success");
    clearSelection();
    updateFavoriteCount();
  }
}

function clearSelection() {
  selectedPrompts = [];
  updateBulkDeleteUI();
  filterAndRender();
}

// ==================== SEARCH & FILTER FUNCTIONS ====================
function populateCategoryFilter() {
  const categories = new Set();
  allPrompts.forEach(prompt => {
    if (prompt.category) categories.add(prompt.category);
  });
  const select = document.getElementById('categoryFilter');
  const currentValue = select.value;
  select.innerHTML = '<option value="all">📁 All Categories</option>';
  Array.from(categories).sort().forEach(cat => {
    select.innerHTML += `<option value="${cat}">📂 ${cat}</option>`;
  });
  if (currentValue !== 'all' && categories.has(currentValue)) select.value = currentValue;
}

function filterAndRender() {
  let filtered = [...allPrompts];
  
  if (showOnlyFavorites) {
    filtered = filtered.filter(prompt => isFavorite(prompt.id));
  }
  
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  if (searchTerm) {
    filtered = filtered.filter(prompt => 
      prompt.prompt.toLowerCase().includes(searchTerm) || 
      (prompt.category && prompt.category.toLowerCase().includes(searchTerm))
    );
  }
  
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(prompt => prompt.category === categoryFilter);
  }
  
  const sortBy = document.getElementById('sortBy')?.value || 'newest';
  if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } else if (sortBy === 'oldest') {
    filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  } else if (sortBy === 'az') {
    filtered.sort((a, b) => (a.prompt || '').localeCompare(b.prompt || ''));
  } else if (sortBy === 'za') {
    filtered.sort((a, b) => (b.prompt || '').localeCompare(a.prompt || ''));
  }
  
  const filterStats = document.getElementById('filterStats');
  if (filterStats) {
    if (showOnlyFavorites) {
      filterStats.innerHTML = `⭐ Showing ${filtered.length} favorite${filtered.length !== 1 ? 's' : ''}`;
    } else if (searchTerm || categoryFilter !== 'all') {
      filterStats.innerHTML = `🔍 Showing ${filtered.length} of ${allPrompts.length} prompts`;
    } else {
      filterStats.innerHTML = `📸 ${allPrompts.length} total prompts`;
    }
  }
  
  renderFilteredGallery(filtered);
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('sortBy').value = 'newest';
  if (showOnlyFavorites) toggleFavoriteView();
  filterAndRender();
  showToast("🧹 Filters cleared", "info");
}

// ==================== IMAGE UPLOAD ====================
async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }
    
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${timestamp}_${safeFileName}`;
    const storageRef = storage.ref().child(`prompt-images/${fileName}`);
    
    const progressContainer = document.getElementById('uploadProgressContainer');
    const progressFill = document.getElementById('uploadProgressFill');
    const uploadStatus = document.getElementById('uploadStatus');
    
    progressContainer.style.display = 'block';
    uploadStatus.style.display = 'block';
    uploadStatus.innerHTML = '<i class="bi bi-cloud-upload"></i> Uploading 0%...';
    
    const uploadTask = storageRef.put(file);
    
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressFill.style.width = progress + '%';
        uploadStatus.innerHTML = `<i class="bi bi-cloud-upload"></i> Uploading ${Math.round(progress)}%...`;
      },
      (error) => {
        progressContainer.style.display = 'none';
        uploadStatus.style.display = 'none';
        
        let errorMessage = "Upload failed";
        if (error.code === 'storage/unauthorized') {
          errorMessage = "Permission denied. Check Firebase Storage Rules.";
        } else if (error.code === 'storage/canceled') {
          errorMessage = "Upload canceled";
        }
        
        reject(new Error(errorMessage));
      },
      async () => {
        try {
          const downloadURL = await storageRef.getDownloadURL();
          progressContainer.style.display = 'none';
          uploadStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i> Complete!';
          setTimeout(() => uploadStatus.style.display = 'none', 1500);
          resolve(downloadURL);
        } catch (error) {
          reject(new Error("Failed to get download URL"));
        }
      }
    );
  });
}

async function savePost() {
  if (!isAdminLoggedIn) {
    showToast("⚠️ Admin access required!", "error");
    return;
  }
  
  const urlInput = document.getElementById("imgUrl").value.trim();
  const fileInput = document.getElementById("imageUpload").files[0];
  const category = document.getElementById("category").value.trim();
  const promptDesc = document.getElementById("promptDesc").value.trim();
  const publishBtn = document.getElementById("publishBtn");
  
  if (!promptDesc) {
    showToast("❌ Please enter a prompt description.", "error");
    return;
  }
  
  if (!urlInput && !fileInput) {
    showToast("❌ Please enter an image URL or upload an image.", "error");
    return;
  }
  
  let imageUrl = urlInput;
  
  if (fileInput) {
    try {
      publishBtn.disabled = true;
      publishBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';
      
      if (fileInput.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }
      
      imageUrl = await uploadImage(fileInput);
      showToast("✅ Image uploaded!", "success");
    } catch (error) {
      showToast("❌ Upload failed: " + error.message, "error");
      publishBtn.disabled = false;
      publishBtn.innerHTML = '<i class="bi bi-send-fill me-1"></i> Publish';
      return;
    }
  }
  
  try {
    publishBtn.disabled = true;
    publishBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    
    const newPromptRef = db.push();
    await newPromptRef.set({
      imageUrl: imageUrl,
      category: category || "AI Art",
      prompt: promptDesc,
      timestamp: Date.now()
    });
    
    showToast("✅ Published!", "success");
    
    document.getElementById("imgUrl").value = "";
    document.getElementById("imageUpload").value = "";
    document.getElementById("imagePreviewContainer").innerHTML = "";
    document.getElementById("category").value = "";
    document.getElementById("promptDesc").value = "";
    
  } catch (error) {
    showToast("❌ Failed to save: " + error.message, "error");
  } finally {
    publishBtn.disabled = false;
    publishBtn.innerHTML = '<i class="bi bi-send-fill me-1"></i> Publish';
  }
}

function editPrompt(key, currentData) {
  if (!isAdminLoggedIn) return;
  document.getElementById("editKey").value = key;
  document.getElementById("editImageUrl").value = currentData.imageUrl || "";
  document.getElementById("editCategory").value = currentData.category || "";
  document.getElementById("editPrompt").value = currentData.prompt || "";
  document.getElementById("editModal").style.display = "flex";
}

function updatePrompt() {
  const key = document.getElementById("editKey").value;
  const imageUrl = document.getElementById("editImageUrl").value.trim();
  const category = document.getElementById("editCategory").value.trim();
  const prompt = document.getElementById("editPrompt").value.trim();
  
  if (!imageUrl || !prompt) {
    showToast("❌ Required fields missing!", "error");
    return;
  }
  
  db.child(key).update({
    imageUrl,
    category: category || "AI Art",
    prompt
  }, (error) => {
    if (!error) {
      showToast("✅ Updated!", "success");
      closeEditModal();
    } else {
      showToast("❌ Update failed", "error");
    }
  });
}

function deletePrompt(key) {
  if (!isAdminLoggedIn) return;
  if (confirm("⚠️ Delete this prompt? This cannot be undone!")) {
    db.child(key).remove((error) => {
      if (!error) {
        if (favorites.includes(key)) {
          favorites = favorites.filter(id => id !== key);
          localStorage.setItem('sourovFavorites', JSON.stringify(favorites));
          updateFavoriteCount();
        }
        if (selectedPrompts.includes(key)) {
          selectedPrompts = selectedPrompts.filter(id => id !== key);
          updateBulkDeleteUI();
        }
        showToast("✅ Deleted!", "success");
      } else {
        showToast("❌ Delete failed", "error");
      }
    });
  }
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// ==================== THEME ====================
function toggleTheme() {
  const body = document.body;
  const icon = document.querySelector("#theme-icon");
  if (body.getAttribute("data-theme") === "dark") {
    body.setAttribute("data-theme", "light");
    icon.className = "bi bi-sun";
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    icon.className = "bi bi-moon-stars";
    localStorage.setItem("theme", "dark");
  }
  if (typeof lightbox !== 'undefined') lightbox.init();
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.setAttribute("data-theme", "light");
  const icon = document.querySelector("#theme-icon");
  if (icon) icon.className = "bi bi-sun";
}

// ==================== UTILITIES ====================
function copyPromptText(elementId, btnElement) {
  const textElement = document.getElementById(elementId);
  if (!textElement) return;
  
  const originalHTML = btnElement.innerHTML;
  navigator.clipboard.writeText(textElement.innerText).then(() => {
    btnElement.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Copied!';
    setTimeout(() => { btnElement.innerHTML = originalHTML; }, 2000);
    showToast("✅ Copied!", "success");
  }).catch(() => showToast("❌ Copy failed", "error"));
}

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==================== RENDER GALLERY ====================
function renderFilteredGallery(prompts) {
  const container = document.getElementById("gallery-container");
  const noResults = document.getElementById("noResults");
  container.innerHTML = "";
  
  if (prompts.length === 0) {
    noResults.style.display = "block";
    return;
  }
  
  noResults.style.display = "none";
  
  prompts.forEach((item) => {
    let imageUrl = item.imageUrl || "https://placehold.co/600x400/1e293b/64748b?text=No+Image";
    const category = item.category || "Uncategorized";
    const promptText = item.prompt || "No prompt description available.";
    const copyId = `prompt-${item.id}`;
    const isFav = isFavorite(item.id);
    const isSelected = selectedPrompts.includes(item.id);
    const fileName = `${category.toLowerCase().replace(/\s/g, '-')}-${item.id.substring(0, 8)}.jpg`;
    
    const adminActions = isAdminLoggedIn ? `
      <button class="card-action-btn edit" onclick='editPrompt("${item.id}", ${JSON.stringify(item).replace(/'/g, "\\'")})' title="Edit">
        <i class="bi bi-pencil-fill"></i>
      </button>
      <button class="card-action-btn delete" onclick='deletePrompt("${item.id}")' title="Delete">
        <i class="bi bi-trash-fill"></i>
      </button>
    ` : '';
    
    const selectCheckbox = isAdminLoggedIn ? `
      <div class="select-checkbox" onclick="event.stopPropagation(); toggleSelectPrompt('${item.id}')">
        <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); toggleSelectPrompt('${item.id}')" style="cursor: pointer;">
      </div>
    ` : '';
    
    container.innerHTML += `
      <div class="col-md-4 col-sm-6 col-12">
        <div class="prompt-card-modern">
          <div class="card-actions">
            <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.id}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
              <i class="bi bi-star-fill"></i>
            </button>
            ${adminActions}
          </div>
          ${selectCheckbox}
          <a href="${escapeHtml(imageUrl)}" data-lightbox="gallery-group" class="card-image-link">
            <img src="${escapeHtml(imageUrl)}" class="card-image" onerror="this.src='https://placehold.co/600x400/1e293b/64748b?text=Image+Error'">
          </a>
          <div class="p-3">
            <span class="category-chip">${escapeHtml(category)}</span>
            <div id="${copyId}" class="prompt-content">${escapeHtml(promptText)}</div>
            <button class="btn-copy-modern" onclick="copyPromptText('${copyId}', this)">
              <i class="bi bi-clipboard-data me-1"></i> Copy Prompt
            </button>
            <button class="btn-download-modern" onclick="downloadImage('${escapeHtml(imageUrl)}', '${escapeHtml(fileName)}')">
              <i class="bi bi-download"></i> Download Image
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  if (typeof lightbox !== 'undefined') lightbox.init();
}

// ==================== LOAD DATA ====================
function loadGallery() {
  document.getElementById("loader").style.display = "flex";
  db.on("value", (snapshot) => {
    document.getElementById("loader").style.display = "none";
    const data = snapshot.val();
    allPrompts = [];
    if (data) {
      Object.keys(data).forEach(key => {
        allPrompts.push({ id: key, ...data[key] });
      });
    }
    document.getElementById("totalCount").innerText = allPrompts.length;
    updateFavoriteCount();
    populateCategoryFilter();
    filterAndRender();
  }, (error) => {
    document.getElementById("loader").style.display = "none";
    console.error(error);
    showToast("❌ Failed to load prompts", "error");
  });
}

// Add event listeners for search and filter
document.addEventListener('input', (e) => {
  if (e.target.id === 'searchInput') filterAndRender();
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'categoryFilter' || e.target.id === 'sortBy') filterAndRender();
});

loadGallery();

// Expose functions globally
window.toggleTheme = toggleTheme;
window.savePost = savePost;
window.copyPromptText = copyPromptText;
window.editPrompt = editPrompt;
window.deletePrompt = deletePrompt;
window.updatePrompt = updatePrompt;
window.closeEditModal = closeEditModal;
window.triggerAdminLogin = triggerAdminLogin;
window.adminLogin = adminLogin;
window.closeAdminLogin = closeAdminLogin;
window.logoutAdmin = logoutAdmin;
window.sendPasswordReset = sendPasswordReset;
window.toggleFavorite = toggleFavorite;
window.clearFilters = clearFilters;
window.toggleFavoriteView = toggleFavoriteView;
window.downloadImage = downloadImage;
window.toggleSelectPrompt = toggleSelectPrompt;
window.bulkDelete = bulkDelete;
window.clearSelection = clearSelection;

// Create manifest.json for PWA
const manifestData = {
  name: "SoURoV AI Prompt HUB",
  short_name: "SoURoV AI",
  description: "Professional AI Prompt Gallery with Image Download",
  start_url: ".",
  display: "standalone",
  theme_color: "#4361ee",
  background_color: "#0f172a",
  icons: [
    { src: "https://via.placeholder.com/192x192/4361ee/white?text=AI", sizes: "192x192", type: "image/png" },
    { src: "https://via.placeholder.com/512x512/4361ee/white?text=AI", sizes: "512x512", type: "image/png" }
  ]
};
const manifestBlob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
const manifestURL = URL.createObjectURL(manifestBlob);
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) manifestLink.href = manifestURL;
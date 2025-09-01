/* ShellVault - Futuristic JavaScript */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initLoadingOverlay();
    initBackgroundEffects();
    initMouseTracking();
    
    const path = window.location.pathname;
    if (path.endsWith('/') || path.endsWith('index.html')) {
        initIndexPage();
    } else if (path.endsWith('script.html')) {
        initScriptPage();
    }
    
    initTooltips();
    initNavigation();
    hideLoadingOverlay();
});

// ===== LOADING OVERLAY =====
function initLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 800);
        }
    }, 1500);
}

// ===== BACKGROUND EFFECTS =====
function initBackgroundEffects() {
    createParticles();
    initGeometricPatterns();
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, 
                rgba(0, 102, 255, 0.8) 0%, 
                rgba(0, 170, 255, 0.4) 50%, 
                transparent 100%);
            border-radius: 50%;
            animation: particleFloat ${duration}s linear infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add particle animation CSS
    if (!document.getElementById('particleStyles')) {
        const styles = document.createElement('style');
        styles.id = 'particleStyles';
        styles.textContent = `
            @keyframes particleFloat {
                0% { 
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% { 
                    transform: translateY(-10vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

function initGeometricPatterns() {
    const patterns = document.querySelector('.geometric-patterns');
    if (patterns) {
        // Dodatkowe wzory geometryczne można dodać tutaj
        patterns.style.backgroundImage += `, 
            linear-gradient(45deg, transparent 40%, rgba(0, 255, 255, 0.1) 50%, transparent 60%)`;
    }
}

// ===== MOUSE TRACKING =====
function initMouseTracking() {
    const mouseLight = document.getElementById('mouseLight');
    if (!mouseLight) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    
    function updateMouseLight() {
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;
        
        mouseLight.style.left = mouseX + 'px';
        mouseLight.style.top = mouseY + 'px';
        
        requestAnimationFrame(updateMouseLight);
    }
    
    updateMouseLight();
}

// ===== NAVIGATION =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const contributePanel = document.getElementById('contributePanel');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Handle actions
            switch(action) {
                case 'home':
                    scrollToTop();
                    break;
                case 'about':
                    showAboutModal();
                    break;
                case 'contribute':
                    if (contributePanel) {
                        contributePanel.style.display = 'flex';
                    }
                    break;
            }
        });
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showAboutModal() {
    // Można dodać modal z informacjami o projekcie
    alert('ShellVault - Futuristic Shell Script Repository\n\nAdvanced collection of shell scripts for DevOps and system administration.');
}

// ===== DATA FETCHING =====
async function fetchScripts() {
    try {
        const response = await fetch('data/scripts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Could not fetch scripts data:", error);
        return null;
    }
}

// ===== INDEX PAGE =====
async function initIndexPage() {
    const data = await fetchScripts();
    if (!data) return;

    const categoriesList = document.getElementById('categoriesList');
    const scriptGrid = document.getElementById('scriptGrid');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const clearSearchBtn = document.getElementById('clearSearch');
    const allScripts = data.categories.flatMap(cat => cat.items.map(item => ({ ...item, categoryId: cat.id })));

    // Update stats in footer
    updateStats(allScripts.length, data.categories.length);

    function renderCategories(categories) {
        categoriesList.innerHTML = `<div class="category-pill active" data-category-id="all">All Scripts</div>`;
        categories.forEach(cat => {
            categoriesList.innerHTML += `<div class="category-pill" data-category-id="${cat.id}">${cat.name}</div>`;
        });
    }

    function renderScripts(scripts) {
        scriptGrid.innerHTML = '';
        noResults.style.display = scripts.length === 0 ? 'block' : 'none';
        
        if (scripts.length === 0) {
            scriptGrid.appendChild(noResults);
            return;
        }

        scripts.forEach((script, index) => {
            const tagsHTML = script.tags.map(tag => `<span class="script-tag">${tag}</span>`).join('');
            const card = document.createElement('div');
            card.className = 'cyber-card fade-in';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <h3 class="script-name">${script.name}</h3>
                <p class="script-description">${script.short}</p>
                <div class="script-tags">${tagsHTML}</div>
                <div class="script-checksum" data-tooltip="Verify: sha256sum ${script.filename}">
                    SHA256: <code>${script.sha256.substring(0, 12)}...</code>
                </div>
                <div class="script-actions">
                    <a href="script.html?slug=${script.slug}" class="cyber-button-secondary">Details</a>
                    <a href="files/${script.filename}" download class="cyber-button-primary">Download</a>
                </div>
            `;
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg)';
                addCardGlow(card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0deg)';
                removeCardGlow(card);
            });
            
            scriptGrid.appendChild(card);
        });
        
        initTooltips();
    }

    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.category-pill.active')?.dataset.categoryId || 'all';
        let filtered = allScripts;

        if (activeCategory !== 'all') {
            filtered = filtered.filter(s => s.categoryId === activeCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchTerm) ||
                s.short.toLowerCase().includes(searchTerm) ||
                s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        renderScripts(filtered);
    }

    // Event listeners
    searchInput.addEventListener('input', filterAndRender);
    
    document.addEventListener('keydown', e => { 
        if (e.key === '/') { 
            e.preventDefault(); 
            searchInput.focus(); 
        } 
    });
    
    categoriesList.addEventListener('click', e => {
        if (e.target.classList.contains('category-pill')) {
            e.preventDefault();
            
            // Remove active class from all pills
            document.querySelectorAll('.category-pill').forEach(pill => {
                pill.classList.remove('active');
            });
            
            // Add active class to clicked pill
            e.target.classList.add('active');
            
            filterAndRender();
        }
    });
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            
            // Reset category to "All"
            document.querySelectorAll('.category-pill').forEach(pill => {
                pill.classList.remove('active');
            });
            document.querySelector('.category-pill[data-category-id="all"]')?.classList.add('active');
            
            filterAndRender();
        });
    }

    renderCategories(data.categories);
    renderScripts(allScripts);
}

// ===== SCRIPT PAGE =====
async function initScriptPage() {
    const data = await fetchScripts();
    if (!data) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = (urlParams.get('slug') || '').replace(/[^a-zA-Z0-9-]/g, '');
    const script = data.categories.flatMap(c => c.items).find(s => s.slug === slug);

    if (script) {
        document.getElementById('scriptDetailsContainer')?.style.setProperty('display', 'flex');
        await displayScriptDetails(script);
    } else {
        document.getElementById('notFoundMessage')?.style.setProperty('display', 'block');
    }
}

async function displayScriptDetails(script) {
    document.title = `${script.name} - ShellVault`;
    
    const elements = {
        scriptName: document.getElementById('scriptName'),
        scriptHeaderSubtitle: document.getElementById('scriptHeaderSubtitle'),
        scriptFullDescription: document.getElementById('scriptFullDescription'),
        scriptSize: document.getElementById('scriptSize'),
        scriptSha256: document.getElementById('scriptSha256'),
        scriptTags: document.getElementById('scriptTags'),
        scriptUsage: document.getElementById('scriptUsage'),
        downloadButton: document.getElementById('downloadButton'),
        codePreview: document.getElementById('scriptCodePreview')
    };

    if (elements.scriptName) elements.scriptName.textContent = script.name;
    if (elements.scriptHeaderSubtitle) elements.scriptHeaderSubtitle.textContent = `Details: ${script.filename}`;
    if (elements.scriptFullDescription) elements.scriptFullDescription.textContent = script.short;
    if (elements.scriptSize) elements.scriptSize.textContent = `${(script.size_bytes / 1024).toFixed(2)} KB`;
    if (elements.scriptSha256) elements.scriptSha256.textContent = script.sha256;
    if (elements.scriptTags) elements.scriptTags.innerHTML = script.tags.map(tag => `<span class="script-tag">${tag}</span>`).join('');
    if (elements.scriptUsage) elements.scriptUsage.innerHTML = `<pre><code>${script.usage.join('\n')}</code></pre>`;
    if (elements.downloadButton) elements.downloadButton.href = `files/${script.filename}`;

    // Load code preview
    if (elements.codePreview) {
        try {
            const response = await fetch(`files/${script.filename}`);
            const code = await response.text();
            elements.codePreview.textContent = code;
            if (typeof hljs !== 'undefined') {
                hljs.highlightElement(elements.codePreview);
            }
        } catch (error) {
            elements.codePreview.textContent = 'Error loading script preview.';
        }
    }
    
    initCopyButtons();
}

// ===== UTILITY FUNCTIONS =====
function updateStats(scriptCount, categoryCount) {
    const scriptsCountEl = document.getElementById('scriptsCount');
    const categoriesCountEl = document.getElementById('categoriesCount');
    
    if (scriptsCountEl) {
        animateCounter(scriptsCountEl, scriptCount);
    }
    
    if (categoriesCountEl) {
        animateCounter(categoriesCountEl, categoryCount);
    }
}

function animateCounter(element, targetValue) {
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 30);
}

function addCardGlow(card) {
    if (!card.querySelector('.card-glow')) {
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, 
                rgba(0, 102, 255, 0.3),
                rgba(0, 255, 255, 0.3),
                rgba(136, 0, 255, 0.3)
            );
            border-radius: 15px;
            z-index: -1;
            filter: blur(8px);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        card.appendChild(glow);
        setTimeout(() => glow.style.opacity = '1', 10);
    }
}

function removeCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
        glow.style.opacity = '0';
        setTimeout(() => glow.remove(), 300);
    }
}

// ===== ENHANCED TOOLTIPS =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    const tooltip = document.getElementById('tooltip');
    
    if (!tooltip) return;
    
    tooltipElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const tooltipContent = tooltip.querySelector('.tooltip-content');
            if (tooltipContent) {
                tooltipContent.textContent = el.getAttribute('data-tooltip');
            } else {
                tooltip.textContent = el.getAttribute('data-tooltip');
            }
            
            tooltip.style.left = `${e.pageX + 15}px`;
            tooltip.style.top = `${e.pageY + 15}px`;
        });
        
        el.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
        });
        
        el.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// ===== COPY FUNCTIONALITY =====
function initCopyButtons() {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                const targetId = button.dataset.copyTarget;
                const textToCopy = document.getElementById(targetId)?.textContent;
                
                if (textToCopy) {
                    await navigator.clipboard.writeText(textToCopy);
                    showCopyFeedback(button);
                }
            } catch (error) {
                console.error('Copy failed:', error);
                showCopyError(button);
            }
        });
    });
}

function showCopyFeedback(button) {
    const feedback = button.nextElementSibling;
    if (feedback && feedback.classList.contains('copy-feedback')) {
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2000);
    } else {
        // Create temporary feedback
        const tempFeedback = document.createElement('span');
        tempFeedback.textContent = 'Copied!';
        tempFeedback.style.cssText = `
            color: var(--cyber-cyan-light);
            font-size: 0.8em;
            margin-left: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        button.parentNode.insertBefore(tempFeedback, button.nextSibling);
        setTimeout(() => tempFeedback.style.opacity = '1', 10);
        setTimeout(() => {
            tempFeedback.style.opacity = '0';
            setTimeout(() => tempFeedback.remove(), 300);
        }, 1500);
    }
}

function showCopyError(button) {
    console.log('Copy failed - showing error feedback');
}

// ===== ENHANCED INTERACTIONS =====
function addRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 102, 255, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    if (!document.getElementById('rippleStyles')) {
        const styles = document.createElement('style');
        styles.id = 'rippleStyles';
        styles.textContent = `
            @keyframes rippleEffect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple effect to all cyber buttons
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.cyber-button-primary, .cyber-button-secondary, .nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                addRippleEffect(button, e);
            });
        });
    }, 100);
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);

    // Observe all cards for scroll animations
    document.querySelectorAll('.cyber-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACCESSIBILITY =====
function initAccessibility() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Escape':
                // Close any open modals
                const contributePanel = document.getElementById('contributePanel');
                if (contributePanel && contributePanel.style.display === 'flex') {
                    contributePanel.style.display = 'none';
                }
                break;
        }
    });
    
    // Focus management for modals
    const contributePanel = document.getElementById('contributePanel');
    if (contributePanel) {
        contributePanel.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Trap focus within modal
                const focusableElements = contributePanel.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAccessibility, 100);
    setTimeout(initScrollAnimations, 500);
});

// TINAP Website - Main JavaScript

// ===== Language Management =====
let currentLang = localStorage.getItem('tinap-lang') || 'da';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tinap-lang', lang);
    updatePageContent();
    updateLangSwitcher();
}

function updatePageContent() {
    const t = translations[currentLang];

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });

    // Update document lang attribute
    document.documentElement.lang = currentLang;
}

function updateLangSwitcher() {
    const langBtn = document.querySelector('.lang-btn-text');
    if (langBtn) {
        const langNames = { da: 'DA', en: 'EN', zh: '中' };
        langBtn.textContent = langNames[currentLang];
    }
}

// ===== Navigation =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle?.classList.remove('active');
        });
    });
}

// ===== Language Switcher =====
function initLangSwitcher() {
    const switcher = document.querySelector('.lang-switcher');
    const btn = document.querySelector('.lang-btn');
    const options = document.querySelectorAll('.lang-option');

    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        switcher?.classList.toggle('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            switcher?.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', () => {
        switcher?.classList.remove('open');
    });
}

// ===== Accordion =====
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header?.addEventListener('click', () => {
            // Close other items
            items.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===== Forms =====
function initForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (email) {
            // Show success message (in real app, would send to backend)
            const successEl = document.querySelector('.newsletter-success');
            successEl?.classList.add('show');
            newsletterForm.reset();

            // Hide after 5 seconds
            setTimeout(() => {
                successEl?.classList.remove('show');
            }, 5000);
        }
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success message
        const successEl = document.querySelector('.contact-form-success');
        successEl?.classList.add('show');
        contactForm.reset();

        // Hide after 5 seconds
        setTimeout(() => {
            successEl?.classList.remove('show');
        }, 5000);
    });
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Navbar height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Particle Background (optional enhancement) =====
function createParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - dist / 150)})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLangSwitcher();
    initAccordion();
    initForms();
    initScrollReveal();
    initSmoothScroll();
    createParticles();

    // Set initial language
    updatePageContent();
    updateLangSwitcher();
});

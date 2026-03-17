// script.js — SHOTLY Photography Agency

// ============================================
// 1. LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.9,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);

// ============================================
// 2. SIDEBAR NAV
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const navSidebar = document.querySelector('.nav-sidebar');
const navBackdrop = document.querySelector('.nav-backdrop');
const navLinks = document.querySelectorAll('.nav-links a');

function openMenu() {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    navSidebar.classList.add('active');
    navBackdrop.classList.add('active');
    lenis.stop();
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    navSidebar.classList.remove('active');
    navBackdrop.classList.remove('active');
    lenis.start();
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    menuToggle.classList.contains('active') ? closeMenu() : openMenu();
});

// Fecha ao clicar no backdrop
navBackdrop.addEventListener('click', closeMenu);

// Fecha com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.classList.contains('active')) closeMenu();
});

// Navegação pelos links da sidebar
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Links externos (portfolio.html, etc.) — navega normalmente
        if (!href || !href.startsWith('#')) {
            closeMenu();
            return;
        }

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        closeMenu();

        setTimeout(() => {
            const targetTop = href === '#home'
                ? 0
                : target.getBoundingClientRect().top + window.scrollY;

            lenis.stop();
            window.scrollTo({ top: targetTop, behavior: 'instant' });

            requestAnimationFrame(() => {
                lenis.start();
                ScrollTrigger.refresh(true);
            });
        }, 420);
    });
});

// CTA buttons com data-nav (scroll para section)
document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.classList.contains('nav-links a')) return; // ja tratado acima
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        lenis.stop();
        window.scrollTo({ top: targetTop, behavior: 'instant' });
        requestAnimationFrame(() => { lenis.start(); ScrollTrigger.refresh(true); });
    });
});

// ============================================
// 3. NAVBAR — estilo ao sair do hero
// ============================================
const header = document.querySelector('header');
const heroSection = document.querySelector('.hero');

function updateNavbarStyle() {
    if (!heroSection) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    header.classList.toggle('scrolled', heroBottom <= 100);
}

lenis.on('scroll', updateNavbarStyle);
window.addEventListener('resize', updateNavbarStyle);
updateNavbarStyle();

// ============================================
// 4. HERO — animação de entrada
// ============================================
gsap.set(".hero-bg-img",      { scale: 1.3, filter: "brightness(0.25)" });
gsap.set(".hero-bg-overlay",  { opacity: 1 });
gsap.set(".title-word",       { y: 120, opacity: 0 });
gsap.set(".hero-subtitle",    { opacity: 0, y: 30 });
gsap.set(".scroll-indicator", { opacity: 0, y: 20 });
gsap.set(".hero-eyebrow",     { opacity: 0, y: -10 });

const heroEntranceTl = gsap.timeline({ delay: 0.4 });
heroEntranceTl
    .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
    .to(".title-word", { y: 0, opacity: 1, duration: 1.1, stagger: 0.18, ease: "power3.out" }, "-=0.3")
    .to(".hero-subtitle", { opacity: 0.88, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.55")
    .to(".scroll-indicator", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.45");

// Transição Hero → Features
const heroScrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.4,
        pin: ".hero-wrapper",
        anticipatePin: 1
    }
});

heroScrollTl
    .to(".hero-bg-img", { scale: 1, filter: "brightness(0.65)", ease: "none" }, 0)
    .to(".hero-bg-overlay", { opacity: 0.15, ease: "none" }, 0)
    .to(".hero-content-center", { y: -160, opacity: 0, ease: "power2.in" }, 0.4)
    .to(".hero-bottom-content", { opacity: 0, y: -80, ease: "power2.in" }, 0.5)
    .to(".hero-bg-img", { y: -100, filter: "brightness(0) blur(6px)", ease: "power2.in" }, 0.7)
    .to(".hero-wrapper", { opacity: 0, ease: "power2.in" }, 0.8);

// ============================================
// 5. ABOUT — animação de entrada
// ============================================
gsap.from(".about-img-wrap", {
    scrollTrigger: { trigger: ".about", start: "top 75%", toggleActions: "play none none reverse" },
    opacity: 0, x: -60, duration: 1.2, ease: "power3.out"
});

gsap.from(".about-img-secondary", {
    scrollTrigger: { trigger: ".about", start: "top 70%", toggleActions: "play none none reverse" },
    opacity: 0, x: -30, y: 20, duration: 1.1, delay: 0.25, ease: "power3.out"
});

gsap.from(".about-badge", {
    scrollTrigger: { trigger: ".about", start: "top 70%", toggleActions: "play none none reverse" },
    opacity: 0, scale: 0.6, duration: 0.8, delay: 0.5, ease: "back.out(1.5)"
});

gsap.from(".about-text", {
    scrollTrigger: { trigger: ".about", start: "top 75%", toggleActions: "play none none reverse" },
    opacity: 0, x: 60, duration: 1.2, ease: "power3.out"
});

gsap.from(".about-value", {
    scrollTrigger: { trigger: ".about-values", start: "top 85%", toggleActions: "play none none reverse" },
    opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: "power2.out"
});

// ============================================
// 6. FEATURES
// ============================================
gsap.from(".features", {
    scrollTrigger: { trigger: ".features", start: "top 80%", end: "top 30%", scrub: 1 },
    opacity: 0, y: 50, ease: "none"
});

document.querySelectorAll(".feature-item").forEach((item) => {
    const isReverse = item.classList.contains("reverse");
    gsap.from(item.querySelector(".feature-text"), {
        scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" },
        opacity: 0, x: isReverse ? 70 : -70, duration: 1.1, ease: "power3.out"
    });
    gsap.from(item.querySelector(".feature-visual"), {
        scrollTrigger: { trigger: item, start: "top 75%", toggleActions: "play none none reverse" },
        opacity: 0, scale: 0.9, duration: 1.3, ease: "power3.out"
    });
});

// ============================================
// 7. SHOWCASE — scroll horizontal
// ============================================
function initHorizontalScroll() {
    const horizontalSection   = document.querySelector(".horizontal-scroll");
    const horizontalContainer = document.querySelector(".horizontal-container");
    if (!horizontalSection || !horizontalContainer) return;

    const getScrollAmount = () => -(horizontalContainer.scrollWidth - window.innerWidth);

    const tween = gsap.to(horizontalContainer, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: horizontalSection,
            pin: true,
            scrub: 1.8,
            end: () => `+=${horizontalContainer.scrollWidth}`,
            invalidateOnRefresh: true
        }
    });

    document.querySelectorAll(".panel-text").forEach((panel, index) => {
        gsap.from(panel, {
            scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left center",
                toggleActions: "play none none reverse"
            },
            opacity: 0, y: 50, duration: 0.9, ease: "power2.out", delay: index * 0.08
        });
    });
}

initHorizontalScroll();

// Animação de entrada do showcase header
gsap.from(".showcase-header", {
    scrollTrigger: { trigger: ".showcase-header", start: "top 85%", toggleActions: "play none none reverse" },
    opacity: 0, y: 30, duration: 0.9, ease: "power2.out"
});

// ============================================
// 8. LIFESTYLE
// ============================================
gsap.set('.lifestyle-bg-wrapper', { clipPath: 'circle(0% at 50% 50%)' });
gsap.set('.lifestyle-bg',          { scale: 1.2 });
gsap.set('.lifestyle-content-wrapper', { opacity: 0, y: 40 });

const lifestyleTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.lifestyle',
        start: 'top 70%',
        end: 'bottom 20%',
        scrub: 1.8,
        anticipatePin: 1
    }
});

lifestyleTl
    .fromTo('.lifestyle-bg-wrapper',
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none', duration: 0.5 }, 0)
    .fromTo('.lifestyle-bg',
        { scale: 1.2 }, { scale: 1, ease: 'none', duration: 0.5 }, 0)
    .fromTo('.lifestyle-content-wrapper',
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 0.1)
    .to('.lifestyle-content-wrapper',
        { opacity: 0, y: -30, ease: 'power2.in', duration: 0.3 }, 0.7);

// ============================================
// 9. SERVICES
// ============================================
gsap.from(".services .section-header", {
    scrollTrigger: { trigger: ".services", start: "top 80%", toggleActions: "play none none reverse" },
    opacity: 0, y: 40, duration: 1, ease: "power2.out"
});

gsap.from(".service-card", {
    scrollTrigger: { trigger: ".services-grid", start: "top 82%", toggleActions: "play none none reverse" },
    opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: "power2.out"
});

// ============================================
// 10. PROCESS
// ============================================
gsap.from(".process .section-header", {
    scrollTrigger: { trigger: ".process", start: "top 80%", toggleActions: "play none none reverse" },
    opacity: 0, y: 40, duration: 1, ease: "power2.out"
});

gsap.from(".process-step", {
    scrollTrigger: { trigger: ".process-steps", start: "top 82%", toggleActions: "play none none reverse" },
    opacity: 0, y: 50, duration: 0.9, stagger: 0.15, ease: "power3.out"
});

// ============================================
// 11. TESTIMONIALS
// ============================================
gsap.from(".testimonial-card", {
    scrollTrigger: { trigger: ".testimonials-grid", start: "top 82%", toggleActions: "play none none reverse" },
    opacity: 0, y: 50, duration: 0.9, stagger: 0.15, ease: "power3.out"
});

// ============================================
// 12. STATS — counter animation
// ============================================
gsap.from(".stats-heading", {
    scrollTrigger: { trigger: ".stats", start: "top 80%", toggleActions: "play none none reverse" },
    opacity: 0, y: 40, duration: 1, ease: "power2.out"
});

const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

statNumbers.forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => animateCounter(el)
    });
});

gsap.from(".stat-item", {
    scrollTrigger: { trigger: ".stats-grid", start: "top 82%", toggleActions: "play none none reverse" },
    opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: "power2.out"
});

// ============================================
// 13. BLOG
// ============================================
gsap.from(".blog .section-header", {
    scrollTrigger: { trigger: ".blog", start: "top 80%", toggleActions: "play none none reverse" },
    opacity: 0, y: 40, duration: 1, ease: "power2.out"
});

gsap.from(".blog-card", {
    scrollTrigger: { trigger: ".blog-grid", start: "top 82%", toggleActions: "play none none reverse" },
    opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: "power3.out"
});

// ============================================
// 14. CTA PRINCIPAL
// ============================================
gsap.from(".cta-main-content", {
    scrollTrigger: { trigger: ".cta-main", start: "top 75%", toggleActions: "play none none reverse" },
    opacity: 0, y: 60, scale: 0.97, duration: 1.1, ease: "power3.out"
});

// Parallax sutil na imagem do CTA main
gsap.to(".cta-main-bg", {
    scrollTrigger: { trigger: ".cta-main", start: "top bottom", end: "bottom top", scrub: true },
    y: "20%", ease: "none"
});

// ============================================
// 15. CTA FORMULARIO
// ============================================
gsap.to(".cta-bg", {
    scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true },
    y: "28%", ease: "none"
});

gsap.from(".cta-content", {
    scrollTrigger: { trigger: ".cta", start: "top 80%", toggleActions: "play none none reverse" },
    opacity: 0, y: 70, scale: 0.96, duration: 1.1, ease: "power3.out"
});

// ============================================
// 16. FOOTER parallax
// ============================================
gsap.to(".footer-parallax", {
    scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom top", scrub: true },
    y: "18%", ease: "none"
});

// ============================================
// 17. FOOTER NAV scroll suave
// ============================================
document.querySelectorAll('.footer-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.includes('#')) return;
        e.preventDefault();
        const hash = '#' + href.split('#')[1];
        const target = document.querySelector(hash);
        if (!target) return;
        const targetTop = hash === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY;
        lenis.stop();
        window.scrollTo({ top: targetTop, behavior: 'instant' });
        requestAnimationFrame(() => { lenis.start(); ScrollTrigger.refresh(true); });
    });
});

// ============================================
// 18. CONTACT FORM
// ============================================
const cfBtn = document.getElementById('cf-btn');
if (cfBtn) {
    cfBtn.addEventListener('click', () => {
        const name  = document.getElementById('cf-name').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const msg   = document.getElementById('cf-msg').value.trim();
        if (!name || !email || !msg) return;
        cfBtn.classList.add('sent');
        cfBtn.querySelector('.cf-btn-text').textContent = 'Mensagem enviada!';
    });
}

// ============================================
// 19. RESIZE & LOAD
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});

window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 150);
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
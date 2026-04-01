/* ═══════════════════════════════════════════════
   TYOFARM – Aqiqah & Qurban App JS
═══════════════════════════════════════════════ */

'use strict';

/* ── SPLASH SCREEN ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hidden');
  }, 2400);
});

/* ── NAVBAR ── */
const navbar  = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navDrawer = document.getElementById('navDrawer');

window.addEventListener('scroll', () => {
  // Navbar scroll style
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Back to top
  const bt = document.getElementById('backTop');
  if (bt) bt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navDrawer.classList.toggle('open');
});

function closeMenu() {
  menuBtn.classList.remove('active');
  navDrawer.classList.remove('open');
}

/* ── SCROLL TO TOP ── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── SMOOTH ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── REVEAL ON SCROLL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateNum(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const steps = 60;
  const stepVal = target / steps;
  let current = 0;
  let count = 0;

  const tick = setInterval(() => {
    current = Math.min(current + stepVal, target);
    el.textContent = Math.floor(current).toLocaleString('id-ID');
    count++;
    if (count >= steps) clearInterval(tick);
  }, duration / steps);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNum(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hs-num, .cs-num').forEach(el => counterObs.observe(el));

/* ── TESTIMONIAL SLIDER ── */
const track = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const slides = track ? Array.from(track.querySelectorAll('.tc')) : [];
let activeSlide = 0;

if (slides.length > 0 && dotsWrap) {
  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goSlide(i));
    dotsWrap.appendChild(d);
  });

  function goSlide(idx) {
    activeSlide = idx;
    track.style.transform = `translateX(calc(-${idx * 100}% - ${idx * 16}px))`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 45) {
      if (dx > 0) goSlide((activeSlide + 1) % slides.length);
      else goSlide((activeSlide - 1 + slides.length) % slides.length);
    }
  });

  // Auto slide every 5s
  setInterval(() => goSlide((activeSlide + 1) % slides.length), 5000);
}

/* ── PARALLAX HERO GLOWS ── */
window.addEventListener('scroll', () => {
  const g1 = document.querySelector('.g1');
  const g2 = document.querySelector('.g2');
  const s = window.scrollY;
  if (g1) g1.style.transform = `translateY(${s * 0.08}px)`;
  if (g2) g2.style.transform = `translateY(${-s * 0.06}px)`;
}, { passive: true });

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#38b255', '#2a8c3f', '#1e6b2e', '#d4af37', '#5cce76'];
  const COUNT = 22;
  let particles = [];

  function resize() {
    canvas.width = Math.min(window.innerWidth, 480);
    canvas.height = window.innerHeight;
    canvas.style.left = `${(window.innerWidth - canvas.width) / 2}px`;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#38b255';
          ctx.globalAlpha = (1 - dist / 100) * 0.1;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── PWA INSTALL ── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;

  const btn = document.createElement('button');
  btn.textContent = '📲 Install App';
  btn.style.cssText = `
    position:fixed; bottom:90px; left:16px; z-index:49;
    padding:10px 16px;
    background:linear-gradient(135deg,#1e6b2e,#38b255);
    border:none; border-radius:12px;
    color:#fff; font-weight:700; font-size:0.82rem;
    cursor:pointer; box-shadow:0 4px 14px rgba(30,107,46,0.3);
    font-family:inherit;
  `;
  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') btn.remove();
    deferredPrompt = null;
  });
});

console.log('%c🐑 TYOFARM', 'font-size:22px;font-weight:900;color:#38b255;');
console.log('%cHewan Aqiqah & Qurban Sehat & Sesuai Syariat 🌿', 'color:#2a8c3f;');

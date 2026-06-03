
// ─── CURSOR PERSONALIZADO ───
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Suavizar el follower con rAF
function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;

  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover en links
document.querySelectorAll('a, button, .project-card, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform   = 'translate(-50%, -50%) scale(2.5)';
    cursor.style.mixBlendMode = 'difference';
    follower.style.transform  = 'translate(-50%, -50%) scale(1.5)';
    follower.style.borderColor = 'rgba(200,255,0,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform    = 'translate(-50%, -50%) scale(1)';
    cursor.style.mixBlendMode = 'normal';
    follower.style.transform  = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(200,255,0,0.5)';
  });
});


// ─── NOISE CANVAS ───
const noiseCanvas = document.getElementById('noiseCanvas');
const noiseCtx    = noiseCanvas.getContext('2d');

function resizeNoise() {
  noiseCanvas.width  = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
}
resizeNoise();
window.addEventListener('resize', resizeNoise);

function generateNoise() {
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const imageData = noiseCtx.createImageData(w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i]     = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  noiseCtx.putImageData(imageData, 0, 0);
  setTimeout(generateNoise, 80);
}
generateNoise();


// ─── NAVBAR SCROLL ───
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ─── REVEAL ON SCROLL ───
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger: pequeño delay por índice dentro del grupo visible
      const delay = (idx % 4) * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => revealObserver.observe(el));


// ─── CONTADOR HERO ───
function animateCounter(el, target, duration = 1800) {
  let start = null;

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

const counterNums = document.querySelectorAll('.counter-num');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counterNums.forEach((el, i) => {
      const target = parseInt(el.dataset.target, 10);
      setTimeout(() => animateCounter(el, target), i * 200);
    });
  }
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) counterObserver.observe(heroSection);


// ─── CUBO 3D PARALLAX ───
const cubeWrapper = document.getElementById('cubeWrapper');

document.addEventListener('mousemove', (e) => {
  if (!cubeWrapper) return;
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  const cube = cubeWrapper.querySelector('.cube');
  if (cube) {
    cube.style.animationPlayState = 'paused';
    cube.style.transform = `
      rotateX(${15 - dy * 20}deg)
      rotateY(${dx * 30}deg)
    `;
  }
});

document.addEventListener('mouseleave', () => {
  const cube = cubeWrapper?.querySelector('.cube');
  if (cube) cube.style.animationPlayState = 'running';
});


// ─── PHOTO FRAME 3D TILT ───
const photoFrame = document.getElementById('photoFrame');

if (photoFrame) {
  const wrapEl = document.getElementById('aboutPhotoWrap');

  wrapEl.addEventListener('mousemove', (e) => {
    const rect    = wrapEl.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;

    photoFrame.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
    `;
  });

  wrapEl.addEventListener('mouseleave', () => {
    photoFrame.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    photoFrame.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s';
  });

  wrapEl.addEventListener('mouseenter', () => {
    photoFrame.style.transition = 'transform 0.12s linear';
  });
}


// ─── SKILL BARS ───
function buildSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const level   = bar.dataset.level;
    const skill   = bar.dataset.skill;

    // Inyectar estructura
    bar.innerHTML = `
      <div class="skill-bar-header">
        <span class="skill-bar-name">${skill}</span>
        <span class="skill-bar-pct">${level}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-width="${level}"></div>
      </div>
    `;
  });

  // Inyectar estilos inline para los textos
  const style = document.createElement('style');
  style.textContent = `
    .skill-bar-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.4rem;
    }
    .skill-bar-name {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-2);
    }
    .skill-bar-pct {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-3);
    }
  `;
  document.head.appendChild(style);
}
buildSkillBars();

// Animarlos al entrar en viewport
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach((fill, i) => {
        const width = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = width + '%';
        }, i * 120);
      });
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);


// ─── PROYECTO CARDS — MAGNETIC EFFECT ───
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    card.style.transform = `
      translateY(-4px)
      perspective(600px)
      rotateY(${x * 4}deg)
      rotateX(${-y * 4}deg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear';
  });
});


// ─── SCROLL PARALLAX — BG TEXT HERO ───
const bgText = document.querySelector('.hero__bg-text');

window.addEventListener('scroll', () => {
  if (!bgText) return;
  const y = window.scrollY;
  bgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
  bgText.style.opacity   = Math.max(0, 0.03 - y * 0.0001);
});


// ─── SCROLL SUAVE PARA NAV LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ─── STARS BACKGROUND (canvas pequeño en hero) ───
function createStarField() {
  const canvas   = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
  `;
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.prepend(canvas);

  const ctx    = canvas.getContext('2d');
  const stars  = [];
  const N      = 120;

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < N; i++) {
    stars.push({
      x:  Math.random(),
      y:  Math.random(),
      r:  Math.random() * 1.2 + 0.2,
      a:  Math.random(),
      da: (Math.random() - 0.5) * 0.005,
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;

      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,255,0,${s.a * 0.6})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}
createStarField();


// ─── TYPING EFFECT — EMAIL CONTACT ───
function typewriterHover() {
  const emailEl = document.querySelector('.contact__email');
  if (!emailEl) return;

  const original = 'manuelvelasco.dev@gmail.com';
  const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.';

  emailEl.addEventListener('mouseenter', () => {
    let iterations = 0;
    const interval = setInterval(() => {
      const textNode = emailEl.childNodes[0];
      if (!textNode) return;

      textNode.textContent = original
        .split('')
        .map((char, i) => {
          if (i < iterations) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= original.length) {
        clearInterval(interval);
        textNode.textContent = original;
      }
      iterations += 1.5;
    }, 35);
  });
}
typewriterHover();


// ─── INIT ───
console.log(
  '%c MANUEL VELASCO PORTFOLIO ',
  'background: #c8ff00; color: #09090b; font-family: monospace; font-size: 14px; font-weight: bold; padding: 6px 12px;'
);
console.log(
  '%c Diseñado & desarrollado con ✦ en Bogotá',
  'color: #9896a0; font-family: monospace; font-size: 11px;'
);

// ─── IMAGE LIGHTBOX ───
(function () {
  const lightbox     = document.getElementById('imgLightbox');
  const imgOverlay   = document.getElementById('imgOverlay');
  const closeImg     = document.getElementById('closeImg');
  const imgPrev      = document.getElementById('imgPrev');
  const imgNext      = document.getElementById('imgNext');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lbTitle      = document.getElementById('lightboxTitle');
  const lbTools      = document.getElementById('lightboxTools');
  const lbCounter    = document.getElementById('lightboxCounter');

  if (!lightbox) return;

  // Recopilar todos los items de render en orden
  const items = Array.from(document.querySelectorAll('.render-item[data-index]'));
  let current = 0;

  function openLightbox(index) {
    current = index;
    const item = items[index];
    const img  = item.querySelector('img');

    lightboxImg.style.opacity = '0';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };

    lbTitle.textContent   = item.dataset.title   || '';
    lbTools.textContent   = item.dataset.tools   || '';
    lbCounter.textContent = `${String(index + 1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    current = (current + dir + items.length) % items.length;
    openLightbox(current);
  }

  // Clic en cada item
  items.forEach((item) => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index, 10)));
  });

  imgPrev.addEventListener('click',    () => navigate(-1));
  imgNext.addEventListener('click',    () => navigate(+1));
  closeImg.addEventListener('click',   closeLightbox);
  imgOverlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(+1);
    if (e.key === 'Escape')     closeLightbox();
  });
})();
const videoModal   = document.getElementById('videoModal');
const modalVideo   = document.getElementById('modalVideo');
const closeVideo   = document.getElementById('closeVideo');
const videoOverlay = document.getElementById('videoOverlay');

function openModal(src) {
  modalVideo.src = src;
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // evita scroll mientras el modal está abierto
  modalVideo.load();
  modalVideo.play().catch(() => {}); // catch por autoplay policy en algunos browsers
}

function closeModal() {
  videoModal.classList.remove('active');
  modalVideo.pause();
  modalVideo.src = '';
  document.body.style.overflow = '';
}

// Clic en "Ver proyecto" — solo activa el modal si tiene data-video
document.querySelectorAll('.project-link[data-video]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(link.dataset.video);
  });
});

// Cerrar con botón ✕
closeVideo.addEventListener('click', closeModal);

// Cerrar haciendo clic en el fondo oscuro
videoOverlay.addEventListener('click', closeModal);

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal.classList.contains('active')) {
    closeModal();
  }
});

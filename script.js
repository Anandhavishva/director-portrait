const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(el);
});

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.style.opacity = '1';
  }, { passive: true });
  document.addEventListener('pointerleave', () => glow.style.opacity = '0');
}

document.getElementById('year').textContent = new Date().getFullYear();

// Extra motion: animate the timeline line as it enters the viewport.
const timeline = document.querySelector('.timeline');
if (timeline) {
  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('is-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  timelineObserver.observe(timeline);
}

// Gentle pointer parallax for the hero artwork on desktop.
const hero = document.querySelector('.hero');
const heroOrb = document.querySelector('.hero-orb');
const heroFrames = document.querySelectorAll('.hero-backdrop .frame');
if (hero && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (heroOrb) heroOrb.style.margin = `${y * 12}px 0 0 ${x * 12}px`;
    heroFrames.forEach((frame, index) => {
      const depth = (index + 1) * 8;
      frame.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  hero.addEventListener('pointerleave', () => {
    if (heroOrb) heroOrb.style.margin = '';
    heroFrames.forEach(frame => frame.style.translate = '');
  });
}


// Director's-cut intro: the clapperboard opens first; the visitor chooses ACTION to enter.
const cinemaIntro = document.getElementById('cinemaIntro');
const enterPortfolio = document.getElementById('enterPortfolio');
if (cinemaIntro && enterPortfolio) {
  enterPortfolio.addEventListener('click', () => {
    enterPortfolio.disabled = true;
    enterPortfolio.innerHTML = '<span class="enter-icon">▶</span> ACTION! THE STORY BEGINS <span class="enter-arrow">✦</span>';
    cinemaIntro.classList.add('is-leaving');
    document.body.classList.remove('intro-locked');
    window.setTimeout(() => {
      cinemaIntro.remove();
      document.querySelector('.hero')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, 950);
  });
}

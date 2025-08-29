/* ===== Utilities ===== */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ===== Theme: init from OS or saved, then toggle ===== */
const root = document.documentElement;
const themeMeta = $('#theme-color-meta');
const THEME_KEY = 'preferred-theme';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  // Update header color for mobile browser UI
  if (theme === 'light') {
    themeMeta.setAttribute('content', '#ffffff');
    $('#theme-toggle')?.firstElementChild?.classList.replace('fa-moon', 'fa-sun');
  } else {
    themeMeta.setAttribute('content', '#0e0e0e');
    $('#theme-toggle')?.firstElementChild?.classList.replace('fa-sun', 'fa-moon');
  }
  localStorage.setItem(THEME_KEY, theme);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

$('#theme-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* ===== Mobile Nav Toggle ===== */
const navToggle = $('.nav-toggle');
const navList = $('#primary-nav');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.setAttribute('aria-expanded', String(!expanded));
  });

  // Close menu on link click
  $$('#primary-nav a').forEach(a => a.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navList.setAttribute('aria-expanded', 'false');
  }));
}

/* ===== Smooth Scroll for same-page links ===== */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 2;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== Scroll Reveal ===== */
const revealEls = $$(
  '.section, .stat-card, .skill-card, .project-card, .testimonial-card, .contact-form'
);
revealEls.forEach(el => el.classList.add('reveal'));

function onScrollReveal() {
  const vh = window.innerHeight * 0.88;
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh) el.classList.add('show');
  });
}
window.addEventListener('scroll', onScrollReveal, { passive: true });
window.addEventListener('load', onScrollReveal);

/* ===== 3D Tilt for project cards ===== */
$$('.project-card').forEach(card => {
  let rafId = null;

  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1
    const rotY = (x - 0.5) * 10;  // rotateY
    const rotX = (0.5 - y) * 8;   // rotateX

    // throttle via rAF
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        rafId = null;
      });
    }
  };

  const reset = () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  };

  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', reset);
  card.addEventListener('blur', reset);
});

/* ===== Footer Year ===== */
$('#year').textContent = new Date().getFullYear();

/* ===== Basic (fake) form handling feedback ===== */
$('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Sent ✅';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      e.target.reset();
    }, 1200);
  }, 900);
});


document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const responseBox = document.getElementById("formResponse");

  try {
    const res = await fetch("contact.php", {
      method: "POST",
      body: formData
    });
    const data = await res.json();

    if (data.status === "success") {
      responseBox.textContent = "✅ " + data.message;
      responseBox.style.color = "limegreen";
      form.reset();
    } else {
      responseBox.textContent = "⚠️ " + data.message;
      responseBox.style.color = "orange";
    }
  } catch (err) {
    responseBox.textContent = "❌ An error occurred. Please try again.";
    responseBox.style.color = "red";
  }
});

// DOM Elements
const elements = {
  themeToggle: document.getElementById('themeToggle'),
  header: document.querySelector('header'),
  progressBar: document.createElement('div'),
  cursor: document.createElement('div')
};

// Theme Management
const theme = {
  init() {
    elements.progressBar.className = 'scroll-progress';
    document.body.appendChild(elements.progressBar);
    this.loadTheme();
    this.bindEvents();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  },

  setTheme(mode) {
    document.body.classList.toggle('dark-mode', mode === 'dark');
    localStorage.setItem('theme', mode);
    elements.themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  }
};

// Scroll Management
const scroll = {
  lastScroll: 0,

  update() {
    requestAnimationFrame(() => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / windowHeight) * 100;
      elements.progressBar.style.width = `${progress}%`;
      this.updateHeader();
    });
  },

  updateHeader() {
    const scrolled = window.pageYOffset;
    if (scrolled <= 0) {
      elements.header.classList.remove('scroll-up', 'scroll-down');
    } else if (scrolled > this.lastScroll) {
      elements.header.classList.remove('scroll-up');
      elements.header.classList.add('scroll-down');
    } else {
      elements.header.classList.remove('scroll-down');
      elements.header.classList.add('scroll-up');
    }
    this.lastScroll = scrolled;
  }
};

// Event Bindings
function initEventListeners() {
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    theme.init();
  });

  window.addEventListener('scroll', () => scroll.update());

  elements.themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    theme.setTheme(isDark ? 'light' : 'dark');
  });

  // Smooth scroll
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Initialize
initEventListeners();

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

fadeElements.forEach(element => fadeObserver.observe(element));

// Tambahan: animasi smooth untuk semua section utama
const mainSections = document.querySelectorAll('.section, .hero, .footer');
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.animationPlayState = 'running';
      }
    });
  },
  { threshold: 0.1 }
);

mainSections.forEach(section => {
  section.style.opacity = '0';
  section.style.animationPlayState = 'paused';
  sectionObserver.observe(section);
});

// Initialize AOS (if available)
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });
}

// Blokir klik kanan dan drag & drop pada foto profil
document.addEventListener('DOMContentLoaded', () => {
  const profilePic = document.querySelector('.profile-pic');
  if (profilePic) {
    profilePic.addEventListener('contextmenu', e => e.preventDefault());
    profilePic.addEventListener('dragstart', e => e.preventDefault());
  }
});

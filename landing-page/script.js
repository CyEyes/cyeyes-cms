// ============================================
// LANGUAGE SWITCHING
// ============================================
let currentLang = 'vi';

const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  switchLanguage(currentLang);

  // Update button text
  const langText = langToggle.querySelector('.lang-text');
  langText.textContent = currentLang === 'vi' ? 'EN' : 'VI';
});

function switchLanguage(lang) {
  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update all elements with data-vi and data-en attributes
  const elements = document.querySelectorAll('[data-vi][data-en]');

  elements.forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) {
      // For glitch effect title, update both text content and data-text attribute
      if (element.classList.contains('glitch')) {
        element.querySelector('span').textContent = text;
        element.setAttribute('data-text', text);
      } else {
        element.textContent = text;
      }
    }
  });

  // Add animation effect
  document.body.style.opacity = '0.9';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 150);
}

// ============================================
// ANIMATE ON SCROLL (AOS)
// ============================================
function initAOS() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attribute
  const aosElements = document.querySelectorAll('[data-aos]');
  aosElements.forEach(el => observer.observe(el));
}

// ============================================
// SCROLL INDICATOR FADE
// ============================================
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (!scrollIndicator) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const opacity = Math.max(1 - scrolled / 300, 0);
    scrollIndicator.style.opacity = opacity;
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// QR CARD INTERACTIONS
// ============================================
function initQRCards() {
  const qrCards = document.querySelectorAll('.qr-card');

  qrCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
}

// ============================================
// GLITCH EFFECT ENHANCEMENT
// ============================================
function enhanceGlitchEffect() {
  const glitchElement = document.querySelector('.glitch');

  if (!glitchElement) return;

  setInterval(() => {
    if (Math.random() > 0.95) {
      glitchElement.style.animation = 'none';
      setTimeout(() => {
        glitchElement.style.animation = '';
      }, 50);
    }
  }, 3000);
}

// ============================================
// TYPING EFFECT (Optional alternative to glitch)
// ============================================
function typingEffect(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';

  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for scroll events
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

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger entrance animations
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '0';
    setTimeout(() => {
      hero.style.transition = 'opacity 1s ease';
      hero.style.opacity = '1';
    }, 100);
  }
});

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initAOS();
  initScrollIndicator();
  initQRCards();
  enhanceGlitchEffect();

  // Add smooth transition to body
  document.body.style.transition = 'opacity 0.3s ease';

  // Preload QR code images
  const qrImages = document.querySelectorAll('.qr-code img');
  qrImages.forEach(img => {
    const preloadImg = new Image();
    preloadImg.src = img.src;
  });

  console.log('%c🔒 CyEyes - Coming Soon', 'color: #17a2b8; font-size: 20px; font-weight: bold;');
  console.log('%cAI-Driven: Offensive | Defensive | Intelligence', 'color: #4fc3dc; font-size: 14px;');
});

// ============================================
// EASTER EGG - Konami Code
// ============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join('') === konamiPattern.join('')) {
    activateEasterEgg();
  }
});

function activateEasterEgg() {
  // Add special effect when Konami code is entered
  const hero = document.querySelector('.hero-hexagon');
  if (hero) {
    hero.style.animation = 'rotate 2s linear infinite, float 1s ease-in-out infinite';
    setTimeout(() => {
      hero.style.animation = 'float 4s ease-in-out infinite, rotate 60s linear infinite';
    }, 5000);
  }

  console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'color: #4fc3dc; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #17a2b8;');
}

// ============================================
// RESPONSIVE NAVIGATION
// ============================================
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', debounce(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Enhanced glass header effect on scroll
  if (scrollTop > 50) {
    header.style.background = 'rgba(255, 255, 255, 0.85)';
    header.style.backdropFilter = 'blur(25px)';
    header.style.boxShadow = '0 4px 24px rgba(23, 162, 184, 0.15)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.7)';
    header.style.backdropFilter = 'blur(20px)';
    header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
  }

  lastScrollTop = scrollTop;
}, 10));

// ============================================
// INTERSECTION OBSERVER FOR PERFORMANCE
// ============================================
const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      lazyLoadObserver.unobserve(img);
    }
  });
});

// Observe images for lazy loading (if you add data-src attributes)
document.querySelectorAll('img[data-src]').forEach(img => {
  lazyLoadObserver.observe(img);
});

// ============================================
// CUSTOM CURSOR EFFECT (Optional)
// ============================================
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #17a2b8;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
  });
}

// Uncomment to enable custom cursor
// initCustomCursor();

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});

// ============================================
// VIEWPORT HEIGHT FIX FOR MOBILE
// ============================================
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', debounce(setViewportHeight, 100));
setViewportHeight();

// ============================================
// HEADER TOGGLE (HAMBURGER)
// ============================================
const headerToggle = document.getElementById('headerToggle');
const siteHeader = document.getElementById('site-header');

if (headerToggle && siteHeader) {
  headerToggle.addEventListener('click', () => {
    const isCollapsed = siteHeader.classList.toggle('header--collapsed');
    headerToggle.setAttribute('aria-expanded', (!isCollapsed).toString());

    const icon = headerToggle.querySelector('.hamburger');
    if (icon) {
      // When collapsed -> show hamburger (☰); when expanded -> show close (✕)
      icon.textContent = isCollapsed ? '☰' : '✕';
    }
  });

  // Close header when pressing Escape for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !siteHeader.classList.contains('header--collapsed')) {
      siteHeader.classList.add('header--collapsed');
      headerToggle.setAttribute('aria-expanded', 'false');
      const icon = headerToggle.querySelector('.hamburger');
      if (icon) icon.textContent = '☰';
    }
  });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

// Get API URL from environment or use default
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Đang gửi...</span>';

    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      company: document.getElementById('company').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    // Client-side validation
    if (!formData.name || formData.name.length < 2) {
      showFormStatus('error', 'Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự)');
      resetSubmitButton();
      return;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      showFormStatus('error', 'Vui lòng nhập địa chỉ email hợp lệ');
      resetSubmitButton();
      return;
    }

    if (!formData.subject || formData.subject.length < 5) {
      showFormStatus('error', 'Vui lòng nhập tiêu đề (ít nhất 5 ký tự)');
      resetSubmitButton();
      return;
    }

    if (!formData.message || formData.message.length < 10) {
      showFormStatus('error', 'Vui lòng nhập nội dung tin nhắn (ít nhất 10 ký tự)');
      resetSubmitButton();
      return;
    }

    // Send to API
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showFormStatus('success', 'Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.');
        contactForm.reset();

        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const errorMsg = result.message || 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.';
        showFormStatus('error', errorMsg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showFormStatus('error', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.');
    } finally {
      resetSubmitButton();
    }
  });
}

function showFormStatus(type, message) {
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;
  formStatus.style.display = 'block';

  // Auto-hide success message after 10 seconds
  if (type === 'success') {
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 10000);
  }
}

function resetSubmitButton() {
  submitBtn.disabled = false;
  const currentLang = document.documentElement.lang || 'vi';
  const buttonText = currentLang === 'vi' ? 'Gửi tin nhắn' : 'Send Message';
  submitBtn.innerHTML = `<span data-vi="Gửi tin nhắn" data-en="Send Message">${buttonText}</span>`;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

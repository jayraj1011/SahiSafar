/* ═══════════════════════════════════════════════════════════════════
   CITY YATRA — Main JavaScript
   Features: Loader, Navbar, Booking Form, Slider, Animations, Counter
═══════════════════════════════════════════════════════════════════ */

// ─── API Base URL ────────────────────────────────────────────────────
// In production, this will be the same origin. In dev, backend runs on :3000
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// ─── Loader ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

// ─── Navbar: scroll effect & active link ─────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky effect
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link based on scroll position
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Back to top button
  const backBtn = document.getElementById('backToTop');
  backBtn.classList.toggle('visible', window.scrollY > 400);
});

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Hamburger Menu ───────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close nav when link clicked (also reset hamburger icon)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ─── Set min date on booking form ─────────────────────────────────────
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ─── Booking Form Validation & Submission ─────────────────────────────
const bookingForm = document.getElementById('bookingForm');

function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function validateForm(data) {
  let valid = true;

  // Full Name
  clearError('fullName', 'fullNameError');
  if (!data.fullName || data.fullName.trim().length < 2) {
    showError('fullName', 'fullNameError', 'Please enter your full name (min 2 characters)');
    valid = false;
  }

  // Phone
  clearError('phone', 'phoneError');
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(data.phone)) {
    showError('phone', 'phoneError', 'Enter a valid 10-digit Indian mobile number');
    valid = false;
  }

  // Pickup
  clearError('pickupLocation', 'pickupError');
  if (!data.pickupLocation || data.pickupLocation.trim().length < 2) {
    showError('pickupLocation', 'pickupError', 'Please enter pickup location');
    valid = false;
  }

  // Drop
  clearError('dropLocation', 'dropError');
  if (!data.dropLocation || data.dropLocation.trim().length < 2) {
    showError('dropLocation', 'dropError', 'Please enter drop location');
    valid = false;
  }

  // Date
  clearError('date', 'dateError');
  if (!data.date) {
    showError('date', 'dateError', 'Please select a travel date');
    valid = false;
  } else if (new Date(data.date) < new Date(new Date().toDateString())) {
    showError('date', 'dateError', 'Travel date cannot be in the past');
    valid = false;
  }

  // Vehicle
  clearError('vehicleType', 'vehicleError');
  if (!data.vehicleType) {
    showError('vehicleType', 'vehicleError', 'Please select a vehicle type');
    valid = false;
  }

  return valid;
}

// Clear error on input
['fullName', 'phone', 'pickupLocation', 'dropLocation', 'date', 'vehicleType'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errorEl = document.getElementById(id + 'Error') || document.getElementById(id.replace('Location', '') + 'Error');
      if (errorEl) errorEl.textContent = '';
    });
  }
});

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      fullName:        document.getElementById('fullName').value.trim(),
      phone:           document.getElementById('phone').value.trim(),
      pickupLocation:  document.getElementById('pickupLocation').value.trim(),
      dropLocation:    document.getElementById('dropLocation').value.trim(),
      date:            document.getElementById('date').value,
      vehicleType:     document.getElementById('vehicleType').value,
      tripType:        document.querySelector('input[name="tripType"]:checked').value,
      message:         document.getElementById('message').value.trim(),
    };

    if (!validateForm(formData)) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
      const response = await fetch(`${API_BASE}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Show success
        bookingForm.style.display = 'none';
        const successEl = document.getElementById('bookingSuccess');
        successEl.classList.add('show');
        document.getElementById('bookingIdDisplay').textContent = result.bookingId;

        // Scroll to success
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert(`⚠️ ${result.message || 'Something went wrong. Please try again.'}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('⚠️ Network error. Please check your connection or call us directly at +91 98765 43210.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
}

// Reset booking form
function resetBookingForm() {
  document.getElementById('bookingForm').style.display = 'block';
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingSuccess').classList.remove('show');
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}
window.resetBookingForm = resetBookingForm;

// ─── Testimonial Slider ───────────────────────────────────────────────
const track = document.getElementById('testimonialTrack');
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
let autoSlideTimer;
const cardsPerView = window.innerWidth > 768 ? 3 : 1;
const totalSlides = Math.ceil(cards.length / cardsPerView);

// Create dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(index) {
  const card = cards[0];
  const cardWidth = card.offsetWidth + 24; // gap
  const offset = index * cardsPerView * cardWidth;
  track.style.transform = `translateX(-${offset}px)`;
  currentSlide = index;

  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  const next = (currentSlide + 1) % totalSlides;
  goToSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + totalSlides) % totalSlides;
  goToSlide(prev);
}

document.getElementById('nextBtn').addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});
document.getElementById('prevBtn').addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

function startAutoSlide() {
  autoSlideTimer = setInterval(nextSlide, 4000);
}
function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

startAutoSlide();

// ─── Intersection Observer: Animations ───────────────────────────────
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger each card in a group
      setTimeout(() => {
        entry.target.classList.add('animated');
      }, (Array.from(animateEls).indexOf(entry.target) % 6) * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateEls.forEach(el => observer.observe(el));

// ─── Animated Counter ─────────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString('en-IN');
    if (start >= target) clearInterval(timer);
  }, 16);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-count'));
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

// ─── Smooth scroll for anchor links ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top = target.offsetTop - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Package "Book Now" → scroll to booking form ──────────────────────
document.querySelectorAll('.btn-package').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('booking');
    if (form) {
      const navH = navbar.offsetHeight;
      window.scrollTo({ top: form.offsetTop - navH, behavior: 'smooth' });
    }
  });
});

// ─── Phone number: digits only ────────────────────────────────────────
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').substring(0, 10);
  });
}

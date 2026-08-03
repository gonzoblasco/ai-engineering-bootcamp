// Intersection Observer — reveal sections on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .card').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Smooth scroll for anchor links
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector(ctaButton.getAttribute('href'));
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Contact form handler
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  statusEl.textContent = 'Sending...';
  statusEl.style.color = '#666';

  // Simulate sending (no backend yet)
  await new Promise((r) => setTimeout(r, 1000));

  statusEl.textContent = `Thanks, ${data.name}! I'll get back to you soon.`;
  statusEl.style.color = '#059669';
  form.reset();
});

const loader = document.getElementById('loader');
const content = document.getElementById('content');
const lines = document.querySelector('#terminal-content');
const namePrompt = document.getElementById('name-prompt');
const nameForm = document.getElementById('name-form');
const userNameInput = document.getElementById('user-name-input');

let userName = 'User';

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = userNameInput.value.trim();
  if (name) {
    userName = name;
    localStorage.setItem('portfolioUserName', name);
    hideNamePrompt();
  }
});

async function hideNamePrompt() {
  namePrompt.style.opacity = '0';
  namePrompt.style.transition = 'opacity 0.5s ease';
  await new Promise(resolve => setTimeout(resolve, 500));
  namePrompt.style.display = 'none';
  updateTerminalContent();
  await initMacOSLoader();
  loadPricingPlans();
  await hideLoader();
}

function updateTerminalContent() {
  const terminalTitle = document.querySelector('.terminal-title');
  terminalTitle.textContent = `Terminal — ${userName.toLowerCase()}@macbook`;

  const terminalContent = `Last login: Thu Oct 21 12:00:00 on ttys001
${userName.toLowerCase()}@macbook ~ % sudo systemctl start portfolio
[sudo] password for ${userName.toLowerCase()}: ********

🔄 Initializing system modules...
✅ Core services loaded
🔄 Mounting file systems...
✅ All drives mounted successfully
🔄 Starting network services...
✅ Network connection established
🔄 Loading user interface...
✅ GUI components ready
🔄 Finalizing boot sequence...

⚡ System ready. Welcome back, ${userName}!

> Press any key to continue_`;

  lines.textContent = terminalContent;
}

async function initMacOSLoader() {
  let index = 0;
  const text = lines.textContent;
  lines.textContent = '';

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (index < text.length) {
        lines.textContent += text[index++];
      } else {
        clearInterval(interval);
        setTimeout(() => {
          resolve();
        }, 800);
      }
    }, 30);
  });
}

async function hideLoader() {
  loader.style.opacity = '0';
  loader.style.transition = 'opacity 0.5s ease';
  await new Promise(resolve => setTimeout(resolve, 500));
  loader.style.display = 'none';
  content.style.display = 'block';
  initAnimations();
}

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

document.addEventListener('mousemove', (e) => {
  if (!header) return;

  const rect = header.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (y >= 0 && y <= rect.height) {
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;

    header.style.setProperty('--mouse-x', `${xPercent * 5}deg`);
    header.style.setProperty('--mouse-y', `${yPercent * 3}deg`);
  }
});

const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.style.setProperty('--link-x', `${x}px`);
    this.style.setProperty('--link-y', `${y}px`);
  });

  link.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    this.style.transform = `translateY(-2px) scale(1.05) translate(${deltaX * 3}px, ${deltaY * 2}px)`;
  });

  link.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.portfolio-card, .website-card, .logo-card, .pricing-card, .schedule-card, .stat-card, .skill-category, .cv-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
  });

  document.querySelectorAll('.language-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
    observer.observe(card);
  });

  document.querySelectorAll('.hero, .portfolio-header, .logos-header, .contact, .about-header, .skills-header, .cv-header, .pricing-header, .schedule-header, .about-text, .profile-card').forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - 100)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  const dx = mouseX - glowX;
  const dy = mouseY - glowY;

  glowX += dx * 0.1;
  glowY += dy * 0.1;

  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll('.contact-btn, .portfolio-card-footer a, .social-btn, .pricing-btn, .schedule-btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.transition = 'transform 0.2s ease';
  });

  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0, 0)';
  });
});

async function loadPricingPlans() {
  const pricingGrid = document.querySelector('.pricing-grid');
  const planSelect = document.getElementById('booking-plan');

  const plans = [
    {
      id: '1',
      name: 'Starter',
      price: 50,
      description: 'Perfect for small projects and MVPs',
      features: [
        'Responsive Design',
        '5 Pages',
        'Basic SEO',
        '1 Month Support',
        'Source Code Included'
      ],
      is_popular: false
    },
    {
      id: '2',
      name: 'Professional',
      price: 200,
      description: 'Ideal for growing businesses',
      features: [
        'Everything in Starter',
        '10 Pages',
        'Advanced SEO',
        'CMS Integration',
        '3 Months Support',
        'Analytics Setup'
      ],
      is_popular: true
    },
    {
      id: '3',
      name: 'Enterprise',
      price: 500,
      description: 'Complete solution for large projects',
      features: [
        'Everything in Professional',
        'Unlimited Pages',
        'Custom Features',
        'API Development',
        '6 Months Support',
        'Priority Support'
      ],
      is_popular: false
    }
  ];

  if (pricingGrid) {
    pricingGrid.innerHTML = plans.map(plan => {
      const features = Array.isArray(plan.features) ? plan.features : [];
      const popularBadge = plan.is_popular ? '<div class="popular-badge">Most Popular</div>' : '';

      return `
        <div class="pricing-card ${plan.is_popular ? 'popular' : ''}">
          ${popularBadge}
          <h3>${plan.name}</h3>
          <div class="price">£${plan.price}<span>/project</span></div>
          <p class="pricing-description">${plan.description}</p>
          <ul class="pricing-features">
            ${features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
          <button class="pricing-btn" data-plan-id="${plan.id}" data-plan-name="${plan.name}" data-plan-price="${plan.price}">
            Choose Plan
          </button>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.pricing-btn').forEach(btn => {
      btn.addEventListener('click', handlePricingClick);
    });
  }

  if (planSelect) {
    plans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} - £${plan.price}`;
      planSelect.appendChild(option);
    });
  }
}

function handlePricingClick(e) {
  const planId = e.target.dataset.planId;
  const planName = e.target.dataset.planName;
  const planPrice = e.target.dataset.planPrice;

  const scheduleSection = document.getElementById('schedule');
  if (scheduleSection) {
    scheduleSection.scrollIntoView({ behavior: 'smooth' });

    const planSelect = document.getElementById('booking-plan');
    if (planSelect) {
      planSelect.value = planId;
    }
  }
}

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
      const formData = {
        name: document.getElementById('booking-name').value,
        email: document.getElementById('booking-email').value,
        phone: document.getElementById('booking-phone').value,
        plan: document.getElementById('booking-plan').value || 'Not selected',
        date: document.getElementById('booking-date').value,
        time: document.getElementById('booking-time').value,
        message: document.getElementById('booking-message').value
      };

      console.log('Booking submitted:', formData);

      alert('Thank you for your booking request! We will contact you soon at ' + formData.email);
      bookingForm.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting booking. Please contact us directly at kianprice210@gmail.com');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

const cvDownloadBtn = document.querySelector('.cv-download-btn');
if (cvDownloadBtn) {
  cvDownloadBtn.addEventListener('click', () => {
    alert('CV download feature - Connect your CV file here!\n\nTo add your CV:\n1. Add your CV PDF to the project\n2. Update the button to link to your file');
  });
}

document.querySelectorAll('.logo-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    alert(`Logo Project ${index + 1}\n\nTo add your logo:\n1. Add your logo image to the project\n2. Update the HTML to display your image\n3. Replace the placeholder with: <img src="path/to/your/logo.png" alt="Logo ${index + 1}">`);
  });
});

async function init() {
  const savedName = localStorage.getItem('portfolioUserName');
  if (savedName) {
    userName = savedName;
    namePrompt.style.display = 'none';
    updateTerminalContent();
    await initMacOSLoader();
    loadPricingPlans();
    await hideLoader();
  }
}

init();

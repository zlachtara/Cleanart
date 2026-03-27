/* ===================================================
   CLEANART PRANIE â Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ââ DYNAMIC COPYRIGHT YEAR ââ
  document.querySelectorAll('.copyright-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ââ FORM SPAM PROTECTION SETUP ââ
  if (document.getElementById('formLoadedAt')) {
    document.getElementById('formLoadedAt').value = Date.now();
  }
  if (document.getElementById('siteDomain')) {
    document.getElementById('siteDomain').value = window.location.hostname;
  }
  // Extract session ID from URL if present
  const pathParts = window.location.pathname.split('/');
  const sessionId = pathParts.find(function (part) {
    return /^[a-f0-9-]{36}$/.test(part);
  });
  if (sessionId && document.getElementById('previewSessionId')) {
    document.getElementById('previewSessionId').value = sessionId;
  }

  // ââ NAVBAR â SCROLL EFFECT ââ
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ââ NAVBAR â ACTIVE LINK ON SCROLL ââ
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveNavLink() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveNavLink);

  // ââ MOBILE NAVIGATION TOGGLE ââ
  var navToggle = document.getElementById('navToggle');
  var navLinksMenu = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinksMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    var spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on nav link click
  document.querySelectorAll('.nav-link, .nav-cta').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinksMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      var spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ââ SMOOTH SCROLL FOR ANCHOR LINKS ââ
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navbarHeight = navbar.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ââ FADE-IN ANIMATION ON SCROLL ââ
  var fadeEls = document.querySelectorAll(
    '.service-card, .why-card, .testimonial-card, .gallery-item, .about-content, .about-image'
  );
  fadeEls.forEach(function (el) {
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });

  // ââ CONTACT FORM SUBMISSION ââ
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var formData = new FormData(this);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      var submitButton = this.querySelector('button[type="submit"]');
      var originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> WysyĹanie...';
      formStatus.textContent = '';

      try {
        var hostname = window.location.hostname;
        var apiUrl;
        if (hostname.includes('vibeotter.dev')) {
          apiUrl = 'https://api.vibeotter.dev/api/forms/submit';
        } else if (hostname.includes('vibeotter.com')) {
          apiUrl = 'https://api.vibeotter.com/api/forms/submit';
        } else {
          apiUrl = '/api/forms/submit';
        }

        var response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        var result = await response.json();

        if (result.success) {
          formStatus.innerHTML = '<p style="color: #2e7d32; font-weight: 600; padding: 12px 16px; background: #f1f8f1; border-radius: 8px; margin-top: 8px;"><i class="fa-solid fa-check-circle"></i> WiadomoĹÄ wysĹana! Odezwiemy siÄ najszybciej jak to moĹźliwe.</p>';
          form.reset();
          document.getElementById('formLoadedAt').value = Date.now();
          document.getElementById('siteDomain').value = window.location.hostname;
        } else {
          formStatus.innerHTML = '<p style="color: #c62828; font-weight: 600; padding: 12px 16px; background: #fff3f3; border-radius: 8px; margin-top: 8px;"><i class="fa-solid fa-triangle-exclamation"></i> WystÄpiĹ bĹÄd. SprĂłbuj ponownie lub zadzwoĹ do nas.</p>';
        }
      } catch (error) {
        formStatus.innerHTML = '<p style="color: #c62828; font-weight: 600; padding: 12px 16px; background: #fff3f3; border-radius: 8px; margin-top: 8px;"><i class="fa-solid fa-triangle-exclamation"></i> WystÄpiĹ bĹÄd. SprĂłbuj ponownie lub zadzwoĹ do nas.</p>';
        console.error('Form submission error:', error);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }

  // ââ COUNTER ANIMATION ââ
  function animateCounter(el, target, suffix) {
    var start = 0;
    var duration = 2000;
    var step = target / (duration / 16);
    var current = 0;
    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current) + (suffix || '');
    }, 16);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(function (el) {
          var text = el.textContent.trim();
          if (text.includes('500')) {
            animateCounter(el, 500, '+');
          } else if (text.includes('100')) {
            animateCounter(el, 100, '%');
          } else if (text.includes('5')) {
            el.textContent = '5 lat';
          }
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

});
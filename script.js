/* Responsive interactions + accessible controls */

document.addEventListener('DOMContentLoaded', () => {
  // elements
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('overlay');
  const topbar = document.getElementById('topbar');
  const programsTrack = document.getElementById('programsTrack');
  const progPrev = document.getElementById('prog-prev');
  const progNext = document.getElementById('prog-next');
  const contactForm = document.getElementById('contactForm');
  const resetBtn = document.getElementById('resetBtn');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu open/close
  function openMobileMenu() {
    // build menu dynamically for mobile
    if (!document.querySelector('.mobile-menu')) {
      const menu = document.createElement('div');
      menu.className = 'mobile-menu';
      menu.setAttribute('role', 'menu');
      // clone links
      const links = Array.from(document.querySelectorAll('.side-nav a'));
      links.forEach(a => {
        const item = document.createElement('a');
        item.href = a.href;
        item.textContent = a.textContent;
        item.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector(item.getAttribute('href')).scrollIntoView({behavior:'smooth'});
          closeMobileMenu();
        });
        menu.appendChild(item);
      });
      document.body.appendChild(menu);
    }
    overlay.classList.add('show');
    overlay.style.display = 'block';
    document.querySelector('.mobile-menu').style.transform = 'translateX(0)';
    document.querySelector('.mobile-menu').style.display = 'block';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
      menu.remove();
    }
    overlay.classList.remove('show');
    overlay.style.display = 'none';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (document.querySelector('.mobile-menu')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // close when overlay clicked
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // horizontal programs slider: buttons + touch support
  let scrollAmount = 0;
  const cardWidth = () => {
    const first = programsTrack.querySelector('.program');
    return first ? first.getBoundingClientRect().width + 18 : 340;
  };

  if (progPrev) progPrev.addEventListener('click', () => {
    programsTrack.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });
  if (progNext) progNext.addEventListener('click', () => {
    programsTrack.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  // enable dragging (desktop) and touch fling (mobile)
  (function enableDragScroll(track) {
    let pressed = false, startX, scrollLeft;
    if (!track) return;
    track.addEventListener('pointerdown', (e) => {
      pressed = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!pressed) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX);
      track.scrollLeft = scrollLeft - walk;
    });
    track.addEventListener('pointerup', () => { pressed = false; });
    track.addEventListener('pointerleave', () => { pressed = false; });
  })(programsTrack);

  // smooth scrolling for sidebar links on larger screens
  document.querySelectorAll('.side-nav a, .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // handle same-page scroll
      if (link.hash) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // contact form simple validation + console
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
      if (!name || !email) {
        alert('Please fill name and email.');
        return;
      }
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      console.log('Contact submitted', {
        name, email, program: document.getElementById('programSelect') ? document.getElementById('programSelect').value : '',
      });
      alert('Thanks! We received your message.');
      contactForm.reset();
    });
  }

  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (contactForm) contactForm.reset();
  });

  // utility functions (global)
  window.scrollToPrograms = function() {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
  };
  window.showVideo = function() {
    alert('Video coming soon!');
  };
  window.selectProgram = function(name) {
    alert('You selected: ' + name);
    // preselect program in form if exists
    const sel = document.getElementById('programSelect');
    if (sel) {
      sel.value = name.toLowerCase().replace(/\s+/g,'');
      document.getElementById('contact').scrollIntoView({behavior:'smooth'});
    }
  };
  window.bookTrainer = function(name) {
    alert('Booking: ' + name);
  };

  // keyboard accessibility: close mobile menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

});

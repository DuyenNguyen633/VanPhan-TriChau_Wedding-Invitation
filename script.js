// ── Opening curtain ──────────────────────────────────────────────
document.getElementById('open-btn').addEventListener('click', function () {
  document.body.classList.add('opened');

  setTimeout(function () {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';

    // Reveal cover elements after curtain opens
    document.querySelectorAll(
      '.cover-names, .cover-tag, .cover-event'
    ).forEach(el => el.classList.add('reveal-visible'));

    // Start observing all other elements now that scroll is enabled
    startObserver();
  }, 1500);
});

// ── Scroll Animations ─────────────────────────────────────────────
// Cover elements get reveal class but are triggered manually after curtain
const coverEls = document.querySelectorAll('.cover-names, .cover-tag, .cover-event');
coverEls.forEach(el => el.classList.add('reveal'));

// All other animated elements
const scrollEls = document.querySelectorAll(
  '.quote-text, .couple-card, ' +
  '.invite-script-title, .invite-subtitle, ' +
  '.gallery-item, .event-card, ' +
  '.album-header, .album-cell, ' +
  '.rsvp-tagline, .rsvp-btn'
);
scrollEls.forEach(el => el.classList.add('reveal'));

// Stagger delays
document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.1) + 's';
});
document.querySelectorAll('.couple-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.15) + 's';
});
document.querySelectorAll('.album-cell').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.07) + 's';
});

function startObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  scrollEls.forEach(el => observer.observe(el));
}

// ── Countdown (Vietnam timezone UTC+7) ───────────────────────────
const targets = {
    gai:  new Date('2026-08-06T11:00:00+07:00'),
    trai: new Date('2026-08-07T18:00:00+07:00')
};

function updateCountdown() {
    const now = new Date();
    ['trai', 'gai'].forEach(p => {
        const diff = targets[p] - now;
        const pad = n => String(Math.max(0, n)).padStart(2, '0');
        if (diff <= 0) {
            ['d','h','m','s'].forEach(u => {
                const el = document.getElementById(p + '-' + u);
                if (el) el.textContent = '00';
            });
            return;
        }
        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000)  / 60000);
        const secs  = Math.floor((diff % 60000)    / 1000);
        const d = document.getElementById(p + '-d');
        const h = document.getElementById(p + '-h');
        const m = document.getElementById(p + '-m');
        const s = document.getElementById(p + '-s');
        if (d) d.textContent = pad(days);
        if (h) h.textContent = pad(hours);
        if (m) m.textContent = pad(mins);
        if (s) s.textContent = pad(secs);
    });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── EmailJS Setup ─────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_9dot7tr';
const EMAILJS_PUBLIC_KEY  = '7FLzKGi6t9OxT8e_Z';
const RSVP_TEMPLATE_ID    = 'template_ocpfyhk';
const CONGRAT_TEMPLATE_ID = 'template_lf0vypm';

(function loadEmailJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => { emailjs.init(EMAILJS_PUBLIC_KEY); };
    script.onerror = () => console.error('Failed to load EmailJS SDK');
    document.head.appendChild(script);
})();

// ── Toast ─────────────────────────────────────────────────────────
const toastEl = document.getElementById('toast');
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3500);
}

// ── RSVP Modal ────────────────────────────────────────────────────
document.getElementById('open-rsvp').addEventListener('click', () =>
    document.getElementById('rsvp-modal').classList.add('open'));
document.getElementById('rsvp-close').addEventListener('click', () =>
    document.getElementById('rsvp-modal').classList.remove('open'));
document.getElementById('rsvp-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('rsvp-modal'))
        document.getElementById('rsvp-modal').classList.remove('open');
});

document.getElementById('rsvp-confirm').addEventListener('click', () => {
    const name   = document.getElementById('rsvp-name').value.trim();
    const phone  = document.getElementById('rsvp-phone').value.trim();
    const attend = document.getElementById('rsvp-attend').value;
    const guests = document.getElementById('rsvp-guests').value.trim();
    if (!name || !attend) { showToast('Vui lòng điền đầy đủ thông tin.'); return; }
    const btn = document.getElementById('rsvp-confirm');
    btn.textContent = 'Đang gửi...'; btn.disabled = true;
    const attendLabel = attend === 'yes' ? 'Sẽ tham dự' : attend === 'maybe' ? 'Có thể sẽ đến' : 'Không đến được';
    emailjs.send(EMAILJS_SERVICE_ID, RSVP_TEMPLATE_ID, {
        to_email: 'jay.ly275145@gmail.com', from_name: name,
        phone: phone || 'Không cung cấp', attend: attendLabel,
        guests: guests || '1', event: 'Xác nhận tham dự lễ cưới Trí Châu & Thảo Vân', message: ''
    }).then(() => {
        document.getElementById('rsvp-modal').classList.remove('open');
        btn.textContent = 'Gửi xác nhận'; btn.disabled = false;
        ['rsvp-name','rsvp-phone','rsvp-guests'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('rsvp-attend').value = '';
        const msg = attend === 'yes' ? `Cảm ơn ${name}! Chúng tôi rất vui khi được đón tiếp bạn 🌸`
            : attend === 'maybe' ? `Cảm ơn ${name}! Chúng tôi mong sẽ gặp bạn 💐`
            : `Cảm ơn ${name} đã thông báo 💛`;
        showToast(msg);
    }).catch(() => {
        btn.textContent = 'Gửi xác nhận'; btn.disabled = false;
        showToast('Gửi thất bại. Vui lòng thử lại sau.');
    });
});

// ── Congrat Modal ─────────────────────────────────────────────────
let currentTarget = '';
function openModal(target) {
    currentTarget = target;
    const label = target === 'trai' ? 'Tiệc cưới Nhà Trai – 07/08/2026' : 'Tiệc cưới Nhà Gái – 06/08/2026';
    document.getElementById('congrat-target-label').textContent = label;
    document.getElementById('congrat-modal').classList.add('open');
}
document.getElementById('congrat-close').addEventListener('click', () =>
    document.getElementById('congrat-modal').classList.remove('open'));
document.getElementById('congrat-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('congrat-modal'))
        document.getElementById('congrat-modal').classList.remove('open');
});

document.getElementById('congrat-confirm').addEventListener('click', () => {
    const name = document.getElementById('congrat-name').value.trim();
    const msg  = document.getElementById('congrat-msg').value.trim();
    if (!name) { showToast('Vui lòng nhập họ tên.'); return; }
    const btn = document.getElementById('congrat-confirm');
    btn.textContent = 'Đang gửi...'; btn.disabled = true;
    const eventLabel = currentTarget === 'trai'
        ? 'Tiệc cưới Nhà Trai (07/08/2026 – 18:00)'
        : 'Tiệc cưới Nhà Gái (06/08/2026 – 11:00)';
    emailjs.send(EMAILJS_SERVICE_ID, CONGRAT_TEMPLATE_ID, {
        to_email: 'jay.ly275145@gmail.com', from_name: name,
        event: eventLabel, message: msg || '(Không có lời nhắn)',
    }).then(() => {
        document.getElementById('congrat-modal').classList.remove('open');
        btn.textContent = 'Gửi lời chúc'; btn.disabled = false;
        document.getElementById('congrat-name').value = '';
        document.getElementById('congrat-msg').value  = '';
        showToast(`Cảm ơn ${name}! Lời chúc của bạn đã được gửi 💐`);
    }).catch(() => {
        btn.textContent = 'Gửi lời chúc'; btn.disabled = false;
        showToast('Gửi thất bại. Vui lòng thử lại sau.');
    });
});
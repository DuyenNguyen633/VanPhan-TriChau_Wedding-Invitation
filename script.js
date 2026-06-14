// ── Countdown ────────────────────────────────────────────────────
function updateCountdown() {
  const target = new Date('2026-04-05T18:00:00');
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    ['trai','gai'].forEach(p => {
      ['d','h','m','s'].forEach(u => {
        const el = document.getElementById(p+'-'+u);
        if (el) el.textContent = '00';
      });
    });
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  const pad = n => String(n).padStart(2,'0');

  ['trai','gai'].forEach(p => {
    const d = document.getElementById(p+'-d');
    const h = document.getElementById(p+'-h');
    const m = document.getElementById(p+'-m');
    const s = document.getElementById(p+'-s');
    if (d) d.textContent = pad(days);
    if (h) h.textContent = pad(hours);
    if (m) m.textContent = pad(mins);
    if (s) s.textContent = pad(secs);
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Toast ────────────────────────────────────────────────────────
const toastEl = document.getElementById('toast');
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ── RSVP Modal ───────────────────────────────────────────────────
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
  const attend = document.getElementById('rsvp-attend').value;
  if (!name || !attend) { showToast('Vui lòng điền đầy đủ thông tin.'); return; }
  document.getElementById('rsvp-modal').classList.remove('open');
  const msg = attend === 'yes' ? `Cảm ơn ${name}! Chúng tôi rất vui khi được đón tiếp bạn 🌸`
            : attend === 'maybe' ? `Cảm ơn ${name}! Chúng tôi mong sẽ gặp bạn 💐`
            : `Cảm ơn ${name} đã thông báo 💛`;
  showToast(msg);
});

// ── Congrat Modal ────────────────────────────────────────────────
let currentTarget = '';
function openModal(target) {
  currentTarget = target;
  const label = target === 'trai' ? 'Tiệc cưới Nhà Trai' : 'Tiệc cưới Nhà Gái';
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
  document.getElementById('congrat-modal').classList.remove('open');
  showToast(`Cảm ơn ${name}! Lời chúc của bạn đã được gửi 💐`);
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.main-header');
  const sidebar = document.querySelector('.sidebar');
  if (!header || !sidebar) return;

  const btn = document.createElement('button');
  btn.className = 'sidebar-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Mở menu');
  btn.innerHTML = '☰';
  header.insertBefore(btn, header.firstChild);

  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const open = () => {
    document.body.classList.add('is-sidebar-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    document.body.classList.remove('is-sidebar-open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('is-sidebar-open')) close();
    else open();
  });

  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  const mq = window.matchMedia('(min-width: 769px)');
  const handle = () => {
    if (mq.matches) close();
  };
  if (mq.addEventListener) mq.addEventListener('change', handle);
  else mq.addListener(handle);
});
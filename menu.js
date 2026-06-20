/* Shared menu — used by every page.
   Scales the fixed chrome (RIO logo + Menu/Close toggle) and the slide-in panel
   to the viewport, and wires the Menu <-> Close toggle.
   Only geometry is set here; per-page look (dark-mode invert, hover colour,
   entry animation) stays in each page's own CSS. */
(function () {
  const panel = document.getElementById('menuPanel');
  const toggle = document.getElementById('menuToggle');
  const logo = document.getElementById('rioLogo');
  const inner = document.getElementById('mpInner');
  if (!panel || !toggle) return;

  // toggle/logo scale by width (match the 1920 design), panel by height so all items fit
  function scaleMenu() {
    const sw = window.innerWidth / 1920;
    toggle.style.right = (36 * sw) + 'px';
    toggle.style.top = (55 * sw) + 'px';
    toggle.style.fontSize = (64 * sw) + 'px';
    if (logo) {
      logo.style.left = (36 * sw) + 'px';
      logo.style.top = (30 * sw) + 'px';
      logo.style.width = (121 * sw) + 'px';
      logo.style.height = (76 * sw) + 'px';
    }
    const sh = window.innerHeight / 1080;
    panel.style.width = (582 * sh) + 'px';
    if (inner) inner.style.transform = 'scale(' + sh + ')';
  }
  window.addEventListener('resize', scaleMenu);
  scaleMenu();

  // Menu <-> Close: same element morphs, panel slides in/out.
  // On close, .closing holds the full text at 0 so it slides OUT intact (no crop),
  // then resets after the panel has exited.
  let open = false;
  function setMenu(o) {
    open = o;
    if (o) {
      panel.classList.remove('closing');
      panel.classList.add('open');
      toggle.textContent = 'Close';
    } else {
      panel.classList.add('closing');
      panel.classList.remove('open');
      toggle.textContent = 'Menu';
      setTimeout(() => { if (!open) panel.classList.remove('closing'); }, 650);
    }
  }
  toggle.addEventListener('click', () => setMenu(!open));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
})();

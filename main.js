/* ================================================================
   FINNVISOR — main.js  (v3 — all fixes applied)
   1. Theme toggle — works on ALL elements via CSS variables
   2. Blog system — reads blogs.js, sorts newest first, auto-renders
   3. Blog auto-scroll highlight (no nav button needed)
   4. WhatsApp + Email side popup
   5. GST Calculator
   6. Entity Finder
   7. Tabs, modal, toast, back-to-top, scroll animations
================================================================ */

/* ══════════════════════════════════════════════
   1. THEME — apply before paint to avoid flash
══════════════════════════════════════════════ */
(function () {
  const saved = localStorage.getItem('fv-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fv-theme', next);
  // update toggle icons
  document.querySelectorAll('.icon-sun').forEach(el => el.style.display = next === 'dark' ? 'none' : 'block');
  document.querySelectorAll('.icon-moon').forEach(el => el.style.display = next === 'dark' ? 'block' : 'none');
}

/* ══════════════════════════════════════════════
   2. BLOG SYSTEM — reads BLOGS[], renders cards
══════════════════════════════════════════════ */
function renderBlogs(filterCat = 'all') {
  const container = document.getElementById('blogContainer');
  if (!container || typeof BLOGS === 'undefined') return;

  // Sort newest first by date
  const sorted = [...BLOGS].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = filterCat === 'all' ? sorted : sorted.filter(b => b.category === filterCat);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:60px 0;color:var(--text-muted);grid-column:1/-1;">
      <div style="font-size:48px;margin-bottom:16px;">📭</div>
      <p>Is category mein abhi koi blog nahi hai. Jaldi aayega!</p>
    </div>`;
    return;
  }

  // First 2 = featured (big), rest = grid-3
  const featured = filtered.slice(0, 2);
  const rest     = filtered.slice(2);

  let html = '';

  // Featured row
  if (featured.length) {
    html += `<div class="blog-featured-row" id="blogFeaturedRow">`;
    featured.forEach(b => { html += blogCardHTML(b, true); });
    html += `</div>`;
  }

  // Rest in grid-3, 3 visible, then hidden
  if (rest.length) {
    const visible = rest.slice(0, 3);
    const hidden  = rest.slice(3);

    html += `<div class="blog-grid-3" id="blogGrid3">`;
    visible.forEach(b => { html += blogCardHTML(b, false); });
    html += `</div>`;

    if (hidden.length) {
      html += `<div class="blog-grid-3 blog-hidden" id="blogMoreRow" style="margin-top:20px;">`;
      hidden.forEach(b => { html += blogCardHTML(b, false); });
      html += `</div>`;
      html += `<div class="load-more-wrap">
        <button class="btn-load-more" id="blogLoadMore" onclick="loadMoreBlogs()">
          Load More Articles ↓
        </button>
      </div>`;
    }
  }

  container.innerHTML = html;

  // Re-observe new fade-up elements
  initFadeUp();
}

function blogCardHTML(b, isBig) {
  const dateObj = new Date(b.date);
  const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[b.category]) || b.category;
  const bigClass = isBig ? ' big' : '';
  const thumbClass = isBig ? 'blog-thumb big' : 'blog-thumb';

  return `
  <div class="blog-card fade-up" data-cat="${b.category}" data-id="${b.id}">
    <div class="${thumbClass}" style="background:${b.thumbBg};">
      ${b.emoji}
      <div class="blog-thumb-overlay"></div>
      <span class="blog-cat-badge">${catLabel}</span>
    </div>
    <div class="blog-body">
      <div class="blog-meta">
        <span class="blog-date">${dateStr}</span>
        <span class="blog-read">${b.readTime} read</span>
      </div>
      <h3>${b.title}</h3>
      <p>${b.excerpt}</p>
      <div class="blog-footer-row">
        <div class="blog-author-wrap">
          <div class="b-avatar" style="background:${b.authorColor};">${b.authorInitials}</div>
          <span class="b-author-name">${b.author}</span>
        </div>
        <a href="#" class="link-gold" onclick="return false;">Read ${isBig ? 'Article' : ''} →</a>
      </div>
    </div>
  </div>`;
}

function loadMoreBlogs() {
  document.querySelectorAll('.blog-hidden').forEach(el => el.classList.remove('blog-hidden'));
  const btn = document.getElementById('blogLoadMore');
  if (btn) btn.closest('.load-more-wrap').style.display = 'none';
  initFadeUp();
}

/* ── Blog filter tabs ── */
function initBlogFilter() {
  document.querySelectorAll('.blog-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.blog-tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBlogs(btn.dataset.cat);
    });
  });
}

/* ── Blog section auto-highlight in nav on scroll ── */
function initBlogScrollSpy() {
  const blogSection = document.getElementById('blogs');
  if (!blogSection) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const indicator = document.getElementById('blogScrollIndicator');
      if (indicator) {
        indicator.style.opacity = e.isIntersecting ? '1' : '0';
        indicator.style.transform = e.isIntersecting ? 'translateY(0)' : 'translateY(-8px)';
      }
    });
  }, { threshold: 0.1 });
  observer.observe(blogSection);
}

/* ══════════════════════════════════════════════
   3. WHATSAPP + EMAIL SIDE POPUP
══════════════════════════════════════════════ */
function initContactSideBar() {
  // These values will come from config at top of page, or defaults
  const WA_NUMBER = window.FV_CONFIG?.whatsapp || '919910792221';
  const EMAIL     = window.FV_CONFIG?.email     || 'office@finnvisor.com';
  const WA_MSG    = encodeURIComponent('Hello Finnvisor! I need assistance with corporate compliance services.');

  const bar = document.createElement('div');
  bar.id = 'contactSideBar';
  bar.innerHTML = `
    <div class="csb-label">Contact Us</div>
    <a class="csb-btn csb-wa"
       href="https://wa.me/${WA_NUMBER}?text=${WA_MSG}"
       target="_blank" rel="noopener"
       title="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.123 1.523 5.854L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.012-1.374l-.36-.213-3.76.895.955-3.668-.234-.376A9.787 9.787 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
      </svg>
      <span>WhatsApp</span>
    </a>
    <a class="csb-btn csb-email"
       href="mailto:${EMAIL}?subject=Corporate Advisory Inquiry&body=Hello Finnvisor Team,%0D%0A%0D%0AI would like to enquire about your services.%0D%0A%0D%0AName:%0D%0ACompany:%0D%0ARequirement:%0D%0A%0D%0ARegards"
       title="Send Email">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
      <span>Email Us</span>
    </a>
  `;
  document.body.appendChild(bar);
}

/* ══════════════════════════════════════════════
   4. GST CALCULATOR
══════════════════════════════════════════════ */
function calcGST() {
  const amt  = parseFloat(document.getElementById('gstAmt')?.value)  || 0;
  const rate = parseFloat(document.getElementById('gstRate')?.value) || 18;
  const tax  = amt * rate / 100;
  const tot  = amt + tax;
  const fmt  = n => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('gstBase',  fmt(amt));
  setEl('gstTax',   fmt(tax));
  setEl('gstTotal', fmt(tot));
}

/* ══════════════════════════════════════════════
   5. ENTITY FINDER
══════════════════════════════════════════════ */
const _sel = {};
const _rivals = { founder:'cofounders', cofounders:'founder', investors:'selfFunded', selfFunded:'investors' };

function pickEntity(el, key) {
  const rivalEl = document.querySelector(`[data-key="${_rivals[key]}"]`);
  if (rivalEl) { rivalEl.classList.remove('selected'); delete _sel[_rivals[key]]; }
  el.classList.toggle('selected');
  el.classList.contains('selected') ? (_sel[key] = true) : delete _sel[key];
  const has = k => !!_sel[k];
  const r = document.getElementById('entityResult');
  const t = document.getElementById('entityType');
  if (!r || !t) return;
  const map = [
    [has('founder') && has('investors'),    'One Person Company (OPC) → grow into Pvt Ltd'],
    [has('cofounders') && has('investors'),  'Private Limited Company (Pvt Ltd)'],
    [has('founder') && has('selfFunded'),    'One Person Company (OPC) or Sole Proprietorship'],
    [has('cofounders') && has('selfFunded'), 'LLP (Limited Liability Partnership)'],
  ];
  const match = map.find(([cond]) => cond);
  if (match) { r.style.display = 'block'; t.textContent = match[1]; }
  else        { r.style.display = 'none'; }
}

/* ══════════════════════════════════════════════
   6. TABS
══════════════════════════════════════════════ */
function initTabs() {
  document.querySelectorAll('.tab-row').forEach(row => {
    row.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

/* ══════════════════════════════════════════════
   7. ENQUIRY MODAL
══════════════════════════════════════════════ */
function openModal()  { document.getElementById('enquiryModal')?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { document.getElementById('enquiryModal')?.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('click', e => { if (e.target.id === 'enquiryModal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ══════════════════════════════════════════════
   8. FORM SUBMIT
══════════════════════════════════════════════ */
function handleSubmit() {
  const inputs = document.querySelectorAll('.form-card .form-control');
  let ok = true;
  inputs.forEach(inp => {
    if (inp.hasAttribute('required') && !inp.value.trim()) { inp.style.borderColor = '#e03434'; ok = false; }
    else inp.style.borderColor = '';
  });
  if (!ok) { showToast('⚠️ Please fill in all required fields.'); return; }
  inputs.forEach(inp => { inp.value = ''; inp.style.borderColor = ''; });
  showToast('✅ Inquiry submitted! We will contact you within 4 hours.');
}

function handleModalSubmit() {
  const inputs = document.querySelectorAll('#enquiryModal .form-control');
  let ok = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) { inp.style.borderColor = '#e03434'; ok = false; }
    else inp.style.borderColor = '';
  });
  if (!ok) { showToast('⚠️ Please fill all fields.'); return; }
  inputs.forEach(inp => { inp.value = ''; inp.style.borderColor = ''; });
  closeModal();
  showToast('✅ Enquiry sent! Our team will reach out shortly.');
}

/* ══════════════════════════════════════════════
   9. TOAST
══════════════════════════════════════════════ */
function showToast(msg) {
  let t = document.getElementById('fv-toast');
  if (!t) { t = document.createElement('div'); t.id = 'fv-toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

/* ══════════════════════════════════════════════
   10. BACK TO TOP
══════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.querySelector('.back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════════
   11. SCROLL FADE-UP ANIMATIONS
══════════════════════════════════════════════ */
function initFadeUp() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════
   12. SMOOTH SCROLL (sticky nav offset)
══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════
   13. ENQUIRY TOOLTIP PULSE
══════════════════════════════════════════════ */
function initEnquiryTooltip() {
  const tip = document.getElementById('enqTooltip');
  if (!tip) return;
  setTimeout(() => tip.classList.add('show'), 3000);
  setTimeout(() => tip.classList.remove('show'), 8000);
}

/* ══════════════════════════════════════════════
   14. THEME ICON SYNC on load
══════════════════════════════════════════════ */
function syncThemeIcons() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.icon-sun').forEach(el => el.style.display = dark ? 'none' : 'block');
  document.querySelectorAll('.icon-moon').forEach(el => el.style.display = dark ? 'block' : 'none');
}

/* ══════════════════════════════════════════════
   MOBILE NAV
══════════════════════════════════════════════ */
function openMobileNav() {
  document.getElementById('mobileNavPanel')?.classList.add('open');
  document.getElementById('mobileNavOverlay')?.classList.add('open');
  document.getElementById('hamburgerBtn')?.classList.add('open');
  document.body.classList.add('nav-open');
}
function closeMobileNav() {
  document.getElementById('mobileNavPanel')?.classList.remove('open');
  document.getElementById('mobileNavOverlay')?.classList.remove('open');
  document.getElementById('hamburgerBtn')?.classList.remove('open');
  document.body.classList.remove('nav-open');
}
// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

/* ══════════════════════════════════════════════
   INIT ALL
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  syncThemeIcons();
  calcGST();
  initTabs();
  initBlogFilter();
  renderBlogs('all');       // render blogs from blogs.js
  initBlogScrollSpy();
  initBackToTop();
  initFadeUp();
  initSmoothScroll();
  initEnquiryTooltip();
  initContactSideBar();     // WhatsApp + Email sidebar
});

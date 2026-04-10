/* ============================================================
   afrocue.js — shared script for all AfroCue pages
   Drop in root folder alongside index.html, pregame.html etc.
   Set SCRIPT_URL below once you deploy the GAS web app.
   ============================================================ */

var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOOi81xzk2kIfLLVg72LbqKclI509psGN-PATPu5Rg3kvnKEcUGT7aj-xc2cM6nIuI/exec';
window.AFROCUE_SCRIPT_URL = SCRIPT_URL;


/* ── UTILITY ─────────────────────────────────────────────── */

function submitToGAS(data) {
  if (SCRIPT_URL === 'YOUR_GAS_SCRIPT_URL_HERE') {
    console.warn('AfroCue: SCRIPT_URL not set. Data not sent:', data);
    return Promise.resolve();
  }
  /* NOTE: mode 'no-cors' is required for GAS web apps — the response will always
     be opaque (status 0). This means we cannot distinguish success from failure.
     The .finally() block will always fire. This is expected behaviour. */
  return fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}


/* ── INDEX: CONTENT SLIDER ───────────────────────────────── */

(function() {
  var slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  var cur = 0;
  var contentBg = document.getElementById('contentBg');

  function updateBg(i) {
    if (!contentBg) return;
    var img = slides[i].dataset.img;
    if (!img) return;
    contentBg.style.backgroundImage = "url('" + img + "')";
    contentBg.classList.remove('loaded');
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        contentBg.classList.add('loaded');
      });
    });
  }

  window.goTo = function(n) {
    slides[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    updateBg(cur);
    clearInterval(window._slideTimer);
    window._slideTimer = setInterval(function() { window.goTo(cur + 1); }, 5000);
  };

  window.nextSlide = function() { window.goTo(cur + 1); };
  window.prevSlide = function() { window.goTo(cur - 1); };

  window._slideTimer = setInterval(function() { window.goTo(cur + 1); }, 5000);
  updateBg(0);
})();


/* ── INDEX: SIGNUP MODAL ─────────────────────────────────── */

(function() {
  var modal = document.getElementById('signupModal');
  if (!modal) return;

  window.openSignupModal = function() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeSignupModal = function() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', function(e) {
    if (e.target === modal) window.closeSignupModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closeSignupModal();
  });

  window.handleSignup = function(e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Signing up...';
    btn.disabled = true;

    var data = {
      source:     'index_media',
      name:       (form.su_name  ? form.su_name.value.trim()  : ''),
      email:      (form.su_email ? form.su_email.value.trim() : ''),
      role:       (form.su_role  ? form.su_role.value         : ''),
      instagram:  (form.su_ig    ? form.su_ig.value.replace('@','').trim() : ''),
      newsletter: 'Yes'
    };

    submitToGAS(data).finally(function() {
      form.style.display = 'none';
      var success = document.getElementById('signupSuccess');
      if (success) success.style.display = 'block';
    });
  };
})();


/* ── INDEX: NEWSLETTER ───────────────────────────────────── */

window.handleNewsletter = function(e) {
  e.preventDefault();
  var form = e.target;
  var data = {
    source:     'index_newsletter',
    name:       form.nl_name  ? form.nl_name.value.trim()  : '',
    email:      form.nl_email ? form.nl_email.value.trim() : '',
    newsletter: 'Yes'
  };
  submitToGAS(data).finally(function() {
    form.innerHTML = "<p style='color:var(--yellow);font-size:16px;font-weight:500;margin-top:8px;'>You are in. We will be in touch.</p>";
  });
};


/* ── PREGAME: FORM HELPERS ───────────────────────────────── */

(function() {
  /* area "Other" field toggle — pregame only */
  var areaSelect = document.getElementById('areaSelect');
  if (areaSelect) {
    areaSelect.addEventListener('change', function() {
      var otherField = document.getElementById('otherAreaField');
      if (otherField) otherField.style.display = this.value === 'Other' ? 'flex' : 'none';
    });
  }

  /* toggleBtn — generic yes/no toggle.
     DJ page redefines this after load so its version takes precedence there. */
  window.toggleBtn = function(btn, fieldId, value) {
    btn.parentElement.querySelectorAll('.toggle-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    var field = document.getElementById(fieldId);
    if (field) field.value = value;
  };

  /* party type pills — pregame only */
  window.togglePill = function(el) {
    el.classList.toggle('selected');
    var selected = Array.from(document.querySelectorAll('#partyTypePills .pill-opt.selected'))
      .map(function(p) { return p.textContent; });
    var val = document.getElementById('partyTypesVal');
    if (val) val.value = selected.join(', ');
  };

  /* newsletter checkbox — pregame only */
  var newsletterChecked = true;
  window.toggleNewsletter = function(label) {
    newsletterChecked = !newsletterChecked;
    var box = document.getElementById('checkBox');
    if (box) box.classList.toggle('checked', newsletterChecked);
    var input = label.querySelector('input');
    if (input) input.checked = newsletterChecked;
  };

  /* pregame form submit */
  window.handleSubmit = function(e) {
    e.preventDefault();
    var form = e.target;
    var btn  = document.getElementById('submitBtn');

    if (!form.name.value.trim() || !form.email.value.trim()) {
      alert('Please fill in your name and email.');
      return;
    }

    btn.textContent = 'Submitting...';
    btn.disabled    = true;

    var area = form.area && form.area.value === 'Other'
      ? (form.area_other ? form.area_other.value : 'Other')
      : (form.area ? form.area.value : '');

    var data = {
      source:      'pregame',
      name:        form.name.value.trim(),
      email:       form.email.value.trim(),
      phone:       form.phone     ? form.phone.value.trim()     : '',
      instagram:   form.instagram ? ('@' + form.instagram.value.replace('@','').trim()) : '',
      party_types: (document.getElementById('partyTypesVal') || {value: ''}).value,
      area:        area,
      plusone:     (form.plusone  ? form.plusone.value : '') || 'Not answered',
      newsletter:  newsletterChecked ? 'Yes' : 'No'
    };

    submitToGAS(data).finally(function() {
      btn.textContent = 'Submit';
      btn.disabled    = false;
      var overlay = document.getElementById('successOverlay');
      if (overlay) {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  };
})();


/* ── DJ RADAR VIDEO CONTROLS ─────────────────────────────── */

(function() {
  var vid     = document.getElementById('djRadarVid');
  var playBtn = document.getElementById('djPlayBtn');
  var muteBtn = document.getElementById('djMuteBtn');
  if (!vid) return;

  vid.pause();
  vid.muted = true;

  window.toggleDJPlay = function() {
    if (vid.paused) {
      vid.play();
      if (playBtn) playBtn.innerHTML = '&#9646;&#9646;';
    } else {
      vid.pause();
      if (playBtn) playBtn.innerHTML = '&#9654;';
    }
  };

  window.toggleDJMute = function() {
    vid.muted = !vid.muted;
    if (muteBtn) muteBtn.innerHTML = vid.muted ? '&#128264;' : '&#128266;';
  };
})();


/* ── VIDEO FALLBACK (about section) ─────────────────────── */

(function() {
  var vid = document.querySelector('.about-video-wrap video');
  if (!vid) return;
  vid.addEventListener('error', function() {
    vid.style.display = 'none';
    var fb = document.getElementById('videoFallback');
    if (fb) fb.style.display = 'flex';
  });
})();

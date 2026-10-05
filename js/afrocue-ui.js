/* ============================================================================
   afrocue-ui.js  —  shared nav + footer for all AfroCue pages
   v2: every CSS variable and class is prefixed .ac- / --ac- so it cannot
       collide with the tokens already defined inside each page's <style>.

   USAGE:
     <div id="ac-nav"></div>            <- top of <body>
     <div id="ac-footer"></div>         <- end of <body>
     <script src="js/afrocue-ui.js" data-nav="full"></script>

   data-nav:     full | minimal | none      (default full)
   data-footer:  full | slim  | none        (default full)
   data-base:    path prefix if the page sits in a subfolder, e.g. "../"
   ========================================================================== */
(function () {
  'use strict';

  /* ==========================================================================
     CONFIG — the only block you edit. Every page updates at once.
     ========================================================================== */
  var CFG = {
    home: 'index.html',
    logo: 'logo_afrocue.png',
    email: 'hello@afrocue.xyz',

    nav: [
      { label: 'Home',    href: 'index.html'   },
      { label: 'Parties', href: 'parties.html' },
      { label: 'DJs',     href: 'dj.html'      },
      { label: 'Culture', href: 'blog.html'    }
    ],

    cta: { label: 'List Your Party', href: 'list-party.html' },

    /* shown in the mobile menu and footer only */
    navExtra: [
      { label: 'Set Club',  href: 'set-club.html' },
      { label: 'Advertise', href: 'ads.html'      }
    ],

    footer: [
      {
        title: 'Explore',
        links: [
          { label: 'Home',    href: 'index.html'   },
          { label: 'Parties', href: 'parties.html' },
          { label: 'Culture', href: 'blog.html'    },
          { label: 'DJs',     href: 'dj.html'      }
        ]
      },
      {
        title: 'Take part',
        links: [
          { label: 'List your party', href: 'list-party.html' },
          { label: 'DJ Radar',        href: 'dj.html'         },
          { label: 'Set Club',        href: 'set-club.html'   },
          { label: 'Advertise',       href: 'ads.html'        }
        ]
      }
    ],

    socials: [
      { label: 'Instagram', href: 'https://instagram.com/afro.cue' },
      { label: 'X',         href: 'https://twitter.com/afrocue_'   },
      { label: 'TikTok',    href: 'https://tiktok.com/@afro.cue'   },
      { label: 'YouTube',   href: 'https://youtube.com/@AfroCue'   }
    ],

    whatsapp: 'https://whatsapp.com/channel/0029Vb74IjxGufJ0irS1uq0u',
    tagline: 'Creatively documenting culture.'
  };

  /* ==========================================================================
     Script tag options
     ========================================================================== */
  var me = document.currentScript ||
    (function () { var s = document.getElementsByTagName('script'); return s[s.length - 1]; })();
  var NAV_MODE  = (me && me.getAttribute('data-nav'))    || 'full';
  var FOOT_MODE = (me && me.getAttribute('data-footer')) || 'full';
  var BASE      = (me && me.getAttribute('data-base'))   || '';

  function url(h) {
    if (!h) return '#';
    if (/^(https?:|mailto:|tel:|#|\/)/i.test(h)) return h;
    return BASE + h;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function currentFile() {
    var p = location.pathname.split('/').pop();
    return (!p || p === '') ? 'index.html' : p;
  }
  function isActive(href) {
    var f = currentFile();
    if (href === 'index.html') return f === 'index.html';
    return href === f;
  }

  /* ==========================================================================
     Fonts + helpers. Injected at the top of <head> so page CSS still wins.
     ========================================================================== */
  var BASECSS = [
    "@font-face{font-family:'Aesthet Nova';src:url('" + BASE + "fonnts.com-Aesthet-Nova-Black.otf') format('opentype');font-weight:900;font-display:swap}",
    "@font-face{font-family:'Aesthet Nova';src:url('" + BASE + "fonnts.com-Aesthet-Nova-Medium.otf') format('opentype');font-weight:500;font-display:swap}",
    "@font-face{font-family:'Aesthet Nova';src:url('" + BASE + "fonnts.com-Aesthet-Nova-.otf') format('opentype');font-weight:400;font-display:swap}",
    /* chrome-only variables, all prefixed so no page token is touched */
    ":root{",
    "--ac-bg:rgba(11,10,9,0.78);--ac-bg-solid:rgba(11,10,9,0.96);--ac-panel:#0b0a09;--ac-panel-2:#0f0e0c;",
    "--ac-ink:#f0ede8;--ac-ink-dim:#a3a3a3;--ac-ink-mute:#7a756d;",
    "--ac-yellow:#C8E000;--ac-wa:#25D366;",
    "--ac-line:rgba(255,255,255,0.08);--ac-line-hi:rgba(255,255,255,0.2);",
    "--ac-pad:max(20px, calc((100vw - 1200px) / 2));--ac-nav-h:76px;",
    "--ac-display:'Aesthet Nova',sans-serif;--ac-sans:'Figtree',sans-serif;",
    "}",
    "@media(min-width:769px){:root{--ac-pad:max(48px, calc((100vw - 1200px) / 2))}}",
    /* optional helpers any page can use */
    ".ac-yh{font-family:var(--ac-display);font-weight:900;color:var(--ac-yellow);line-height:0.92}",
    ".ac-texture{position:absolute;inset:0;background-image:url('" + BASE + "texture.jpg');background-size:cover;background-position:center;opacity:0.14;pointer-events:none;z-index:1}",
    ".ac-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}"
  ].join('');

  /* ==========================================================================
     Chrome CSS. No bare tag selectors, so page nav/footer rules never apply.
     ========================================================================== */
  var CHROME = [
    /* NAV */
    ".ac-nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px var(--ac-pad);background:var(--ac-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--ac-line);transition:background 0.3s}",
    ".ac-nav.is-solid{background:var(--ac-bg-solid)}",
    ".ac-nav a{text-decoration:none}",
    ".ac-logo{display:flex;align-items:center;flex-shrink:0}",
    ".ac-logo img{height:44px;width:auto;display:block}",
    ".ac-logo .fb{display:none;font-family:var(--ac-display);font-weight:900;font-size:17px;color:var(--ac-yellow);letter-spacing:0.08em}",
    ".ac-links{display:flex;gap:28px;list-style:none;margin:0;padding:0}",
    ".ac-links a{font-family:var(--ac-sans);font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--ac-ink-dim);padding:6px 0;border-bottom:2px solid transparent;transition:color 0.2s,border-color 0.2s}",
    ".ac-links a:hover{color:var(--ac-ink)}",
    ".ac-links a.is-active{color:var(--ac-ink);border-bottom-color:var(--ac-yellow)}",
    ".ac-right{display:flex;align-items:center;gap:12px}",
    ".ac-cta{font-family:var(--ac-sans);font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0a0a0a;background:var(--ac-ink);padding:11px 18px;border-radius:2px;white-space:nowrap;transition:background 0.2s}",
    ".ac-cta:hover{background:#d4d4d0}",
    ".ac-back{font-family:var(--ac-sans);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ac-ink-dim);white-space:nowrap}",
    ".ac-back:hover{color:var(--ac-ink)}",
    ".ac-burger{display:none;width:44px;height:44px;flex-direction:column;align-items:center;justify-content:center;gap:5px;background:transparent;border:1px solid var(--ac-line-hi);border-radius:2px;cursor:pointer;padding:0}",
    ".ac-burger span{display:block;width:18px;height:2px;background:var(--ac-ink);transition:transform 0.22s,opacity 0.22s}",
    ".ac-burger[aria-expanded='true'] span:nth-child(1){transform:translateY(7px) rotate(45deg)}",
    ".ac-burger[aria-expanded='true'] span:nth-child(2){opacity:0}",
    ".ac-burger[aria-expanded='true'] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}",
    /* MOBILE MENU */
    ".ac-mm{display:none;position:fixed;inset:0;z-index:999;background:var(--ac-panel);padding:calc(var(--ac-nav-h) + 24px) var(--ac-pad) 40px;overflow-y:auto}",
    ".ac-mm.open{display:flex;flex-direction:column}",
    ".ac-mm a{text-decoration:none}",
    ".ac-mm .mm-link{font-family:var(--ac-display);font-weight:900;font-size:clamp(30px,9vw,44px);line-height:1.25;color:var(--ac-ink);padding:10px 0;border-bottom:1px solid var(--ac-line)}",
    ".ac-mm .mm-link.is-active{color:var(--ac-yellow)}",
    ".ac-mm .mm-cta{margin-top:26px;font-family:var(--ac-sans);font-size:13px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;text-align:center;color:#0a0a0a;background:var(--ac-yellow);padding:17px;border-radius:2px}",
    ".ac-mm .mm-foot{margin-top:24px;display:flex;flex-wrap:wrap;gap:14px}",
    ".ac-mm .mm-foot a{font-family:var(--ac-sans);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ac-ink-dim)}",
    /* FOOTER */
    ".ac-footer{background:var(--ac-panel);border-top:1px solid var(--ac-line);padding:56px var(--ac-pad) 28px;color:var(--ac-ink)}",
    ".ac-footer a{text-decoration:none;color:inherit}",
    ".ac-f-top{display:grid;grid-template-columns:1.3fr repeat(2,1fr) 1.1fr;gap:40px;padding-bottom:36px;border-bottom:1px solid var(--ac-line)}",
    ".ac-f-logo{display:block;margin-bottom:14px}",
    ".ac-f-logo img{height:56px;width:auto}",
    ".ac-f-logo .fb{display:none;font-family:var(--ac-display);font-weight:900;font-size:26px;color:var(--ac-yellow)}",
    ".ac-f-brand p{font-family:var(--ac-sans);font-size:13px;line-height:1.6;color:var(--ac-ink-mute);max-width:260px}",
    ".ac-f-col h4{font-family:var(--ac-sans);font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:var(--ac-ink-dim);margin:0 0 14px}",
    ".ac-f-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}",
    ".ac-f-col a{font-family:var(--ac-sans);font-size:14px;color:rgba(240,237,232,0.78);transition:color 0.2s}",
    ".ac-f-col a:hover{color:var(--ac-yellow)}",
    ".ac-f-wa{display:inline-flex;align-items:center;gap:9px;background:var(--ac-wa);color:#0a0a0a;font-family:var(--ac-sans);font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;padding:13px 18px;border-radius:2px;transition:opacity 0.2s}",
    ".ac-f-wa:hover{opacity:0.88}",
    ".ac-f-mail{display:block;margin-top:14px;font-family:var(--ac-sans);font-size:14px;color:rgba(240,237,232,0.78)}",
    ".ac-f-mail:hover{color:var(--ac-yellow)}",
    ".ac-f-bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:20px}",
    ".ac-f-bottom .copy{font-family:var(--ac-sans);font-size:12px;color:var(--ac-ink-mute)}",
    ".ac-f-social{display:flex;gap:16px;flex-wrap:wrap}",
    ".ac-f-social a{font-family:var(--ac-sans);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ac-ink-dim);transition:color 0.2s}",
    ".ac-f-social a:hover{color:var(--ac-ink)}",
    ".ac-footer.slim{padding:20px var(--ac-pad)}",
    ".ac-footer.slim .ac-f-top{display:none}",
    ".ac-footer.slim .ac-f-bottom{padding-top:0}",
    /* RESPONSIVE */
    "@media(max-width:860px){.ac-f-top{grid-template-columns:1fr 1fr;gap:32px}.ac-f-brand{grid-column:1 / -1}}",
    "@media(max-width:768px){",
    ".ac-links{display:none}",
    ".ac-right .ac-cta{display:none}",
    ".ac-burger{display:flex}",
    ".ac-logo img{height:38px}",
    ".ac-footer{padding:40px var(--ac-pad) 24px}",
    ".ac-f-top{grid-template-columns:1fr;gap:28px}",
    ".ac-f-bottom{flex-direction:column;align-items:flex-start;gap:12px}",
    "}",
    "@media(prefers-reduced-motion:reduce){.ac-nav *,.ac-footer *,.ac-mm *{animation:none !important;transition:none !important}}"
  ].join('');

  function injectCSS(id, css, first) {
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    var head = document.head || document.getElementsByTagName('head')[0];
    if (first && head.firstChild) head.insertBefore(s, head.firstChild);
    else head.appendChild(s);
  }
  function ensureFigtree() {
    if (document.querySelector('link[href*="Figtree"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap';
    (document.head || document.documentElement).appendChild(l);
  }

  /* ==========================================================================
     Markup
     ========================================================================== */
  function logoHtml(cls, fallbackText) {
    return '<a class="' + cls + '" href="' + esc(url(CFG.home)) + '" aria-label="AfroCue home">'
      + '<img src="' + esc(url(CFG.logo)) + '" alt="AfroCue" '
      + 'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"/>'
      + '<span class="fb">' + esc(fallbackText || 'afro.cue') + '</span></a>';
  }
  function navHtml() {
    if (NAV_MODE === 'minimal') {
      return logoHtml('ac-logo')
        + '<a class="ac-back" href="' + esc(url(CFG.home)) + '">Back to AfroCue</a>';
    }
    var links = CFG.nav.map(function (l) {
      return '<li><a href="' + esc(url(l.href)) + '"'
        + (isActive(l.href) ? ' class="is-active" aria-current="page"' : '') + '>'
        + esc(l.label) + '</a></li>';
    }).join('');
    return logoHtml('ac-logo')
      + '<ul class="ac-links">' + links + '</ul>'
      + '<div class="ac-right">'
      +   '<a class="ac-cta" href="' + esc(url(CFG.cta.href)) + '">' + esc(CFG.cta.label) + '</a>'
      +   '<button class="ac-burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="ac-mm">'
      +     '<span></span><span></span><span></span></button>'
      + '</div>';
  }
  function mobileMenuHtml() {
    var all = CFG.nav.concat(CFG.navExtra || []);
    var links = all.map(function (l) {
      return '<a class="mm-link' + (isActive(l.href) ? ' is-active' : '') + '" href="' + esc(url(l.href)) + '">'
        + esc(l.label) + '</a>';
    }).join('');
    var foot = (CFG.socials || []).map(function (s) {
      return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>';
    }).join('');
    return links
      + '<a class="mm-cta" href="' + esc(url(CFG.cta.href)) + '">' + esc(CFG.cta.label) + '</a>'
      + '<div class="mm-foot">' + foot + '</div>';
  }
  function footerHtml() {
    var cols = (CFG.footer || []).map(function (c) {
      return '<div class="ac-f-col"><h4>' + esc(c.title) + '</h4><ul>'
        + c.links.map(function (l) {
            return '<li><a href="' + esc(url(l.href)) + '">' + esc(l.label) + '</a></li>';
          }).join('')
        + '</ul></div>';
    }).join('');

    var top = '<div class="ac-f-top">'
      + '<div class="ac-f-brand">' + logoHtml('ac-f-logo', 'AfroCue')
      +   '<p>' + esc(CFG.tagline) + '</p></div>'
      + cols
      + '<div class="ac-f-col"><h4>Stay close</h4>'
      +   '<a class="ac-f-wa" href="' + esc(CFG.whatsapp) + '" target="_blank" rel="noopener">WhatsApp channel</a>'
      +   '<a class="ac-f-mail" href="mailto:' + esc(CFG.email) + '">' + esc(CFG.email) + '</a>'
      + '</div></div>';

    var social = (CFG.socials || []).map(function (s) {
      return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>';
    }).join('');

    var bottom = '<div class="ac-f-bottom">'
      + '<div class="copy">&copy; ' + new Date().getFullYear() + ' AfroCue. Lagos, Nigeria.</div>'
      + '<div class="ac-f-social">' + social + '</div></div>';

    return (FOOT_MODE === 'slim' ? '' : top) + bottom;
  }

  /* ==========================================================================
     Mount
     ========================================================================== */
  function mount() {
    injectCSS('ac-base', BASECSS, true);
    injectCSS('ac-chrome', CHROME, false);
    ensureFigtree();

    if (NAV_MODE !== 'none') {
      var host = document.getElementById('ac-nav');
      if (!host) {
        host = document.createElement('div');
        host.id = 'ac-nav';
        document.body.insertBefore(host, document.body.firstChild);
      }
      host.className = 'ac-nav';
      host.setAttribute('role', 'navigation');
      host.innerHTML = navHtml();

      if (NAV_MODE === 'full') {
        var mm = document.createElement('div');
        mm.className = 'ac-mm';
        mm.id = 'ac-mm';
        mm.innerHTML = mobileMenuHtml();
        host.parentNode.insertBefore(mm, host.nextSibling);

        var burger = host.querySelector('.ac-burger');
        var setMenu = function (open) {
          mm.classList.toggle('open', open);
          burger.setAttribute('aria-expanded', open ? 'true' : 'false');
          document.body.style.overflow = open ? 'hidden' : '';
        };
        burger.addEventListener('click', function () {
          setMenu(!mm.classList.contains('open'));
        });
        mm.addEventListener('click', function (e) {
          if (e.target.tagName === 'A') setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && mm.classList.contains('open')) { setMenu(false); burger.focus(); }
        });
        window.addEventListener('resize', function () {
          if (window.innerWidth > 768 && mm.classList.contains('open')) setMenu(false);
        });
      }

      var onScroll = function () { host.classList.toggle('is-solid', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (FOOT_MODE !== 'none') {
      var fhost = document.getElementById('ac-footer');
      if (!fhost) {
        fhost = document.createElement('div');
        fhost.id = 'ac-footer';
        document.body.appendChild(fhost);
      }
      fhost.className = 'ac-footer' + (FOOT_MODE === 'slim' ? ' slim' : '');
      fhost.setAttribute('role', 'contentinfo');
      fhost.innerHTML = footerHtml();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.AfroCueUI = { config: CFG, mount: mount };
})();

// Animated Tenant Transparency logo for the static article pages.
// Mirrors src/components/Logo.jsx (same artwork, fonts, letter-drop
// animation). Usage: <div class="tt-logo" data-tt-logo></div> with the icon
// and the two text lines already in the markup, so the logo still reads
// correctly without JavaScript; this script replaces the plain text with the
// animated letters and injects the shared styles once.
(function () {
  var TITLE = 'TENANT TRANSPARENCY';
  var TAGLINE = 'Know Before You Lease';

  var css = [
    '.tt-logo{display:flex;flex-direction:column;align-items:center;aspect-ratio:2.68/1;}',
    '.tt-logo-icon-wrap{width:100%;}',
    '.tt-logo-icon-wrap img{width:100%;display:block;}',
    '.tt-logo-text-band{margin-top:0.3cqw;container-type:inline-size;container-name:tt-logo-band;width:71.0898%;margin-left:0;}',
    ".tt-logo-title{display:flex;flex-wrap:nowrap;white-space:nowrap;justify-content:center;font-family:'Cinzel','Times New Roman',serif;font-weight:800;font-size:clamp(6px,7.0cqw,46px);letter-spacing:0.01em;line-height:1;color:#122a8c;}",
    ".tt-logo-tagline{display:flex;flex-wrap:nowrap;white-space:nowrap;justify-content:center;font-family:'EB Garamond',Georgia,serif;font-style:italic;font-weight:600;font-size:clamp(7px,8.5cqw,40px);line-height:1.3;margin-top:0;letter-spacing:0.01em;color:#122a8c;}",
    '.tt-logo-letter{display:inline-block;background:linear-gradient(to bottom,#050b2e 0%,#122a8c 38%,#3f5fc4 48%,#122a8c 58%,#050b2e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:0.4px rgba(5,11,46,0.45);filter:drop-shadow(0 2px 1px rgba(0,0,0,0.4));opacity:0;transform:translateY(-180px) rotate(-10deg);animation-name:tt-logo-fall;animation-duration:1.05s;animation-timing-function:cubic-bezier(.34,1.4,.64,1);animation-fill-mode:forwards;}',
    '.tt-logo-space{display:inline-block;width:0.32em;}',
    '@keyframes tt-logo-fall{0%{opacity:0;transform:translateY(-180px) rotate(-10deg) scale(1);}55%{opacity:1;transform:translateY(9px) rotate(2deg) scale(1.08);}75%{transform:translateY(-4px) rotate(-1deg) scale(0.98);}100%{opacity:1;transform:translateY(0) rotate(0deg) scale(1);}}',
    '@media (prefers-reduced-motion:reduce){.tt-logo-letter{animation-duration:0.01s;animation-delay:0s !important;}}'
  ].join('\n');

  function addFonts() {
    if (document.querySelector('link[data-tt-logo-fonts]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.setAttribute('data-tt-logo-fonts', '');
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@800&family=EB+Garamond:ital,wght@1,600&display=swap';
    document.head.appendChild(l);
  }

  function letters(container, text, baseDelay, stagger) {
    container.textContent = '';
    var i = 0;
    for (var k = 0; k < text.length; k++) {
      var ch = text.charAt(k);
      if (ch === ' ') {
        var sp = document.createElement('span');
        sp.className = 'tt-logo-space';
        container.appendChild(sp);
        continue;
      }
      var s = document.createElement('span');
      s.className = 'tt-logo-letter';
      s.textContent = ch;
      s.style.animationDelay = (baseDelay + i * stagger) + 's';
      container.appendChild(s);
      i++;
    }
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    addFonts();
    var logos = document.querySelectorAll('[data-tt-logo]');
    for (var n = 0; n < logos.length; n++) {
      var t = logos[n].querySelector('.tt-logo-title');
      var g = logos[n].querySelector('.tt-logo-tagline');
      if (t) letters(t, TITLE, 0.25, 0.09);
      if (g) letters(g, TAGLINE, 2.9, 0.07);
    }
  }

  init();
})();

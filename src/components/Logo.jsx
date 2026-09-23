import { useEffect, useRef } from 'react';
import iconSrc from '../assets/tt-logo-icon.png';

const TITLE_TEXT = 'TENANT TRANSPARENCY';
const TAGLINE_TEXT = 'Know Before You Lease';

// The icon artwork doesn't fill its whole image canvas edge-to-edge — these
// are the actual left edge / width of the visible house+key shape within the
// image, as a percentage, so the text lines up under it instead of spilling
// past either end.
const BAND_LEFT_PCT = 13.7695;
const BAND_WIDTH_PCT = 71.0898;

function buildLetters(container, text, baseDelay, stagger) {
  container.innerHTML = '';
  let letterIndex = 0;
  for (const ch of text) {
    if (ch === ' ') {
      const space = document.createElement('span');
      space.className = 'tt-logo-space';
      container.appendChild(space);
      continue;
    }
    const span = document.createElement('span');
    span.className = 'tt-logo-letter';
    span.textContent = ch;
    span.style.animationDelay = `${baseDelay + letterIndex * stagger}s`;
    container.appendChild(span);
    letterIndex++;
  }
}

// Animated Tenant Transparency logo: the house/key icon is a static image,
// and the two lines of text below it fall into place letter-by-letter once
// on mount, then stay put (no looping, no replay control).
export default function Logo({ className = '' }) {
  const titleRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) buildLetters(titleRef.current, TITLE_TEXT, 0.25, 0.09);
    if (taglineRef.current) buildLetters(taglineRef.current, TAGLINE_TEXT, 2.9, 0.07);
  }, []);

  return (
    <div className={`tt-logo ${className}`}>
      <div className="tt-logo-icon-wrap">
        <img src={iconSrc} alt="Tenant Transparency" />
      </div>
      <div
        className="tt-logo-text-band"
        style={{ width: `${BAND_WIDTH_PCT}%`, marginLeft: `${BAND_LEFT_PCT}%` }}
      >
        <div className="tt-logo-title" ref={titleRef} />
        <div className="tt-logo-tagline" ref={taglineRef} />
      </div>

      <style>{`
        .tt-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          aspect-ratio: 2.68 / 1;
        }

        .tt-logo-icon-wrap { width: 100%; }
        .tt-logo-icon-wrap img { width: 100%; display: block; }

        .tt-logo-text-band {
          margin-top: 0.3cqw;
          container-type: inline-size;
          container-name: tt-logo-band;
        }

        .tt-logo-title {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          font-family: 'Cinzel', 'Times New Roman', serif;
          font-weight: 800;
          font-size: clamp(9px, 7.0cqw, 46px);
          letter-spacing: 0.01em;
          line-height: 1;
        }

        .tt-logo-tagline {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          font-family: 'EB Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(6px, 4.3cqw, 28px);
          margin-top: 0.5em;
          letter-spacing: 0.01em;
        }

        .tt-logo-letter {
          display: inline-block;
          background: linear-gradient(to bottom,
            #050b2e 0%, #122a8c 38%, #3f5fc4 48%, #122a8c 58%, #050b2e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 0.4px rgba(5, 11, 46, 0.45);
          filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.4));
          opacity: 0;
          transform: translateY(-180px) rotate(-10deg);
          animation-name: tt-logo-fall;
          animation-duration: 1.05s;
          animation-timing-function: cubic-bezier(.34, 1.4, .64, 1);
          animation-fill-mode: forwards;
        }

        .tt-logo-space { display: inline-block; width: 0.32em; }

        @keyframes tt-logo-fall {
          0% { opacity: 0; transform: translateY(-180px) rotate(-10deg) scale(1); }
          55% { opacity: 1; transform: translateY(9px) rotate(2deg) scale(1.08); }
          75% { transform: translateY(-4px) rotate(-1deg) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
}

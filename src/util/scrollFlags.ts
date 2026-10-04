/**
 * Drive nav / attribution CSS via html data attributes.
 * Idempotent: safe to call on load and after view-transition swaps.
 */
const FLAG = "__starfunnelScrollFlags";

type ScrollFlagsState = {
  prevPos: number;
  isScrollingUp: boolean;
  ticking: boolean;
};

declare global {
  interface Window {
    [FLAG]?: ScrollFlagsState;
  }
}

function flip(attr: string, state: boolean) {
  document.documentElement.setAttribute(attr, String(state));
}

function update(state: ScrollFlagsState) {
  const pos = window.scrollY;
  const delta = pos - state.prevPos;

  if (Math.abs(delta) > 8) {
    state.isScrollingUp = delta < 0;
  }

  flip("data-is-scrolling-up", state.isScrollingUp);
  flip(
    "data-is-bottom",
    pos + window.innerHeight > document.body.offsetHeight - 100,
  );
  flip("data-is-top", pos < 100);
  state.prevPos = pos;
}

export function initScrollFlags() {
  let state = window[FLAG];

  if (!state) {
    state = {
      prevPos: window.scrollY,
      isScrollingUp: true,
      ticking: false,
    };
    window[FLAG] = state;

    window.addEventListener(
      "scroll",
      () => {
        const s = window[FLAG];
        if (!s || s.ticking) return;
        s.ticking = true;
        requestAnimationFrame(() => {
          update(s);
          s.ticking = false;
        });
      },
      { passive: true },
    );
  }

  state.prevPos = window.scrollY;
  state.isScrollingUp = true;
  flip("data-is-top", window.scrollY < 100);
  flip("data-is-bottom", false);
  flip("data-is-scrolling-up", true);
}

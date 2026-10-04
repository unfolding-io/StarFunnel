import { showDialog, showPopup } from "@src/store";

const FLAG = "__starfunnelModalLinks";

declare global {
  interface Window {
    [FLAG]?: boolean;
  }
}

/**
 * Open dialogs / popups from #hash links immediately.
 * Must not wait on the Init Vue island (client:interaction).
 */
export function bindModalLinks() {
  if (window[FLAG]) return;
  window[FLAG] = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href^='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const hash = anchor.getAttribute("href")?.slice(1);
      if (!hash) return;

      if (hash === "sign-in") {
        event.preventDefault();
        showDialog.set({
          show: true,
          type: "auth",
          link: "auth",
          auth: "sign_in",
        });
        return;
      }

      if (hash === "sign-up") {
        event.preventDefault();
        showDialog.set({
          show: true,
          type: "auth",
          link: "auth",
          auth: "sign_up",
        });
        return;
      }

      const dialogEl = document.querySelector(`[data-dialog="${CSS.escape(hash)}"]`);
      if (dialogEl instanceof HTMLElement) {
        event.preventDefault();
        showDialog.set({
          show: true,
          link: dialogEl.dataset.dialog ?? null,
          type: dialogEl.dataset.type ?? null,
        });
        return;
      }

      const popupEl = document.querySelector(`[data-popup="${CSS.escape(hash)}"]`);
      if (popupEl instanceof HTMLElement) {
        event.preventDefault();
        showPopup.set({
          show: true,
          type: hash,
        });
      }
    },
    true,
  );
}

import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

export type VideoState = {
  id: string | null;
  show: boolean;
};

export type PopupState = {
  type: string | null;
  show: boolean;
};

export type DialogState = {
  type: string | null;
  link?: string | null;
  show: boolean;
  auth?: string | null;
  slug?: string | null;
};

export const showVideo = atom<VideoState>({
  id: null,
  show: false,
});

export const showPopup = atom<PopupState>({
  type: null,
  show: false,
});

export const showDialog = atom<DialogState>({
  type: null,
  link: null,
  show: false,
});

export const showFaq = atom<string | null>(null);

/** popupId → expiry timestamp (ms). Survives reloads for 24h. */
const seenPopups = persistentAtom<Record<string, number>>(
  "starfunnel:seen-popups",
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

const POPUP_TTL_MS = 24 * 60 * 60 * 1000;

export function canAutoShowPopup(id: string | null | undefined) {
  if (!id) return false;
  const expiry = seenPopups.get()?.[id];
  return !(typeof expiry === "number" && expiry > Date.now());
}

export function markPopupSeen(id: string | null | undefined) {
  if (!id) return;
  const now = Date.now();
  const next = { ...seenPopups.get() };

  for (const key of Object.keys(next)) {
    if (typeof next[key] !== "number" || next[key] <= now) {
      delete next[key];
    }
  }

  next[id] = now + POPUP_TTL_MS;
  seenPopups.set(next);
}

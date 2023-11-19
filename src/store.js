import { atom } from "nanostores";

export const showVideo = atom({
  id: null,
  show: false,
});

export const showPopup = atom({
  type: null,
  show: false,
});

export const showDialog = atom({
  type: null,
  link: null,
  show: false,
});

export const showFaq = atom(null);

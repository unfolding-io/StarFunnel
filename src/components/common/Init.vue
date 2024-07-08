<template>
  <div class="hide hidden"></div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import { showPopup, showDialog } from "@src/store";
const { width } = useWindowSize();
const shown = ref(false);

onMounted(() => {
  const root = document.documentElement;
  const html = document.getElementsByTagName("html")[0];
  const start = new Date().getTime();

  /* GET TIME TO LOAD PAGE */
  window.onload = function () {
    const end = new Date().getTime();
    const timeTaken = end - start;
    document.documentElement.setAttribute(
      "data-speed",
      Math.round(timeTaken / 1000),
    );
  };
  /* CHECK IF IS IOS DEVICE */
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    document.documentElement.setAttribute("data-ios", 1);
  }
  /* SET SCROLL BEHAVIOR (PAGE VIEW ANIMATIONS + SMOOTH SCROLL IS NOT WORKING ) */
  setTimeout(() => {
    html.style["scroll-behavior"] = "smooth";
  }, 500);

  /* SCROLL OBSERVER FOR PAGE */
  let prevPos = 0;
  let isScrollingUp = false;

  function flip(attr, state) {
    root.setAttribute(attr, String(state));
  }

  const scrollHandler = useDebounceFn(() => {
    const pos = window.scrollY;
    const delta = pos - prevPos;
    const scrollDirection = Math.sign(delta) === -1;
    const isBottom =
      pos + window.innerHeight > document.body.offsetHeight - 100;
    const isTop = pos < 100;

    if (delta < -15 || delta > 15) {
      isScrollingUp = scrollDirection;
    }

    flip("data-is-scrolling-up", isScrollingUp);
    flip("data-is-bottom", isBottom);
    flip("data-is-top", isTop);

    prevPos = pos;
  }, 20);

  window.addEventListener("scroll", () => scrollHandler(), { passive: true });
  /* PARALLAX ANIMATIONS */
  const parallaxReveal = document.querySelectorAll(".parallax-wrap");
  if (!document.documentElement.dataset.ios) {
    parallaxReveal.forEach((el) => {
      const items = el.querySelectorAll(".parallax");

      items.forEach((img) =>
        img.animate(
          {
            transform: ["none", "translateY(50%)"],
          },
          {
            fill: "both",
            timeline: new ViewTimeline({ subject: el }),
            rangeStart: { rangeName: "exit", offset: CSS.percent(5) },
            rangeEnd: { rangeName: "exit", offset: CSS.percent(100) },
          },
        ),
      );
    });
  }

  /* LOGIN FORM */
  const loginButtons = document.querySelectorAll("[href='#sign-in']");
  loginButtons.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showDialog.set({
        show: true,
        type: "auth",
        link: "auth",
        auth: "sign_in",
      });
    });
  });

  /* SIGN UP FORM */
  const registrationButtons = document.querySelectorAll("[href='#sign-up']");
  registrationButtons.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showDialog.set({
        show: true,
        type: "auth",
        link: "auth",
        auth: "sign_up",
      });
    });
  });

  /* NEWSLETTERS */
  /* const newsletterForms = document.querySelectorAll("[data-newsletter]");

  newsletterForms.forEach((el) => {
    const link = el.dataset.newsletter;
    const newsletterButtons = document.querySelectorAll(`[href='#${link}']`);

    newsletterButtons.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        showDialog.set({
          show: true,
          slug: link,
          type: "newsletter",
        });
      });
    });
  }); */

  /* DIALOGS */

  const dialogs = document.querySelectorAll("[data-dialog]");

  dialogs.forEach((el) => {
    const link = el.dataset.dialog;
    const type = el.dataset.type;
    const buttons = document.querySelectorAll(`[href='#${link}']`);

    buttons.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();

        showDialog.set({
          show: true,
          link: link,
          type: type,
        });
      });
    });
  });

  /* POPUPS */

  const popups = document.querySelectorAll("[data-popup]");
  popups.forEach((el) => {
    const link = el.dataset.popup;
    const popupButtons = document.querySelectorAll(`[href='#${link}']`);

    popupButtons.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        showPopup.set({
          show: true,
          type: link,
        });
      });
    });
  });
});

/* CREDITS, PLEASE LEAVE THIS IN PLACE */
watch(width, (val) => {
  if (!shown.value) {
    console.log(
      "%c ♻️🔋+ 🧠👷🏽+ 🗜 = 🚀🍃🌐" +
        "\n%cThis site has a low carbon footprint " +
        "\n%c🪙CREDITS:" +
        "\n%cTheme based on StarFunnel 🌌" +
        "\n%cby: https://unfolding.io",
      "font-family:Verdana; font-size: 20px; color: #2A4D47; font-weight:bold; padding: 5px 0; opacity: 0.5; ",
      "font-family:Verdana; font-size: 25px; color: #2A4D47; font-weight:bold; padding: 5px 0; ",
      "font-family:Verdana; font-size:16px; color: #2A4D47; font-weight:bold;  padding: 5px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
    );
    shown.value = true;
  }
});
</script>

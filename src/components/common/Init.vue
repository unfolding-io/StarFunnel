<template>
  <div class="hide hidden"></div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();
const shown = ref(false);

onMounted(() => {
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

  // Dialog / popup / auth hash links are bound in bindModalLinks (BaseLayout).
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

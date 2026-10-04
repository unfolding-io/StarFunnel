<template>
  <div
    class="video-inline z-0 transition-transform duration-[1.5s] group-hover:scale-110"
  >
    <slot />

    <video
      ref="video"
      class="lazy noise pointer-events-none left-0 top-0 z-20 block h-full w-full"
      autoplay
      muted
      loop
      playsinline
      preload="none"
      width="610"
      height="254"
    >
      <source :data-src="url" type="video/mp4" />
    </video>
  </div>
</template>
<script type="module">
import { ref, onMounted, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";

export default {
  props: {
    url: {
      type: String,
    },
    delay: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  setup(props) {
    const video = ref(null);
    const videoLoaded = ref(false);
    const isVisible = useElementVisibility(video);

    onMounted(() => {
      if (document.documentElement.dataset.speed > 2) return;
      for (var source in video.value.children) {
        var videoSource = video.value.children[source];
        if (
          typeof videoSource.tagName === "string" &&
          videoSource.tagName === "SOURCE"
        ) {
          videoSource.src = videoSource.dataset.src;
        }
      }
      if (props.delay) {
        setTimeout(() => {
          video.value.load();
          video.value.classList.remove("lazy");
          videoLoaded.value = true;
        }, 1500);
      } else {
        video.value.load();
        video.value.classList.remove("lazy");
        videoLoaded.value = true;
      }
    });

    watch(
      isVisible,

      (val) => {
        if (!val) {
          if (videoLoaded.value) {
            video.value.pause();
          }
        } else {
          if (videoLoaded.value) {
            video.value.play();
          }
        }
      },
      { immediate: true },
    );

    return { video, isVisible };
  },
};
</script>

<style>
/* Plain CSS — Vue SFC @apply was not reliably emitting position rules in TW4 */
.video-inline {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  text-align: center;
}

.video-inline :deep(picture),
.video-inline :deep(img),
.video-inline video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-inline video {
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 2;
  pointer-events: none;
}

.video-inline video.lazy {
  opacity: 0;
}

.video-inline :deep(.hero-funnel__play),
.video-inline :deep(.absolute.inset-0) {
  position: absolute !important;
  inset: 0 !important;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

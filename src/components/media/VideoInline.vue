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
      preload="true"
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

<style lang="postcss">
.video-inline {
  @apply relative grid h-full w-full grid-cols-1 grid-rows-1 content-center items-center justify-center overflow-hidden rounded text-center;

  picture,
  video {
    @apply absolute -inset-px col-start-1 row-start-1;
  }
  @screen md {
  }

  video {
    opacity: 1;
    object-fit: cover;
    transition: opacity 0.3s ease;
    &.lazy {
      opacity: 0;
    }
  }
}
</style>

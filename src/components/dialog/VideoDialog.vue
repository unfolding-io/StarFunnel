<template>
  <Transition name="fade">
    <div
      v-show="$show.show && $show.id === video_id"
      class="video-dialog"
      @click="pauseVideo()"
    >
      <div @click.stop class="video-dialog__panel">
        <div class="video-dialog__frame">
          <div
            class="video-dialog__player"
            ref="container"
            :data-plyr-provider="embed"
            :data-plyr-embed-id="video_id"
          ></div>
        </div>

        <button
          type="button"
          class="video-dialog__close"
          aria-label="Close"
          @click="pauseVideo()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 6 6 18M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import { useStore } from "@nanostores/vue";
import { showVideo } from "@src/store";
import "plyr/dist/plyr.css";

const $show = useStore(showVideo);

const props = defineProps({
  video_id: {
    type: String,
  },
  embed: {
    type: String,
  },
});

const container = ref(null);
const videoPlayer = ref(null);
let PlyrCtor;

const pauseVideo = () => {
  showVideo.set({
    id: $show.value.id,
    show: false,
  });
  if (videoPlayer.value) videoPlayer.value.pause();
  document.body.style.overflow = "";
};

const playVideo = async () => {
  await nextTick();
  if (!container.value) return;
  if (!PlyrCtor) {
    // Separate client chunk — avoids SSR `document` access and stale Vite dep hashes
    PlyrCtor = (await import("@src/lib/loadPlyr")).default;
  }
  if (!videoPlayer.value) {
    videoPlayer.value = new PlyrCtor(container.value, {
      playsinline: 0,
      autoplay: true,
      settings: ["loop"],
      iconUrl: "/icons/plyr.svg",
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "airplay",
        "fullscreen",
      ],
      youtube: {
        origin: window.location.origin,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        noCookie: true,
      },
    });

    videoPlayer.value.on("ready", () => {
      videoPlayer.value?.play();
    });
  } else {
    videoPlayer.value.play();
  }
};

watch(
  $show,
  async (val) => {
    if (val.show && val.id === props.video_id) {
      document.body.style.overflow = "hidden";
      await playVideo();
    }
    if (!val.show && val.id === props.video_id) {
      document.body.style.overflow = "";
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  videoPlayer.value?.destroy?.();
  videoPlayer.value = null;
});
</script>

<style>
.video-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  width: 100%;
  place-items: center;
  cursor: pointer;
  pointer-events: auto;
  background-color: color-mix(
    in srgb,
    var(--palette-dark, #191c26) 40%,
    transparent
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1.5rem;
}

.video-dialog__panel {
  position: relative;
  width: min(100% - 2rem, 55rem);
  cursor: default;
}

.video-dialog__frame {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.45);
  background: #000;
  aspect-ratio: 16 / 9;
}

.video-dialog__player,
.video-dialog__player .plyr,
.video-dialog__player .plyr__video-wrapper,
.video-dialog__player iframe {
  width: 100%;
  height: 100%;
}

.video-dialog__player {
  width: 100%;
  height: 100%;
}

.video-dialog__close {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  z-index: 10;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 0;
  cursor: pointer;
  color: #fff;
  background: var(--palette-dark, #191c26);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

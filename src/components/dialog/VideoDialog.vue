<template>
  <Transition name="fade">
    <div
      v-show="$show.show && $show.id === video_id"
      class="bg-dark-blur z-1000 pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click="pauseVideo()"
    >
      <div @click.stop class="container-md relative">
        <div class="overflow-hidden rounded shadow-xl">
          <div
            class="w-full"
            ref="container"
            :data-plyr-provider="embed"
            :data-plyr-embed-id="video_id"
          ></div>
        </div>

        <button
          class="btn btn-icon surface-dark btn-absolute -right-1 -top-1 z-10 grid h-10 w-10 place-items-center"
          @click="pauseVideo()"
        >
          <slot />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";

import "plyr/dist/plyr.css";
import Plyr from "plyr";
import { useStore } from "@nanostores/vue";
import { showVideo } from "@src/store";

import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const $show = useStore(showVideo);

const props = defineProps({
  video_id: {
    type: String,
  },
  embed: {
    type: String,
  },
  className: {
    type: String,
  },
});

const container = ref(null);
const videoPlayer = ref(null);
const loading = ref(false);
const pauseVideo = () => {
  showVideo.set({
    id: $show.value.id,
    show: false,
  });
  if (videoPlayer.value) videoPlayer.value.pause();
};

const playVideo = () => {
  /* allowCookie.value = checkCookie(); */
  if (!videoPlayer.value) {
    loading.value = true;
    videoPlayer.value = new Plyr(container.value, {
      playsinline: 0,
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
        origin: window.location.host,
        iv_load_policy: 3,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
        enablejsapi: 1,
        noCookie: true,
      },
    });

    videoPlayer.value.on("ready", function (event) {
      videoPlayer.value.play();
      loading.value = false;
    });
  } else {
    videoPlayer.value.play();
  }
};

watch(
  $show,

  (val) => {
    if (val.show && val.id === props.video_id) {
      playVideo();
      disableBodyScroll(document.body);
    }
    if (!val.show && val.id === props.video_id) {
      enableBodyScroll(document.body);
    }
  },
  { immediate: true },
);
</script>

<style>
.z-1000 {
  z-index: 100;
}
</style>

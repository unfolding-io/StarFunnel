<template>
  <button
    aria-label="show video"
    @click="openVideo()"
    :class="`${className} ${!!video_id ? '' : 'pointer-events-none '}`"
  >
    <slot />
  </button>
</template>

<script setup>
import { showVideo } from "@src/store";

const openVideo = () => {
  if (!props.video_id) return;

  showVideo.set({
    id: props.video_id,
    show: true,
  });
};
const props = defineProps({
  video_id: {
    type: String,
  },
  className: {
    type: String,
  },
});
</script>

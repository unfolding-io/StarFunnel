<template>
  <div
    ref="root"
    :class="`${className || ''} ${isVisible ? 'in-screen' : 'out-of-screen'} ${
      firstVisible ? 'is-active' : 'is-inactive'
    }`"
  >
    <slot v-if="show" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    className?: string;
    noSsr?: boolean;
  }>(),
  {
    noSsr: false,
  },
);

const isVisible = ref(false);
const firstVisible = ref(false);
const root = ref<HTMLElement | null>(null);

useIntersectionObserver(
  root,
  ([{ isIntersecting }]) => {
    isVisible.value = !!isIntersecting;
    if (isIntersecting) firstVisible.value = true;
  },
  { rootMargin: "10%" },
);

const show = computed(() => {
  if (props.noSsr && !firstVisible.value) return false;
  return true;
});
</script>

<template>
  <div class="hide" :data-popup="link"></div>
  <Transition name="fade">
    <div
      v-if="!!$show.show && $show.type === props.link"
      class="bg-dark-blur popup pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click="hide()"
    >
      <div
        @click.stop
        class="container-sm relative"
        @mouseenter="pauseProgress(true)"
        @mouseleave="pauseProgress(false)"
      >
        <div
          class="popup__content hide-scrollbar cursor-auto overflow-hidden rounded shadow-xl"
          :class="className"
        >
          <div slot="content" class="relative text-center">
            <slot name="content" />

            <div
              v-if="code"
              class="relative z-10 grid place-items-center"
              :class="isSupported ? 'cursor-pointer' : ''"
            >
              <div @click="doCopy()" class="flex items-center">
                <div
                  disabled
                  class="surface-base rounded-l-lg px-4 py-2 font-mono text-xl shadow-lg"
                  :value="code"
                >
                  {{ code }}
                </div>
                <div
                  v-if="isSupported"
                  class="surface-secondary h-full rounded-r-lg px-4 py-3 text-xl shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="currentColor"
                      d="M184 64H40a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8Zm-8 144H48V80h128Zm48-168v144a8 8 0 0 1-16 0V48H72a8 8 0 0 1 0-16h144a8 8 0 0 1 8 8Z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              v-if="newsletter"
              class="surface-base relative z-10 m-4 rounded p-4"
            >
              <Newsletter :data="newsletter" />
            </div>

            <slot name="buttons" />

            <div
              class="progress absolute inset-x-0 top-0 z-20"
              :style="`--progress: ${progress}%`"
            ></div>
            <slot name="image" />
          </div>
        </div>

        <button
          class="btn btn-icon surface-dark btn-absolute -right-1 -top-1 z-50 grid h-10 w-10 place-items-center"
          @click="hide()"
        >
          <slot name="close" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, watch, computed } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showPopup } from "@src/store";
import { useInterval, useClipboard } from "@vueuse/core";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import Newsletter from "@components/form/Newsletter.vue";

const { isSupported, copy } = useClipboard();

const props = defineProps({
  data: {
    type: Object,
  },
  link: {
    type: String,
    default: "popup",
  },
  code: {
    type: String,
  },
  className: {
    type: String,
    default: "",
  },
  newsletter: {
    type: Object,
  },
});

const $show = useStore(showPopup);
const { counter, pause, resume, reset } = useInterval(100, { controls: true });
/* PAUSE THE TIMER */
pause();

const progress = computed(() => {
  const total =
    ((props.data.duration - counter.value / 10) / props.data.duration) * 100;
  return 100 - total;
});

const doCopy = () => {
  copy(props.code);
  toast.success(t("promocode_copied"));
};
const pauseProgress = (playing) => {
  if (props.data.duration === 0) return;
  if (playing) {
    pause();
  } else {
    resume();
  }
};

const hide = () => {
  showPopup.set({
    type: $show.value.type,
    show: false,
  });
};

onMounted(() => {
  if (props.data.delay === 0) {
    showPopup.set({
      type: props.link,
      show: true,
    });
    resume();
  }

  if (props.data.delay > 0) {
    setTimeout(() => {
      showPopup.set({
        type: props.link,
        show: true,
      });
      resume();
    }, props.data.delay * 1000);
  }
});

watch(
  $show,
  (val) => {
    if (val.show && val.type === props.link) {
      reset();
      disableBodyScroll(document.body);
    } else if (!val.show && val.type === props.link) {
      enableBodyScroll(document.body);
    }
  },
  { immediate: false },
);

watch(
  progress,
  (val) => {
    if (props.data.duration > 0 && val > 100) {
      pause();
      hide();
    }
  },
  { immediate: false },
);
</script>

<style lang="postcss">
.popup {
  &__content {
    max-height: calc(100vh - 2rem);
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      max-height: min(100vh - 2rem, 35rem);
    }
  }
}
.popup_wrap {
  @apply relative;
  z-index: 100;
  height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}
.progress {
  @apply pointer-events-none h-3 origin-top-left bg-secondary transition-transform;
  transform: scaleX(var(--progress));
}
</style>

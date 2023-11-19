<template>
  <Transition name="fade">
    <div
      :data-dialog="link"
      :data-type="type"
      v-show="show"
      class="bg-dark-blur z-1000 dialog pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click="hide()"
    >
      <div @click.stop class="container-md relative" v-if="show">
        <div
          class="surface-base dialog__inner dialog-grid hide-scrollbar relative overflow-hidden rounded shadow-xl"
        >
          <div class="overflow-hidden">
            <slot name="image" />
          </div>
          <div
            class="hide-scrollbar dialog__content relative overflow-hidden p-8 md:p-14"
          >
            <slot name="content" />
          </div>
        </div>
        <button
          :aria-label="t('close')"
          class="btn btn-icon surface-dark btn-absolute -right-1 -top-1 z-10 grid h-10 w-10 place-items-center"
          @click="hide()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 6L6 18M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, reactive, computed } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";

import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const props = defineProps({
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const $show = useStore(showDialog);

const show = computed(() => {
  return (
    $show.value.show &&
    $show.value.type === props.type &&
    $show.value.link === props.link
  );
});

const hide = () => {
  showDialog.set({
    type: $show.value.type,
    show: false,
    slug: $show.value.slug,
  });
};

watch(
  show,
  (val) => {
    if (val) {
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  },
  { immediate: false },
);
</script>

<style lang="postcss" scoped>
.z-1000 {
  z-index: 1000;
}

.dialog-grid {
  @apply grid grid-cols-1;
  @screen md {
    grid-template-columns: 4fr 5fr;
  }
}

.dialog {
  &__inner {
    max-height: calc(100vh - 2rem);
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      max-height: min(100vh - 2rem, 35rem);
    }
  }

  &__content {
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      max-height: min(100vh - 2rem, 35rem);
    }
  }
}

.input-group {
  @apply relative isolate;
  input {
    @apply block w-full appearance-none border-0 border-b border-gray-500 bg-transparent px-0 py-2.5 text-sm text-current focus:border-primary focus:outline-none focus:ring-0;
  }
  label {
    @apply absolute left-0 top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-current duration-300;
  }
}
</style>

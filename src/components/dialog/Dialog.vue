<template>
  <Transition name="fade">
    <div
      :data-dialog="link"
      :data-type="type"
      v-show="show"
      class="bg-dark-blur z-1000 dialog pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click="hide()"
    >
      <div
        @click.stop
        class="container-md relative cursor-default"
        v-if="show"
      >
        <div
          class="surface-base dialog__inner relative grid grid-cols-1 overflow-hidden rounded-2xl shadow-xl md:grid-cols-[4fr_5fr]"
        >
          <div class="dialog__media hidden overflow-hidden md:block md:h-full">
            <slot name="image" />
          </div>
          <div
            class="hide-scrollbar dialog__content relative overflow-x-hidden overflow-y-auto p-8 md:p-14"
          >
            <slot name="content" />
          </div>
        </div>
        <button
          :aria-label="t('close')"
          class="btn btn-icon surface-dark btn-absolute -right-3 -top-3 z-10 grid h-10 w-10 place-items-center"
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
import { watch, computed } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";

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
    document.body.style.overflow = val ? "hidden" : "";
  },
  { immediate: false },
);
</script>

<style lang="postcss" scoped>
@reference "../../styles/global.css";

.z-1000 {
  z-index: 1000;
}

.dialog__inner {
  max-height: calc(100vh - 2rem);
  overflow-x: hidden;
  overflow-y: auto;
}

.dialog__media :deep(picture),
.dialog__media :deep(img) {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

@media (width >= 48rem) {
  .dialog__inner {
    height: min(100vh - 2rem, 40rem);
  }

  .dialog__content {
    max-height: calc(100vh - 2rem);
    height: min(100vh - 2rem, 40rem);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>

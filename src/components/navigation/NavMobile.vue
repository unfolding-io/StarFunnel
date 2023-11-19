<template>
  <span class="contents">
    <button
      :aria-label="show ? translations.close : translations.menu"
      @click="toggleMenu()"
      :class="`nav-mobile-btn relative ml-auto flex md:hidden ${
        show ? 'text-primary' : ''
      }`"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        class="menu-icon h-6 w-6"
        :class="show ? 'close' : 'menu'"
        style="enable-background: new 0 0 100 100"
        version="1.1"
        viewBox="0 0 100 100"
      >
        <path
          id="line_x5F_3"
          d="M4.88 50H96.4"
          stroke="currentColor"
          stroke-width="12"
          stroke-linecap="round"
          stroke-miterlimit="10"
        />
        <path
          id="line_x5F_2"
          d="M4.88 50H96.4"
          stroke="currentColor"
          stroke-width="12"
          stroke-linecap="round"
          stroke-miterlimit="10"
        />
        <path
          id="line_x5F_1"
          d="M4.88 50H96.4"
          stroke="currentColor"
          stroke-width="12"
          stroke-linecap="round"
          stroke-miterlimit="10"
        />
      </svg>
    </button>
    <transition name="nested">
      <div
        class="surface-base nav-mobile fixed inset-0 grid h-full auto-rows-min place-items-center gap-4 px-4 pt-4"
        v-show="show"
      >
        <a href="/" class="mx-auto max-w-[12rem] pt-10">
          <slot name="logo" />
        </a>

        <div class="mobile-links mt-3 w-full text-center" slot="links">
          <a
            :href="link.href"
            v-for="(link, index) in menu"
            @click="toggleMenu()"
            :key="link.href"
            :style="`--animation-delay: ${(index + 1) * 100}ms`"
            :class="`title-md inner block w-full py-3 font-light transition-all duration-300 hover:text-primary ${
              isActive(link.href) ? 'active text-primary' : ''
            }`"
          >
            {{ link.label }}
          </a>
        </div>

        <slot name="social" />
      </div>
    </transition>
  </span>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useScrollLock } from "@vueuse/core";
const show = ref(false);
const body = ref(null);
const props = defineProps({
  translations: Object,
  menu: Array,
  active: String,
});
const toggleMenu = () => {
  show.value = !show.value;
  isLocked.value = show.value;
};

const isActive = (href) => {
  if (props.active === "" && href == "/") return true;
  if (props.active !== "" && href.startsWith(`/${props.active}`)) return true;
};

let isLocked;

onMounted(() => {
  body.value = document.getElementsByTagName("body")[0];
  isLocked = useScrollLock(body.value);
});
</script>

<style lang="postcss">
.menu-icon {
  path {
    @apply origin-center transition-all duration-300 ease-in-out;
  }
  path:nth-child(1) {
    @apply -translate-y-7;
  }

  path:nth-child(3) {
    @apply translate-y-7;
  }

  &.close {
    path:nth-child(1) {
      @apply translate-y-0 -rotate-45;
    }
    path:nth-child(2) {
      @apply scale-x-0;
    }
    path:nth-child(3) {
      @apply translate-y-0 rotate-45;
    }
  }
}
.nav-mobile {
  @apply overflow-x-hidden overflow-y-scroll;
  z-index: 999998;
  scrollbar-width: none;
  padding-bottom: calc(2em + env(safe-area-inset-bottom));
  &-btn {
    z-index: 999999;
  }
}

.nested-enter-active,
.nested-leave-active {
  transition: all 0.7s ease-in-out;
}

.nested-leave-active {
  transition-delay: 0.25s;
}
.inner {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateX(100%);
  transform-origin: right center;
  opacity: 1;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-active .inner {
  transition-delay: var(--animation-delay, 0.25s);
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(200px);
  opacity: 0.001;
}
</style>

<template>
  <div
    :class="className"
    class="accordion-item relative"
    itemscope
    itemprop="mainEntity"
    itemtype="https://schema.org/Question"
  >
    <h2
      class="accordion-header relative z-30 mb-0"
      :id="`heading_${index}`"
      itemprop="name"
    >
      <button
        class="accordion-button group relative flex w-full items-center justify-between rounded-none py-4 text-left transition focus:outline-none"
        type="button"
        @click="$showFaq == index ? showFaq.set(null) : showFaq.set(index)"
        :aria-expanded="$showFaq == index"
        :aria-controls="`collapse_${index}`"
      >
        <span class="grow-1 title-xs py-5 pr-10">
          {{ title }}
        </span>

        <div class="shrink-1 h-8 w-8 -translate-x-8">
          <div
            class="origin-center transition-transform duration-300"
            :class="$showFaq == index ? '-rotate-90' : ' rotate-90'"
          >
            <svg
              class="-mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xml:space="preserve"
              style="enable-background: new 0 0 12 12"
              viewBox="0 0 12 12"
            >
              <g
                class="-translate-x-[20%] transition-transform duration-300 group-hover:translate-x-0"
              >
                <path
                  d="M9.2 6.4 6.4 9.1c-.1.1-.1.4 0 .5s.4.1.5 0l3.4-3.4c.1-.1.1-.4 0-.5L7 2.4c-.1-.1-.4-.1-.5 0-.1.1-.1.4 0 .5l2.7 2.7c.4.4.4.4 0 .8z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.5"
                />
                <g>
                  <path
                    class="origin-right -translate-x-[8%] scale-x-0 transition-transform duration-300 group-hover:scale-x-75"
                    d="M9.6 5.6H1.9c-.2 0-.3.2-.3.4s.2.4.4.4h7.7c.2 0 .4-.2.4-.4s-.3-.4-.5-.4z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.5"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </button>
    </h2>
    <div
      :id="`collapse_${index}`"
      class="accordion-collapse"
      :aria-labelledby="`heading_${index}`"
      itemscope
      role="region"
      itemprop="acceptedAnswer"
      itemtype="https://schema.org/Answer"
    >
      <Transition
        name="my-transition"
        @enter="onEnter"
        @leave="onLeave"
        @before-leave="beforeLeave"
        @before-enter="onBeforeEnter"
      >
        <div class="accordion-body" v-show="$showFaq == index" itemprop="text">
          <slot />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@nanostores/vue";
import { showFaq } from "@src/store";

const props = defineProps({
  title: String,
  index: Number,
  id: String,
  className: String,
});

const $showFaq = useStore(showFaq);

function onBeforeEnter(el) {
  el.style.maxHeight = "0";
}

function onEnter(el, done) {
  el.style.maxHeight = el.scrollHeight + "px";
}

function beforeLeave(el) {
  el.style.maxHeight = el.scrollHeight + "px";
}
function onLeave(el) {
  el.style.maxHeight = "0";
}
</script>

<style lang="postcss">
.accordion {
  &-header {
    max-width: 100% !important;
  }

  &-body {
    height: auto;
    transition: max-height 0.5s ease-in-out;
  }
  &-button {
    .icon {
      @apply transition-transform duration-500;
    }
  }

  &-collapse {
    overflow: hidden;
  }

  &-item:not(.last) {
    @apply relative;

    &:after {
      content: "";
      background: currentcolor;
      height: 2px;
      @apply absolute bottom-0 left-0 right-10 opacity-20;
    }
  }
}
.faq-grid {
  @apply grid gap-2;

  @screen md {
    grid-template-columns: 3fr 1fr;
  }
}
</style>

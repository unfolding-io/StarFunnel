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
        class="accordion-button group relative flex w-full items-center justify-between rounded-none py-3 text-left transition focus:outline-none"
        type="button"
        @click="$showFaq == index ? showFaq.set(null) : showFaq.set(index)"
        :aria-expanded="$showFaq == index"
        :aria-controls="`collapse_${index}`"
      >
        <span class="grow-1 title-xs pr-10">
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
      :class="{ 'is-open': $showFaq == index }"
      :aria-labelledby="`heading_${index}`"
      itemscope
      role="region"
      itemprop="acceptedAnswer"
      itemtype="https://schema.org/Answer"
    >
      <div class="accordion-body" itemprop="text">
        <slot />
      </div>
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
</script>

<style lang="postcss">
@reference "../../styles/global.css";

.accordion-header {
  max-width: 100% !important;
}

.accordion-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-collapse.is-open {
  grid-template-rows: 1fr;
}

.accordion-collapse.is-open .accordion-body {
  opacity: 1;
  transform: translateY(0);
}

.accordion-body {
  overflow: hidden;
  min-height: 0;
  opacity: 0;
  transform: translateY(-0.35rem);
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-item:not(.last) {
  position: relative;
}

.accordion-item:not(.last)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 2.5rem;
  height: 2px;
  background: currentcolor;
  opacity: 0.2;
}

@media (prefers-reduced-motion: reduce) {
  .accordion-collapse,
  .accordion-body {
    transition: none;
  }
}

.faq-grid {
  display: grid;
  gap: 0.5rem;
}

@media (width >= 768px) {
  .faq-grid {
    grid-template-columns: 3fr 1fr;
  }
}
</style>

<template>
  <form
    name="newsletter-subscribes"
    class="newsletter-footer relative inline-flex items-center gap-4 py-4"
    @submit.prevent="submit"
  >
    <div class="input-group min-w-[12rem] flex-1 sm:min-w-[14rem]">
      <input
        type="email"
        id="email"
        name="email"
        placeholder=" "
        v-model="form.email"
        :aria-invalid="!!errorFields?.email?.length"
      />
      <label
        for="email"
        :class="{ 'is-invalid': !!errorFields?.email?.length }"
        >{{ t("email") }} *</label
      >
    </div>

    <button
      type="submit"
      :disabled="!canSubmit"
      class="btn group shrink-0"
      :class="canSubmit ? 'surface-primary' : 'surface-base opacity-50'"
    >
      {{ t("subscribe") }}

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
    </button>
    <Loading :loading="loading" />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { t } from "@util/translate";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import Loading from "@components/common/Loading.vue";
import { toast } from "vue3-toastify";
import { actions } from "astro:actions";

onMounted(async () => {
  if (document.getElementById("toastify-css")) return;
  const cssUrl = (await import("vue3-toastify/dist/index.css?url")).default;
  const link = document.createElement("link");
  link.id = "toastify-css";
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
});

const props = withDefaults(
  defineProps<{
    type?: string;
    list_id?: string;
    data?: Record<string, any>;
  }>(),
  {
    type: "mailchimp",
  },
);
const loading = ref(false);
const form = reactive({ email: "" });
const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
};
const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);
const canSubmit = computed(() => {
  return !loading.value && isFinished.value && pass.value;
});

const submit = async () => {
  if (props.type !== "mailchimp" || !canSubmit.value) return;

  loading.value = true;
  try {
    const { data, error } = await actions.subscribe({
      email: form.email,
      provider: "mailchimp",
    });

    if (error) {
      toast.error(error.message || t("newsletter_error"));
      return;
    }

    if (data?.status === "exists") {
      toast.info(t("newsletter_already_subscribed"));
    } else {
      toast.success(t("newsletter_thanks"));
    }
    form.email = "";
  } catch (e) {
    toast.error(t("newsletter_error"));
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* Keep with the island — Vite sometimes serves a stale layouts/global sheet in HMR */
.newsletter-footer .input-group {
  position: relative;
  isolation: isolate;
  min-width: 12rem;
}
.newsletter-footer .input-group input {
  display: block;
  width: 100%;
  appearance: none;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, #fff 70%, transparent);
  background: transparent;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
}
.newsletter-footer .input-group input:focus {
  border-bottom-color: var(--color-primary, #f34c18);
  outline: none;
}
.newsletter-footer .input-group label {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0.625rem;
  z-index: 10;
  transform: translateY(-1.5rem) scale(0.75);
  transform-origin: 0 0;
  font-size: 0.875rem;
  color: color-mix(in srgb, #fff 80%, transparent);
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}
.newsletter-footer .input-group input:placeholder-shown ~ label {
  transform: translateY(0) scale(1);
}
.newsletter-footer .input-group input:focus ~ label,
.newsletter-footer .input-group input:not(:placeholder-shown) ~ label {
  transform: translateY(-1.5rem) scale(0.75);
  color: var(--color-primary, #f34c18);
}
.newsletter-footer .input-group label.is-invalid {
  color: var(--color-warning, #ca792d);
}
</style>

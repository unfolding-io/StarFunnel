<template>
  <form @submit.prevent="submit" class="dialog-form grid gap-4">
    <div class="grid gap-2 pb-2">
      <h2 class="title-sm balance">{{ data?.title }}</h2>
      <slot name="content" />
    </div>

    <div class="input-group">
      <label for="newsletter-name">{{ t("name") }} *</label>
      <input
        id="newsletter-name"
        type="text"
        name="name"
        v-model="form.name"
      />
    </div>
    <div class="input-group">
      <label for="newsletter-last-name">{{ t("last_name") }} *</label>
      <input
        id="newsletter-last-name"
        type="text"
        name="last_name"
        v-model="form.last_name"
      />
    </div>

    <div class="input-group">
      <label for="newsletter-email">{{ t("email") }} *</label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        v-model="form.email"
      />
    </div>

    <div class="flex w-full items-center justify-between gap-4">
      <div>
        <div
          class="inline-flex items-center"
          v-if="data.include_main_list && data.id"
        >
          <label
            class="relative -ml-4 flex cursor-pointer items-center rounded-full p-3"
            for="terms-and-conditions"
            data-ripple-dark="true"
          >
            <input
              v-model="subscribeNewsletter"
              id="terms-and-conditions"
              type="checkbox"
              class="before:content[''] border-blue-gray-800 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
            />
            <div
              class="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <label
            class="mt-px cursor-pointer select-none text-xs"
            for="terms-and-conditions"
          >
            {{ t("subscribe_to_newsletter") }}
          </label>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          class="btn surface-primary group mb-auto ml-auto"
          type="submit"
          :disabled="!canSubmit"
        >
          <span>
            {{ t(label) }}
          </span>
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
      </div>
    </div>

    <Loading :loading="loading" />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";
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

const $showDialog = useStore(showDialog);

const props = withDefaults(
  defineProps<{
    data?: Record<string, any>;
    provider?: string;
  }>(),
  {
    provider: "mailchimp",
  },
);

const form = reactive({ email: "", name: "", last_name: "" });

const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
};

const { pass, isFinished } = useAsyncValidator(form, rules);

const label = t("subscribe");
const subscribeNewsletter = ref(false);
const loading = ref(false);

const hide = () => {
  showDialog.set({
    type: $showDialog.value.type,
    slug: $showDialog.value.slug,
    show: false,
  });
};

const canSubmit = computed(() => {
  return !loading.value && isFinished.value && pass.value;
});

const submit = async () => {
  if (props.provider !== "mailchimp" || !canSubmit.value) return;

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

    const thanks = props.data?.thanks ? props.data.thanks : t("newsletter_thanks");
    if (data?.status === "exists") {
      toast.info(
        props.data?.thanks
          ? props.data.thanks
          : t("newsletter_already_subscribed"),
      );
    } else {
      toast.success(thanks);
    }
    hide();
    form.email = "";
    form.name = "";
    form.last_name = "";
  } catch (e) {
    toast.error(t("newsletter_error"));
  } finally {
    loading.value = false;
  }
};
</script>

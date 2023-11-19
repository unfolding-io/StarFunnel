<template>
  <form @submit.prevent="submit" class="grid gap-4">
    <div class="pb-8">
      <h2 class="subtitle balance">{{ data?.title }}</h2>
      <slot name="content" />
    </div>

    <div class="input-group">
      <input
        type="text"
        name="name"
        placeholder=" "
        class="peer"
        v-model="form.name"
      />
      <label
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
        >{{ t("name") }} *</label
      >
    </div>
    <div class="input-group">
      <input
        type="text"
        name="last_name"
        placeholder=" "
        class="peer"
        v-model="form.last_name"
      />
      <label
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
        >{{ t("last_name") }} *</label
      >
    </div>

    <div class="input-group">
      <input
        type="email"
        name="email"
        placeholder=" "
        class="peer"
        v-model="form.email"
      />
      <label
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
        >{{ t("email") }} *</label
      >
    </div>

    <div class="flex w-full justify-between gap-4">
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

<script setup>
import { ref, watch, reactive, computed } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";

import Loading from "@components/common/Loading.vue";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

const $showDialog = useStore(showDialog);

const props = defineProps({
  data: {
    type: Object,
  },

  provider: {
    type: String,
    default: "mailchimp",
  },
});

const form = reactive({ email: "", name: "" });

const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
};

const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);

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

const formData = computed(() => {
  return {
    email: form.email,
    first_name: form.name,
    last_name: form.last_name,
    type: $showDialog.value.type,
    tags: props.data.tags,
    list: props.data.id,
    include_main_list: subscribeNewsletter.value,
    status: props.data.status,
  };
});

const submit = () => {
  if (props.provider === "mailchimp") {
    loading.value = true;
    fetch("/api/subscribe-mailchimp", {
      method: "POST",
      body: JSON.stringify(formData.value),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "pending") {
          toast.success(
            props.data?.thanks ? props.data.thanks : t("newsletter_thanks"),
          );
          hide();
          form.email = "";
          form.name = "";
          form.last_name = "";
        } else if (data.status === "subscribed") {
          toast.info(
            props.data?.thanks
              ? props.data.thanks
              : t("newsletter_already_subscribed"),
          );
          hide();
          form.email = "";
          form.name = "";
          form.last_name = "";
        } else {
          toast.error(t("newsletter_error"));
        }
      })
      .catch((e) => {
        toast.error(t("newsletter_error"));
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<style lang="postcss">
.dialog-grid {
  @apply grid grid-cols-1;
  @screen md {
    grid-template-columns: 4fr 5fr;
  }
}

.dialog {
  &__newsletter-inner {
    max-height: calc(100vh - 2rem);
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      height: min(100vh - 2rem, 30rem);
    }
  }

  &__newsletter-content {
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      height: min(100vh - 2rem, 30rem);
    }
  }
}

.input-group {
  @apply relative isolate;
  input {
    @apply block w-full appearance-none border-0 border-b border-gray-500 bg-transparent px-0 py-2.5 text-sm text-current focus:border-primary focus:outline-none focus:ring-0;
  }
  label {
    @apply pointer-events-none absolute left-0 top-3 z-20 origin-[0] -translate-y-6 scale-75 transform text-sm text-current duration-300;
  }
}
</style>

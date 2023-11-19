<template>
  <form
    name="newsletter-subscribes"
    class="relative inline-flex items-center gap-4 py-4"
    @submit.prevent="submit"
  >
    <div class="input-group min-w-[200px]">
      <input
        type="email"
        id="email"
        name="email"
        placeholder=" "
        class="pee"
        v-model="form.email"
        :class="errorFields?.email?.length ? 'text-warning' : 'text-white'"
      />
      <label
        for="email"
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
        >{{ t("email") }} *</label
      >
    </div>

    <button
      type="submit"
      :disabled="!canSubmit"
      class="btn group"
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

<script setup>
import { ref, computed, reactive } from "vue";
import { t } from "@util/translate";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import Loading from "@components/common/Loading.vue";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "mailchimp",
  },
  list_id: String,
  data: {
    type: Object,
  },
});
const loading = ref(false);
const message = ref(null);
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

const submit = () => {
  if (props.type === "mailchimp") {
    loading.value = true;
    fetch("/api/subscribe-mailchimp", {
      method: "POST",
      body: JSON.stringify({ email: form.email }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "pending" || data.status === "subscribed") {
          toast.success(t("newsletter_thanks"));
          form.email = "";
        } else if (data.status === "Member Exists") {
          toast.info(t("newsletter_already_subscribed"));
          form.email = "";
        } else {
          toast.error(t("newsletter_error"));
        }
      })
      .catch((e) => {
        message.value = t("newsletter_error");
        toast.error(t("newsletter_error"));
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

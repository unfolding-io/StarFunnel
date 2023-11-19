<template>
  <form @submit.prevent="submit" class="grid gap-4">
    <div class="pb-8">
      <h2 class="subtitle">{{ contact?.title }}</h2>
      <slot name="text" />
    </div>
    <div class="input-group z-20 w-full" v-if="contact.topics.length > 1">
      <Popper
        placement="bottom-start"
        offsetDistance="1"
        :show="showPopper"
        class="w-full"
      >
        <button
          type="button"
          @click="showPopper = !showPopper"
          class="select w-full text-left"
        >
          {{ !!topic ? topic : "Select" }}
        </button>

        <template #content>
          <ul>
            <li
              v-for="(item, index) in contact.topics"
              :key="index"
              :class="topic == item.label ? 'bg-dark bg-opacity-10' : ''"
            >
              <button
                type="button"
                class="w-full p-2 text-left hover:bg-dark hover:bg-opacity-10"
                @click="
                  setTopic(item);
                  showPopper = false;
                "
              >
                {{ item.label }}
              </button>
            </li>
          </ul>
        </template>
      </Popper>

      <label
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
        >{{ t("topic") }} *</label
      >
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
    <div class="input-group">
      <input
        type="text"
        name="phone"
        placeholder=" "
        class="peer"
        v-model="form.phone"
      />
      <label
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
        >{{ t("phone") }}</label
      >
    </div>
    <div class="input-group">
      <textarea
        class="hide-scrollbar peer"
        name="message"
        id=""
        placeholder=" "
        cols="30"
        rows="2"
        ref="textarea"
        v-model="input"
      ></textarea>
      <label
        class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
      >
        {{ t("message") }} *</label
      >
    </div>
    <div
      class="pointer-events-none sticky bottom-0 right-5 flex justify-end md:translate-y-10"
    >
      <button
        class="btn surface-primary group pointer-events-auto mb-auto ml-auto"
        type="submit"
        :disabled="!canSubmit"
      >
        <span>
          {{ t("submit") }}
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
    <Loading :loading="loading" />
  </form>
</template>

<script setup>
import { ref, watch, reactive, computed } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { useTextareaAutosize } from "@vueuse/core";
import Loading from "@components/common/Loading.vue";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

import Popper from "vue3-popper";

const props = defineProps({
  contact: {
    type: Object,
  },
});

const $showDialog = useStore(showDialog);
const form = reactive({ email: "", name: "", message: "", phone: "" });
const { textarea, input } = useTextareaAutosize();

const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
  name: [
    {
      type: "string",
      required: true,
    },
  ],
  message: [
    {
      type: "string",
      min: 10,
      required: true,
    },
  ],
};
const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);

const topic = ref(null);
const showPopper = ref(false);
const loading = ref(false);
const topicChannel = ref(null);
const topicEmail = ref(null);

const hide = () => {
  showDialog.set({
    type: $showDialog.value.type,
    slug: $showDialog.value.slug,
    show: false,
  });
};

const setTopic = (data) => {
  topic.value = data.label;
  topicEmail.value = data.email;
  topicChannel.value = data.slack_id;
};

if (props.contact.topics.length === 1) {
  setTopic(props.contact.topics[0]);
}

const canSubmit = computed(() => {
  return !loading.value && isFinished.value && pass.value && !!topic.value;
});

const mailData = computed(() => {
  return {
    email: form.email,
    name: form.name,
    topicChannel: topicChannel.value,
    topicEmail: topicEmail.value,
    message: `
Topic:  ${topic.value}\r\n
Name: ${form.name}\r\n
Phone: ${form.phone}\r\n
Email: ${form.email}\r\n
Message: ${form.message}\r\n            `,
  };
});

const submit = () => {
  loading.value = true;

  if (!!props.contact.provider) {
    fetch(`/api/contact-${props.contact.provider}`, {
      method: "POST",
      body: JSON.stringify(mailData.value),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ok") {
          toast.success(t("contact_thanks"));
          form.email = "";
          form.name = "";
          form.phone = "";
          form.message = "";
          input.value = "";
          hide();
        } else {
          toast.error(t("contact_error"));
        }
      })
      .catch((e) => {
        console.log("error", e);
        toast.error(t("contact_error"));
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

watch(
  input,

  (val) => {
    form.message = val;
  },
  { immediate: false },
);
</script>

<style lang="postcss" scoped>
.input-group {
  @apply relative isolate;
  input,
  textarea,
  .select {
    @apply block w-full appearance-none border-0 border-b border-gray-500 bg-transparent px-0 py-2.5 text-sm text-current focus:border-primary focus:outline-none focus:ring-0;
  }
  label {
    @apply pointer-events-none absolute left-0 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-current duration-300;
  }
}
</style>

<template>
  <form @submit.prevent="submit" class="dialog-form grid gap-4">
    <div class="grid gap-2 pb-2">
      <h2 class="title-sm">{{ contact?.title }}</h2>
      <slot name="content" />
    </div>
    <div class="input-group z-20 w-full" v-if="contact?.topics?.length > 1">
      <label for="contact-topic">{{ t("topic") }} *</label>
      <select
        id="contact-topic"
        class="select w-full"
        :value="topic || ''"
        @change="onTopicChange"
        required
      >
        <option value="" disabled>Select</option>
        <option
          v-for="(item, index) in contact.topics"
          :key="index"
          :value="item.label"
        >
          {{ item.label }}
        </option>
      </select>
    </div>
    <div class="input-group">
      <label for="contact-name">{{ t("name") }} *</label>
      <input
        id="contact-name"
        type="text"
        name="name"
        v-model="form.name"
      />
    </div>

    <div class="input-group">
      <label for="contact-email">{{ t("email") }} *</label>
      <input
        id="contact-email"
        type="email"
        name="email"
        v-model="form.email"
      />
    </div>
    <div class="input-group">
      <label for="contact-phone">{{ t("phone") }}</label>
      <input
        id="contact-phone"
        type="text"
        name="phone"
        v-model="form.phone"
      />
    </div>
    <div class="input-group">
      <label for="contact-message">{{ t("message") }} *</label>
      <textarea
        id="contact-message"
        name="message"
        cols="30"
        rows="3"
        ref="textarea"
        v-model="input"
      ></textarea>
    </div>
    <div
      class="pointer-events-none right-5 mb-14 flex translate-y-10 justify-end md:sticky md:bottom-0"
    >
      <button
        class="btn surface-primary pointer-events-auto"
        type="submit"
        :disabled="!canSubmit"
      >
        {{ t("submit") }}
      </button>
    </div>
    <Loading :loading="loading" />
  </form>
</template>

<script setup>
import { ref, watch, reactive, computed, onMounted } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { useTextareaAutosize } from "@vueuse/core";
import Loading from "@components/common/Loading.vue";
import { toast } from "vue3-toastify";
import { actions } from "astro:actions";

const props = defineProps({
  contact: {
    type: Object,
  },
});

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
const { pass, isFinished } = useAsyncValidator(form, rules);

const topic = ref(null);
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

const onTopicChange = (event) => {
  const label = event.target?.value;
  const item = props.contact?.topics?.find((entry) => entry.label === label);
  if (item) setTopic(item);
};

if (props.contact?.topics?.length === 1) {
  setTopic(props.contact.topics[0]);
}

const canSubmit = computed(() => {
  return !loading.value && isFinished.value && pass.value && !!topic.value;
});

const submit = async () => {
  if (!props.contact?.provider || !canSubmit.value) return;

  loading.value = true;
  try {
    const { error } = await actions.contact({
      provider: props.contact.provider,
      email: form.email,
      name: form.name,
      phone: form.phone || "",
      message: form.message,
      topic: topic.value,
      topicEmail: topicEmail.value || "",
      topicChannel: topicChannel.value || "",
    });

    if (error) {
      toast.error(t("contact_error"));
      return;
    }

    toast.success(t("contact_thanks"));
    form.email = "";
    form.name = "";
    form.phone = "";
    form.message = "";
    input.value = "";
    hide();
  } catch (e) {
    console.error("contact action error", e);
    toast.error(t("contact_error"));
  } finally {
    loading.value = false;
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


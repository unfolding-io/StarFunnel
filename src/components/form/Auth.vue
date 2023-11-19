<script setup>
import { ref, watch, reactive, computed, onMounted } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@src/store";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import Loading from "@components/common/Loading.vue";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

const $showDialog = useStore(showDialog);
const form = reactive({ email: "", password: "" });
const showForm = ref(false);

const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
  password: [
    {
      type: "string",
      required: true,
      min: 8,
    },
  ],
};

const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);

const label = computed(() => {
  if ($showDialog.value.auth === "sign_in") return t("login");
  if ($showDialog.value.auth === "sign_up") return t("register");
  if ($showDialog.value.auth === "recover_password") return t("recover");
});

const loading = ref(false);
const agreeTos = ref(false);
const hide = () => {
  showDialog.set({
    type: $showDialog.value.type,
    auth: $showDialog.value.auth,
    link: null,
    show: false,
  });
};

const canSubmit = computed(() => {
  if ($showDialog.value.type === "sign_up" && !agreeTos.value) return false;
  return !loading.value && isFinished.value && pass.value;
});

const formData = computed(() => {
  return {
    email: form.email,
    password: form.password,
    type: $showDialog.value.type,
  };
});

const submit = () => {
  loading.value = true;

  fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify(formData.value),
    headers: { "Content-Type": "application/json" },
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.status === "ok") {
        // ADD YOUR REDIRECT HERE
        form.email = "";
        form.name = "";
        hide();
      } else {
        toast.error(t(`${$showDialog.value.type}_error`));
      }
    })
    .catch((e) => {
      console.log("error", e);
      toast.error(t(`${$showDialog.value.type}_error`));
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(
  $showDialog,

  (val) => {
    if (val.auth === "recover_password") {
      form.password = "xxx-xxx-xxx-xxx-xxx";
    } else {
      form.password = "";
    }
  },
  { immediate: false },
);
onMounted(() => {
  showForm.value = true;
});
</script>

<template>
  <div>
    <form @submit.prevent="submit" class="grid gap-4" v-if="showForm">
      <div class="pb-4">
        <h2 class="subtitle">
          {{ t(`${$showDialog.auth}`) }}
        </h2>
      </div>

      <div class="input-group">
        <input
          type="email"
          name="email"
          autocomplete="username"
          placeholder=" "
          class="peer"
          v-model="form.email"
        />
        <label
          class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
          >{{ t("email") }} *</label
        >
      </div>

      <div class="input-group" v-if="$showDialog.auth !== 'recover_password'">
        <input
          type="password"
          name="password"
          :autocomplete="
            $showDialog.auth === 'sign_in' ? 'current-password' : 'new-password'
          "
          placeholder=" "
          class="peer"
          v-model="form.password"
        />
        <label
          class="peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
          >{{ t("password") }} *</label
        >
      </div>

      <div class="flex w-full justify-between gap-4">
        <div>
          <div
            class="inline-flex items-center"
            v-if="$showDialog.auth === 'sign_up'"
          >
            <label
              class="relative -ml-4 flex cursor-pointer items-center rounded-full p-3"
              for="tac"
              data-ripple-dark="true"
            >
              <input
                v-model="agreeTos"
                id="tac"
                type="checkbox"
                name="terms-and-conditions"
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
            <label class="mt-px cursor-pointer select-none text-xs" for="tac">
              {{ t("terms-and-conditions") }}
            </label>
          </div>
        </div>
        <div class="flex content-start justify-end">
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

      <div class="grid gap-2" v-if="$showDialog.auth !== 'recover_password'">
        <button type="button" class="btn-square surface-overlay mr-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            class="h-6 w-6"
          >
            <path
              fill="#fff"
              d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z"
            />
            <path
              fill="#e33629"
              d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z"
            />
            <path
              fill="#f8bd00"
              d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z"
            />
            <path
              fill="#587dbd"
              d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"
            />
            <path
              fill="#319f43"
              d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z"
            /></svg
          >Google
        </button>

        <button type="button" class="btn-square surface-overlay mr-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            class="h-6 w-6"
          >
            <rect
              width="118.35"
              height="118.35"
              x="4.83"
              y="4.83"
              fill="#3d5a98"
              rx="6.53"
              ry="6.53"
            />
            <path
              fill="#fff"
              d="M86.48 123.17V77.34h15.38l2.3-17.86H86.48v-11.4c0-5.17 1.44-8.7 8.85-8.7h9.46v-16A126.56 126.56 0 0 0 91 22.7c-13.62 0-23 8.3-23 23.61v13.17H52.62v17.86H68v45.83z"
            /></svg
          >Facebook
        </button>
      </div>

      <div class="grid gap-2 text-sm">
        <div v-if="$showDialog.auth === 'sign_in'">
          <button
            class="btn-replace font-semibold"
            type="button"
            :data-replace="t('forgot_password')"
            @click="
              showDialog.set({
                type: 'auth',
                auth: 'recover_password',
                link: 'auth',
                show: true,
              })
            "
          >
            <span>
              {{ t("forgot_password") }}
            </span>
          </button>
        </div>
        <div v-if="$showDialog.auth !== 'sign_in'">
          {{ t("already_an_account") }}
          <button
            class="btn-replace font-semibold"
            type="button"
            :data-replace="t('sign_in')"
            @click="
              showDialog.set({
                type: 'auth',
                auth: 'sign_in',
                link: 'auth',
                show: true,
              })
            "
          >
            <span>
              {{ t("sign_in") }}
            </span>
          </button>
        </div>

        <div v-if="$showDialog.auth === 'sign_in'">
          {{ t("no_account") }}
          <button
            class="btn-replace font-semibold"
            type="button"
            :data-replace="t('sign_up')"
            @click="
              showDialog.set({
                type: 'auth',
                auth: 'sign_up',
                link: 'auth',
                show: true,
              })
            "
          >
            <span>
              {{ t("sign_up") }}
            </span>
          </button>
        </div>
      </div>

      <Loading :loading="loading" />
    </form>
  </div>
</template>

<style lang="postcss" scoped>
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

<template>
  <div class="flex flex-col w-full h-max max-w-[400px]">
    <p
      class="text-surface-400 font-normal text-center text-sm xl:text-base mb-5"
    >
      Enter the new passwords and confirm
    </p>
    <form class="flex flex-col w-full h-max space-y-5">
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-password" class="form-label">Password: </label>
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="id-register-password"
            v-model="password"
            :toggle-mask="true"
            placeholder="Create your password"
            :disabled="isLoading"
            :invalid="errors['password'] && errors['password'] !== ''"
          >
            <template #header>
              <h6 class="text-surface-800 font-semibold text-sm pb-2.5">
                Pick a password
              </h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2.5 text-surface-800 font-semibold text-sm pb-2.5">
                Suggestions
              </p>
              <ul class="pl-2 ml-2 mt-0 list-disc" style="line-height: 1.5">
                <li class="text-sm font-normal text-surface-800">
                  At least one lowercase
                </li>
                <li class="text-sm font-normal text-surface-800">
                  At least one uppercase
                </li>
                <li class="text-sm font-normal text-surface-800">
                  At least one numeric
                </li>
                <li class="text-sm font-normal text-surface-800">
                  Minimum 8 characters
                </li>
              </ul>
            </template>
          </Password>
        </IconField>
        <span v-if="errors['password']" class="text-error">{{
          errors["password"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-confirm-password" class="form-label"
          >Confirm Password:
        </label>
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="id-register-confirm-password"
            v-model="confirmPassword"
            :toggle-mask="true"
            placeholder="Confirm password"
            :feedback="false"
            :disabled="isLoading"
            :invalid="
              errors['confirmPassword'] && errors['confirmPassword'] !== ''
            "
          >
          </Password>
        </IconField>
        <span v-if="errors['confirmPassword']" class="text-error">{{
          errors["confirmPassword"]
        }}</span>
      </div>
      <div class="w-full h-max pt-7">
        <Button severity="brand" label="Reset Password" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
definePageMeta({
  layout: "auth",
});

const password = ref<string>("");
const confirmPassword = ref<string>("");
const errors = ref<any>({});

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});
const isLoading = ref<boolean>(false);
</script>

<style scoped></style>

<template>
  <div class="flex flex-col w-full h-max max-w-[400px]">
    <p
      class="text-surface-400 font-normal text-center text-sm xl:text-base mb-5"
    >
      Enter your email address to verify and reset password
    </p>
    <form
      @submit.prevent="sendResetPasswordEmailLink"
      class="flex flex-col w-full h-max space-y-5"
    >
      <div class="flex flex-col space-y-2.5">
        <label for="id-login-email" class="form-label">Email Address: </label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="id-login-email"
            v-model="email"
            placeholder="Enter your email address"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['email']" class="text-error">{{
          errors["email"]
        }}</span>
      </div>
      <div class="w-full h-max">
        <Button type="submit" severity="brand" label="Verify email" :loading="isLoading" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { sendPasswordResetEmail } from "firebase/auth";
import * as yup from "yup";
definePageMeta({
  layout: "auth",
});

const { $auth } = useNuxtApp();
const toast = useToast();

const email = ref<string>("");
const errors = ref<any>({});
const isLoading = ref<boolean>(false);

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      email: email.value,
    });
    delete errors.value[field];
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      errors.value[field] = error.message;
    }
  }
};

const validateForm = async () => {
  try {
    await formSchema.validate(
      {
        email: email.value,
      },
      { abortEarly: false }
    );
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((error: any) => {
        errors.value[error.path] = error.message;
      });
    }
    return false;
  }
};

const actionCodeSettings = {
  url: `${window.location.protocol}//${window.location.host}/authentication/reset-password`,
  handleCodeInApp: true
}

const sendResetPasswordEmailLink = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true;
      await sendPasswordResetEmail($auth, email.value, actionCodeSettings)
      toast.add({
        severity: 'success',
        summary: 'Password reset link',
        detail: 'A Password reset link is sent on your email',
        life: 5000
      })
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Unexpected error",
      detail: "An unexpected error occurred. Please try again",
      life: 5000,
    });
  } finally {
    isLoading.value = false
  }
};

watch(
  () => email.value,
  () => validateField("email")
);
</script>

<style scoped></style>

<template>
  <div class="flex flex-col w-full h-max max-w-[400px]">
    <p
      class="text-surface-400 font-normal text-center text-sm xl:text-base mb-5"
    >
      Enter your email address and password to login
    </p>
    <button @click="signInWithGoogle" class="google-btn">
      <img
        class="absolute left-10"
        src="@/assets/icons/google-icon.svg"
        alt=""
      />
      Sign in with Google
    </button>
    <!-- Hoarizontal line and in between text -->
    <div className="flex items-center w-full gap-4.5 my-10">
      <div className="flex-grow h-px bg-blk-30" />
      <h1
        className="text-surface-400 font-semibold text-sm leading-[100%] tracking-normal whitespace-nowrap"
      >
        Or sign in with email
      </h1>
      <div className="flex-grow h-px bg-blk-30" />
    </div>
    <form
      @submit.prevent="handleLoginUser"
      class="flex flex-col w-full h-max space-y-5"
    >
      <div class="flex flex-col space-y-2.5">
        <label for="id-login-email" class="form-label">Email Address: </label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="id-login-email"
            v-model="email"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['email']" class="text-error">{{
          errors["email"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-login-password" class="form-label">Password: </label>
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="id-login-password"
            v-model="password"
            :toggle-mask="true"
            placeholder="Enter your password"
            :feedback="false"
            :disabled="isLoading"
          >
          </Password>
        </IconField>
        <span v-if="errors['password']" class="text-error">{{
          errors["password"]
        }}</span>
      </div>
      <div class="flex items-center justify-end w-full">
        <NuxtLink
          to="/authentication/forgot-password"
          class="text-brand font-semibold text-sm leading-5 underline"
        >
          Forgot password?</NuxtLink
        >
      </div>
      <div class="w-full h-max">
        <Button
          :loading="isLoading"
          type="submit"
          severity="brand"
          label="Login"
        />
      </div>
    </form>
    <p class="text-surface-400 text-center text-sm font-normal mt-2">
      Not a member?
      <NuxtLink
        to="/authentication/register"
        class="text-brand font-semibold underline"
        >Register now!</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { FirebaseError } from "firebase/app";
import {
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import * as yup from "yup";

definePageMeta({
  layout: "auth",
  middleware: "login-signup-client",
});

const toast = useToast();
const router = useRouter();
const { $axios, $auth } = useNuxtApp();
const authStore = useAuthStore();

const email = ref<string>("");
const password = ref<string>("");
const errors = ref<any>({});
const isLoading = ref<boolean>(false);

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      email: email.value,
      password: password.value,
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
        password: password.value,
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

const signinUserInFirebase = async () => {
  try {
    return (await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    ))
      ? true
      : false;
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof FirebaseError) {
      await signOut($auth);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        toast.add({
          severity: "error",
          summary: "Invalid credentials",
          detail: "Please provide valid credentials!",
          life: 5000,
        });
      } else if (error.code === "auth/user-not-found") {
        toast.add({
          severity: "error",
          summary: "Not registered",
          detail: "User is not registered. Please sign up!",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Server error",
          detail: "Something went wrong, Try again",
          life: 5000,
        });
      }
    } else {
      // Optional fallback for non-Firebase errors
      console.error("Unknown error occurred", error);
      toast.add({
        severity: "error",
        summary: "Unexpected error",
        detail: "An unexpected error occurred. Please try again.",
        life: 5000,
      });
    }

    return false;
  }
};

const getUserFromBackend = async () => {
  try {
    const response = await $axios.get("/user/get-user");
    if (response && response.status === 200) {
      return response.data.user;
    } else {
      return null;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Backend error",
      detail: "Something went wrong, Try again",
      life: 5000,
    });
    signOut($auth);
    console.log(error);
    return null;
  }
};

const handleLoginUser = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true;
      const loggedInFirestore = await signinUserInFirebase();
      if (loggedInFirestore) {
        const user = await getUserFromBackend();
        if (user) {
          authStore.setUser(user || null);
          router.push("/user/home");
        } else {
          signOut($auth);
        }
      } else {
        signOut($auth);
      }
    }
  } catch (error) {
    signOut($auth);
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const authenticateWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    return null;
  }
};

const signInWithGoogle = async () => {
  isLoading.value = true;
  const firebaseUser = await authenticateWithGoogle();

  if (!firebaseUser) {
    isLoading.value = false;
    return;
  }

  try {
    const user = await getUserFromBackend();

    if (user) {
      authStore.setUser(user);
      router.push("/user/home");
    } else {
      await signOut($auth);

      toast.add({
        severity: "error",
        summary: "Account not found",
        detail: "Please register before signing in.",
        life: 5000,
      });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    await signOut($auth);
  } finally {
    isLoading.value = false;
  }
};

const fields = {
  email,
  password,
} as any;

Object.keys(fields).forEach((key) => {
  watch(fields[key], () => validateField(key));
});
</script>

<style scoped></style>

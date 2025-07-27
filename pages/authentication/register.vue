<template>
  <div class="flex flex-col w-full h-max max-w-[400px]">
    <p
      class="text-surface-400 font-normal text-center text-sm xl:text-base mb-5"
    >
      Enter following details to create a account.
    </p>
    <button @click="signUpWithGoogle" class="google-btn">
      <img
        class="absolute left-10"
        src="@/assets/icons/google-icon.svg"
        alt=""
      />
      Sign up with Google
    </button>
    <!-- Hoarizontal line and in between text -->
    <div className="flex items-center w-full gap-4.5 my-10">
      <div className="flex-grow h-px bg-blk-30" />
      <h1
        className="text-surface-400 font-semibold text-sm leading-[100%] tracking-normal whitespace-nowrap"
      >
        Or sign up with email
      </h1>
      <div className="flex-grow h-px bg-blk-30" />
    </div>
    <form
      @submit.prevent="handleRegisterUser"
      class="flex flex-col w-full h-full space-y-5"
    >
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-name" class="form-label">Name: </label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="id-register-name"
            v-model="name"
            placeholder="Enter your full name"
            :disabled="isLoading"
            :invalid="errors['name'] && errors['name'] !== ''"
            maxlength="40"
          />
        </IconField>
        <span v-if="errors['name']" class="text-error">{{
          errors["name"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-email" class="form-label">Email: </label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="id-register-email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :disabled="isLoading"
            :invalid="errors['email'] && errors['email'] !== ''"
            maxlength="100"
          />
        </IconField>
        <span v-if="errors['email']" class="text-error">{{
          errors["email"]
        }}</span>
      </div>
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
              <h6 class="text-surface-0 font-semibold text-sm pb-2.5">
                Pick a password
              </h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2.5 text-surface-0 font-semibold text-sm pb-2.5">
                Suggestions
              </p>
              <ul class="pl-2 ml-2 mt-0 list-disc" style="line-height: 1.5">
                <li class="text-sm font-normal text-surface-0">
                  At least one lowercase
                </li>
                <li class="text-sm font-normal text-surface-0">
                  At least one uppercase
                </li>
                <li class="text-sm font-normal text-surface-0">
                  At least one numeric
                </li>
                <li class="text-sm font-normal text-surface-0">
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
      <div class="w-full h-max pt-5">
        <Button
          type="submit"
          :loading="isLoading"
          severity="brand"
          label="Register"
        />
      </div>
    </form>
    <p class="text-surface-400 text-center text-sm font-normal mt-2">
      Already a member?
      <NuxtLink
        to="/authentication/login"
        class="text-brand font-semibold underline"
        >Login!</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { faker } from "@faker-js/faker";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import * as yup from "yup";

definePageMeta({
  layout: "auth",
  middleware: "login-signup-client",
});

const toast = useToast();
const { $axios, $auth } = useNuxtApp();
const router = useRouter();

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const errors = ref<any>({});
const isLoading = ref<boolean>(false);

interface RegisterUser {
  name: string;
  email: string;
  signedUpFrom: "email" | "google";
  firebaseUserId: string;
  avatar?: string;
}

const formSchema = yup.object<RegisterUser>({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 chars are required")
    .max(15, "Maximum 15 chars are allowed"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
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
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
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

const createUserInFirebase = async () => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    const user = userCredentials.user;
    return user;
  } catch (error: any) {
    console.log(error);
    if (error.code === "auth/email-already-in-use") {
      toast.add({
        severity: "error",
        summary: "Email already exists",
        detail: "Email already exists, Try different",
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Server error",
        detail: "Something went wrong, Try again",
        life: 5000,
      });
    }
    return null;
  }
};

const createUserInBackend = async (data: RegisterUser) => {
  try {
    const response = await $axios.post("/auth/register", data);
    if (response && response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log(error);
    if (error?.status === 409) {
      toast.add({
        severity: "error",
        summary: "User already exists",
        detail: "User already registered, please login!",
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Server error",
        detail: "Something went wrong, Try again",
        life: 5000,
      });
    }
    return false;
  }
};

const handleRegisterUser = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true;
      const userCreatedInFirebase = await createUserInFirebase();
      if (userCreatedInFirebase) {
        const payload: RegisterUser = {
          name: name.value,
          email: email.value,
          signedUpFrom: "email",
          firebaseUserId: userCreatedInFirebase.uid,
        };

        const userCreatedInBackend = await createUserInBackend(payload);

        if (userCreatedInBackend) {
          signOut($auth);
          toast.add({
            severity: "success",
            summary: "Registered successfully",
            detail: "Registration successfull, please login",
            life: 8000,
          });
          router.push("/authentication/login");
        } else {
          if ($auth.currentUser) {
            signOut($auth);
          }
        }
      }
    }
  } catch (error: any) {
    signOut($auth);
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Server error",
      detail: "Something went wrong, Try again",
      life: 5000,
    });
  } finally {
    isLoading.value = false;
  }
};

const signUpWithGoogle = async () => {
  try {
    isLoading.value = true;
    const provider = new GoogleAuthProvider();
    signInWithPopup($auth, provider).then(async (result) => {
      const user = result.user;
      if (user) {
        const payload: RegisterUser = {
          name: user.displayName || "",
          email: user.email || "",
          signedUpFrom: "google",
          firebaseUserId: user.uid,
          avatar: user.photoURL || "",
        };

        const userCreatedInBackend = await createUserInBackend(payload);

        if (userCreatedInBackend) {
          signOut($auth);
          toast.add({
            severity: "success",
            summary: "Registered successfully",
            detail: "Registration successfull, please login",
            life: 8000,
          });
          router.push("/authentication/login");
        } else {
          if ($auth.currentUser) {
            signOut($auth);
          }
        }
      }
    });
  } catch (error) {
    signOut($auth);
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

// const createUsers = async () => {
//   try {
//     for (let i = 0; i < 10000; i++) {
//       const name = faker.person.fullName();
//       const email = faker.internet.email();
//       const avatar = faker.image.avatar();
//       const password = "Password@1";

//       const userCredentials = await createUserWithEmailAndPassword(
//         $auth,
//         email,
//         password
//       );
//       const user = userCredentials.user;

//       if (user) {
//         const payload: RegisterUser = {
//           name: name,
//           email: email,
//           signedUpFrom: "email",
//           firebaseUserId: user.uid,
//           avatar: avatar
//         };

//         const userCreatedInBackend = await createUserInBackend(payload);

//         if (userCreatedInBackend) {
//           signOut($auth);
//           toast.add({
//             severity: "success",
//             summary: "Registered successfully",
//             detail: "Registration successfull, please login",
//             life: 8000,
//           });
//           router.push("/authentication/login");
//         } else {
//           if ($auth.currentUser) {
//             signOut($auth);
//           }
//         }
//       }

//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const fields = {
  name,
  email,
  password,
  confirmPassword,
} as any;

Object.keys(fields).forEach((key) => {
  watch(fields[key], () => validateField(key));
});
</script>

<style scoped></style>

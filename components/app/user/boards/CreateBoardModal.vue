<template>
  <Dialog
    :visible="showModal"
    @update:visible="closeModal"
    modal
    header="Create New Board"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="w-full mx-[18px] xl:mx-0 h-auto xl:w-[28em] min-h-[30rem]"
    :draggable="false"
  >
    <form
      @submit.prevent="createBoard"
      class="flex flex-col w-full h-full gap-5 pt-2.5"
    >
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_board_name" class="form-label">Board Name/Title: </label>
        <IconField>
          <InputIcon class="pi pi-table" />
          <InputText
            id="id_board_name"
            v-model="title"
            placeholder="Enter board title"
            :disabled="isLoading"
            :invalid="errors['title'] && errors['title'] !== ''"
            maxlength="40"
          />
        </IconField>
        <span v-if="errors['title']" class="text-error">{{
          errors["title"]
        }}</span>
      </div>
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_board_description" class="form-label"
          >Board Description:
        </label>
        <IconField>
          <InputIcon class="pi pi-align-justify top-[21px]" />
          <Textarea
            id="id_board_description"
            v-model="description"
            placeholder="Enter board description"
            :disabled="isLoading"
            :invalid="errors['description'] && errors['description'] !== ''"
            rows="8"
            maxlength="500"
          />
        </IconField>
        <span v-if="errors['description']" class="text-error">{{
          errors["description"]
        }}</span>
      </div>
      <Button type="submit" severity="brand" label="Create board" />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import * as yup from "yup";
import type { CreateBoardType } from "~/types/types";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  fetchBoards: {
    type: Function,
    required: true
  }
});

const emits = defineEmits(["closeModal"]);
const closeModal = () => emits("closeModal");

const { $axios } = useNuxtApp();
const authStore = useAuthStore();
const toast = useToast();

const title = ref<string>("");
const description = ref<string>("");
const isLoading = ref<boolean>(false);
const errors = ref<any>({});

const formSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      title: title.value,
      description: description.value,
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
        title: title.value,
        description: description.value,
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

const createBoard = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true
      const response = await $axios.post("/board/create", {
        title: title.value,
        description: description.value,
        createdBy: authStore.user?._id,
        sections: [],
        emoji: ""
      } as CreateBoardType);
      if (response && response.status === 201) {
        toast.add({
          severity: "success",
          summary: "Board created",
          detail: "Board has been created successfully",
          life: 5000,
        });
        props.fetchBoards()
        closeModal()
      }
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Unexpected error",
      detail: "An unexpected error occurred. Please try again.",
      life: 5000,
    });
  } finally {
    isLoading.value = false
  }
};

const fields = {
  title,
  description,
} as any;

Object.keys(fields).forEach((key) => {
  watch(fields[key], () => validateField(key));
});
</script>

<style scoped></style>

<template>
  <Dialog
    :visible="showModal"
    @update:visible="closeModal"
    modal
    header="Create New Task"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="w-full mx-[18px] xl:mx-0 h-auto xl:w-[28em] min-h-[30rem]"
    :draggable="false"
  >
    <h1 class="text-lg font-semibold text-surface-300 leading-6 pb-5">
      Section: {{ section?.title || "" }}
    </h1>
    <form
      @submit.prevent="createtask"
      class="flex flex-col w-full h-full gap-5 pt-2.5"
    >
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_task_name" class="form-label">Task Name: </label>
        <IconField>
          <InputIcon class="pi pi-check-circle" />
          <InputText
            id="id_task_name"
            v-model="title"
            placeholder="Enter task title"
            :disabled="isLoading"
            :invalid="errors['title'] && errors['title'] !== ''"
            maxlength="80"
          />
        </IconField>
        <span v-if="errors['title']" class="text-error">{{
          errors["title"]
        }}</span>
      </div>
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_task_description" class="form-label"
          >Task Description:
        </label>
        <IconField>
          <InputIcon class="pi pi-align-justify top-[21px]" />
          <Textarea
            id="id_task_description"
            v-model="description"
            placeholder="Enter task description"
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
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_task_difficulty" class="form-label">Difficulty: </label>
        <IconField>
          <InputIcon class="pi pi-gauge" />
          <Select
            id="id_task_difficulty"
            :options="selectDifficultyOptions"
            option-label="name"
            option-value="code"
            v-model="difficulty"
            placeholder="Select difficulty level"
            :invalid="errors['difficulty'] && errors['difficulty'] !== ''"
            :disabled="isLoading"
            :checkmark="true"
          />
        </IconField>
        <span v-if="errors['difficulty']" class="text-error">{{
          errors["difficulty"]
        }}</span>
      </div>
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_task_priority" class="form-label">Priority: </label>
        <IconField>
          <InputIcon class="pi pi-sort-amount-up" />
          <Select
            id="id_task_priority"
            :options="selectPriorityOptions"
            option-label="name"
            option-value="code"
            v-model="priority"
            placeholder="Select priority"
            :invalid="errors['priority'] && errors['priority'] !== ''"
            :disabled="isLoading"
            :checkmark="true"
          />
        </IconField>
        <span v-if="errors['priority']" class="text-error">{{
          errors["priority"]
        }}</span>
      </div>
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_task_due" class="form-label">Due Date: </label>
        <IconField>
          <InputIcon class="pi pi-calendar" />
          <DatePicker
            input-id="id_task_due"
            v-model="dueDate"
            date-format="dd/mm/yy"
            :min-date="new Date()"
            placeholder="Select due date"
            :invalid="errors['dueDate'] && errors['dueDate'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['dueDate']" class="text-error">{{
          errors["dueDate"]
        }}</span>
      </div>
      <div class="flex flex-col w-full gap-2.5">
        <label for="id_task_assignedTo" class="form-label">Assign To: </label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <Select
            id="id_task_assignedTo"
            :options="users"
            option-label="name"
            option-value="_id"
            v-model="assignedTo"
            placeholder="Select user"
            :invalid="errors['assignedTo'] && errors['assignedTo'] !== ''"
            :disabled="isLoading"
            :checkmark="true"
            :loading="loadingUsers"
            showClear
            filter
            filterPlaceholder="Search a user"
          >
            <template #option="slotProps">
              <div class="flex items-center w-full gap-2.5">
                <img
                  v-if="slotProps.option.avatar"
                  alt="avatar"
                  :src="slotProps.option.avatar"
                  class="min-w-8 min-h-8 w-8 h-8 rounded-full object-cover"
                />
                <div
                  v-else
                  class="min-w-8 min-h-8 w-8 h-8 rounded-full bg-blk-30 border border-surface-800 flex items-center justify-center"
                >
                  <i class="pi pi-user text-surface-400 text-xs"></i>
                </div>
                <div class="flex flex-col w-full h-max">
                  <h1 class="capitalize">{{ slotProps.option.name }}</h1>
                  <p
                    class="text-surface-400 font-normal text-xs leading-3 m-0 lowercase"
                  >
                    {{ slotProps.option.email }}
                  </p>
                </div>
              </div>
            </template>
          </Select>
        </IconField>
        <span v-if="errors['assignedTo']" class="text-error">{{
          errors["assignedTo"]
        }}</span>
      </div>
      <Button type="submit" severity="brand" label="Create task" />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import * as yup from "yup";
import {
  SelectDifficultyValue,
  SelectPriorityValue,
  type CreateTask,
  type SelectOption,
  type User,
} from "~/types/types";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  fetchBoard: {
    type: Function,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  section: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["closeModal"]);
const closeModal = () => {
  emits("closeModal");
};

const { $axios } = useNuxtApp();
const authStore = useAuthStore();
const toast = useToast();
const { startLoading, stopLoading } = useLoading();

const selectDifficultyOptions: SelectOption[] = [
  { name: "Low", code: SelectDifficultyValue.LOW },
  { name: "Medium", code: SelectDifficultyValue.MEDIUM },
  { name: "Hard", code: SelectDifficultyValue.HARD },
];

const selectPriorityOptions: SelectOption[] = [
  { name: "Low", code: SelectPriorityValue.LOW },
  { name: "Medium", code: SelectPriorityValue.MEDIUM },
  { name: "High", code: SelectPriorityValue.HIGH },
];
const users = ref<User[]>([]);

const title = ref<string>("");
const description = ref<string>("");
const assignedTo = ref<string>("");
const dueDate = ref<Date | undefined>(undefined);
const difficulty = ref<string>("");
const priority = ref<string>("");
const attachments = ref([]);
const loadingUsers = ref<boolean>(false);
const errors = ref<any>({});
const isLoading = ref<boolean>(false);

const formSchema = yup.object().shape({
  title: yup.string().required("Task name is required"),
  description: yup.string().required("Task Description is required"),
  difficulty: yup.string().required("Difficulty level is required"),
  priority: yup.string().required("Priority is required"),
});

onMounted(() => {
  fetchUsers();
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      title: title.value,
      description: description.value,
      difficulty: difficulty.value,
      priority: priority.value,
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
        difficulty: difficulty.value,
        priority: priority.value,
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

const createtask = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true;
      startLoading();
      const response = await $axios.post("/task/create", {
        title: title.value,
        description: description.value,
        difficulty: difficulty.value,
        priority: priority.value,
        createdBy: authStore.user?._id,
        assignedTo: assignedTo.value,
        dueDate: dueDate.value || "",
        attachments: attachments.value || [],
        board: props.boardId,
        section: props.section._id,
      } as CreateTask);
      if (response && response.status === 200) {
        props.fetchBoard();
        resetForm();
        closeModal();
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
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
    stopLoading();
  }
};

const fetchUsers = async () => {
  try {
    loadingUsers.value = true;
    const response = await $axios.get("/user/get-users");
    if (response && response.status === 200) {
      users.value = response.data.users || [];
    } else {
      throw new Error("An unexpected error occurred. Please try again");
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
    loadingUsers.value = false;
  }
};

const resetForm = () => {
  title.value = "";
  description.value = "";
  difficulty.value = "";
  priority.value = "";
  assignedTo.value = "";
  dueDate.value = undefined;
  attachments.value = [];
  errors.value = {};
};

const fields = {
  title,
  description,
  difficulty,
  priority,
} as any;

Object.keys(fields).forEach((key) => {
  watch(fields[key], () => validateField(key));
});
</script>

<style scoped></style>

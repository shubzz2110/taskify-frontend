<template>
  <div class="flex-1 w-full h-full max-w-[40%] p-5">
    <h1 class="text-surface-0 font-medium text-2xl">Discussion</h1>
    <form @submit.prevent="" method="post" class="py-5 flex flex-col gap-y-5">
      <IconField>
        <InputIcon class="pi pi-align-justify top-[21px]" />
        <Textarea
          id="id_board_description"
          v-model="discussionContent"
          placeholder="Add a comment. Use @ to mention a person"
          :disabled="isLoading"
          class="w-full h-full min-h-40 max-h-40 bg-blk-80"
          :invalid="
            errors['discussionContent'] && errors['discussionContent'] !== ''
          "
        />
      </IconField>
      <div class="flex items-center gap-2.5 justify-end">
        <Button label="Save" severity="brand" class="w-max px-7" />
      </div>
    </form>
    <div class="flex flex-col w-full h-full gap-5">
      <div class="p-5 rounded-md shadow-md shadow-black flex flex-col gap-2.5 w-full h-max bg-blk-80">
        <div class="flex items-center gap-5">
          <div class="flex items-center gap-2.5">
            <User :user="{}" avatar-class="!bg-blk-30" text-classes="!font-bold" />
            <h1 class="text-surface-0 font-light text-xs leading-3">Commented : 17-08-2025 at 08:25 AM</h1>
          </div>
        </div>
        <p class="text-surface-0 font-light text-base leading-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa reprehenderit assumenda magni neque nisi quam soluta, pariatur tempora corporis laudantium vero quos accusamus odio omnis, harum molestiae voluptas excepturi maxime doloribus eaque cupiditate beatae odit qui at! Facere modi alias voluptates atque, sit odit aut dolores accusamus, voluptatum voluptatibus officiis!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import User from './User.vue';

const discussionContent = ref<string>("");
const isLoading = ref<boolean>(false);
const errors = {} as any;
</script>

<style scoped>
.editor {
  @apply max-h-[200px];
}
</style>

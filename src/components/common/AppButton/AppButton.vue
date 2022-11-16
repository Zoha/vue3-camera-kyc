<script lang="ts" setup>
const emit = defineEmits(["click"]);
const props = defineProps<{
  isLoading?: boolean;
}>();

function onClick() {
  if (props.isLoading) {
    return;
  }
  emit("click");
}
</script>

<template>
  <div
    class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer inline-block rounded-lg relative overflow-hidden"
    @click="onClick"
  >
    <div
      v-if="props.isLoading"
      class="absolute w-full h-full left-0 top-0 bg-gray-400 z-10"
    >
      ...
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import AppButton from "../AppButton/AppButton.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

const emit = defineEmits<{
  (e: "click"): void;
}>();

const counter = ref<number>(0);
const timeoutInstance = ref<ReturnType<typeof setTimeout>>();

function decreaseCounter() {
  counter.value--;
  if (counter.value > 0) {
    timeoutInstance.value = setTimeout(decreaseCounter, 1000);
  } else {
    emit("click");
  }
}

function startDecreasingCounter() {
  counter.value = 60;
  decreaseCounter();
}

onMounted(() => {
  startDecreasingCounter();
});

onBeforeUnmount(() => {
  if (timeoutInstance.value) {
    clearTimeout(timeoutInstance.value);
  }
});
</script>

<template>
  <AppButton class="bg-red-500 hover:bg-red-400 my-2" @click="emit('click')">
    Stop Recording ({{ counter }})
  </AppButton>
</template>

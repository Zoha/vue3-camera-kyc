<script lang="ts" setup>
import AppButton from "../AppButton/AppButton.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

const emit = defineEmits<{
  (e: "click"): void;
  (e: "progress", percent: number): void;
}>();

const counterTime = 120;
const counter = ref<number>(0);
const timeoutInstance = ref<ReturnType<typeof setTimeout>>();

function decreaseCounter() {
  counter.value--;
  const percent = 100 - (counter.value * 100) / counterTime;
  emit("progress", percent);
  if (counter.value > 0) {
    timeoutInstance.value = setTimeout(decreaseCounter, 500);
  } else {
    emit("click");
  }
}

function startDecreasingCounter() {
  counter.value = counterTime;
  emit("progress", 0);
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
    Stop Recording ({{ Math.floor(counter / 2) }})
  </AppButton>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const props = defineProps<{ width?: number }>();

const emit = defineEmits<{
  (e: "init", el: HTMLCanvasElement | undefined): void;
}>();

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  emit("init", canvas.value);
});
</script>

<template>
  <canvas
    ref="canvas"
    :style="{ width: props.width + 'px' }"
    class="mx-auto max-w-full h-auto"
  />
</template>

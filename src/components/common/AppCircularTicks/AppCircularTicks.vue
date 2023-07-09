<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const ticksCanvas = ref<HTMLCanvasElement>();
const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    percent?: number;
  }>(),
  {
    width: 800,
    height: 800,
    percent: 0,
  }
);
const totalTicks = 120;

function drawTicksWithColor() {
  const ctx = ticksCanvas.value?.getContext("2d");
  if (!ctx) {
    return;
  }
  const centerX = props.width / 2;
  const centerY = props.height / 2;
  const radius = props.width / 2 - 20;
  const numTicks = totalTicks + 1;
  const angle = (2 * Math.PI) / numTicks;
  const numColoredTicks = Math.floor((numTicks * props.percent) / 100);
  ctx.clearRect(0, 0, props.width, props.height);

  for (let i = 0; i < numTicks; i++) {
    const tickAngle = i * angle - Math.PI / 2;
    const x1 = centerX + Math.cos(tickAngle) * radius;
    const y1 = centerY + Math.sin(tickAngle) * radius;
    const x2 = centerX + Math.cos(tickAngle) * (radius - 20);
    const y2 = centerY + Math.sin(tickAngle) * (radius - 20);

    if (i < numColoredTicks) {
      ctx.strokeStyle = "rgba(0,152,150,1)";
    } else {
      ctx.strokeStyle = "rgba(255,255,255,.3)";
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

watch(() => props.width, drawTicksWithColor);
watch(() => props.height, drawTicksWithColor);
watch(() => props.percent, drawTicksWithColor);

onMounted(() => {
  drawTicksWithColor();
});
</script>

<template>
  <canvas
    class="absolute top-0 bottom-0 right-0 left-0 m-auto"
    ref="ticksCanvas"
    :width="width"
    :height="height"
  />
</template>

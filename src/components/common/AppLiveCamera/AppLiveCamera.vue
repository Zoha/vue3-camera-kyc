<script lang="ts" setup>
import { StreamProvider } from "@/constants";
import type { StreamProviderInjection } from "@/customTypes";
import { inject, onMounted, ref, watch } from "vue";

const emit = defineEmits<{
  (e: "init", el: HTMLVideoElement | undefined): void;
}>();

const { stream, devices, selectDeviceToStream, selectedDevice } =
  inject<StreamProviderInjection>(
    StreamProvider,
    {} as StreamProviderInjection
  );

const video = ref<HTMLVideoElement>();
const videoContainer = ref<HTMLDivElement>();

function configureVideoWidthStyle() {
  const videoEl = video.value;
  if (!videoEl || !videoContainer.value) {
    return;
  }
  const streamWidth = videoEl.videoWidth;
  const streamHeight = videoEl.videoHeight;
  const isWidthBigger = streamWidth > streamHeight;
  let targetWidth = 0;
  let targetHeight = 0;
  const maximumHeight = window.innerHeight - 200; // 80 percent of height
  if (isWidthBigger) {
    targetWidth = videoContainer.value?.clientWidth ?? 0;
    targetHeight = (streamHeight / streamWidth) * targetWidth;
    if (targetHeight > maximumHeight) {
      targetHeight = maximumHeight;
      targetWidth = (streamWidth / streamHeight) * targetHeight;
    }
  } else {
    targetHeight = streamHeight > maximumHeight ? maximumHeight : streamHeight;
    targetWidth = (streamWidth / streamHeight) * targetHeight;
  }

  videoEl.width = targetWidth;
  videoEl.height = targetHeight;
}

async function updateVideoPlayerStream() {
  const videoEl = video.value;
  if (!videoEl) {
    return;
  }
  videoEl.srcObject = stream.value ?? null;
  await videoEl.play();
  configureVideoWidthStyle();
  // retry to be sure video is initialized
  // sometimes on ios it is not available at first
  setTimeout(() => {
    configureVideoWidthStyle();
  }, 500);
}

watch(stream, async () => {
  updateVideoPlayerStream();
});

function updateSelectedStreamTrack(e: Event) {
  const optionsVal = (e.target as HTMLOptionElement).value;
  const newDevice = devices.value.find((i) => i.deviceId === optionsVal);
  if (newDevice) {
    selectDeviceToStream(newDevice);
  }
}

onMounted(() => {
  emit("init", video.value);
});
</script>

<template>
  <div v-show="stream" ref="videoContainer" class="relative">
    <div class="absolute flex justify-center w-full pt-3 z-10">
      <select
        @change="updateSelectedStreamTrack"
        :value="selectedDevice?.deviceId"
        class="p-2 rounded-xl outline-0 border border-gray-600 bg-transparent text-white"
      >
        <option
          v-for="option in devices"
          :key="option.deviceId"
          :value="option.deviceId"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <video ref="video" width="0" height="0" class="mx-auto block" muted />
  </div>
</template>

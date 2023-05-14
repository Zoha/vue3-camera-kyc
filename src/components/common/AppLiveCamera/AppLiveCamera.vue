<script lang="ts" setup>
import { StreamProvider } from "@/constants";
import type { StreamProviderInjection } from "@/customTypes";
import { inject, onMounted, ref, watch } from "vue";

const emit = defineEmits<{
  (e: "init", el: HTMLVideoElement | undefined): void;
}>();

const props = withDefaults(
  defineProps<{
    isRecording?: boolean;
  }>(),
  {
    isRecording: false,
  }
);

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
  videoEl.playsInline = true;
  videoEl.srcObject = stream.value ?? null;
  await videoEl.play();
  configureVideoWidthStyle();
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
    <div
      v-show="!isRecording"
      class="absolute flex justify-center w-full pt-3 z-10"
    >
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
    <div
      v-if="props.isRecording"
      class="absolute right-0 left-0 bottom-0 mb-3 mx-auto animate-ping w-2 h-2 rounded-full bg-red-500"
    />
    <video
      ref="video"
      height="800"
      class="mx-auto block outline-red-500"
      :class="{ 'outline outline-2': isRecording }"
      muted
    />
  </div>
</template>

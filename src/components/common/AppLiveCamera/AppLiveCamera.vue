<script lang="ts" setup>
import { StreamProvider } from "@/constants";
import type { StreamProviderInjection } from "@/customTypes";
import { inject, onMounted, ref, watch } from "vue";
import AppCircularTicks from "@/components/common/AppCircularTicks/AppCircularTicks.vue";

const emit = defineEmits<{
  (e: "init", el: HTMLVideoElement | undefined): void;
  (e: "videoSizeChange", width: number, height: number): void;
}>();

const props = withDefaults(
  defineProps<{
    isRecording?: boolean;
    isCircle?: boolean;
    videoLengthProgressPercent: number;
  }>(),
  {
    isRecording: false,
    isCircle: false,
    videoLengthProgressPercent: 0,
  }
);

const { stream, devices, selectDeviceToStream, selectedDevice } =
  inject<StreamProviderInjection>(
    StreamProvider,
    {} as StreamProviderInjection
  );

const video = ref<HTMLVideoElement>();
const videoAndSelectContainer = ref<HTMLDivElement>();
const videoElContainer = ref<HTMLDivElement>();
const videoWidth = ref<number>(0);
const videoHeight = ref<number>(0);

function configureVideoWidthStyle() {
  const videoEl = video.value;
  if (!videoEl || !videoAndSelectContainer.value) {
    return;
  }
  const streamWidth = videoEl.videoWidth;
  const streamHeight = videoEl.videoHeight;
  const isWidthBigger = streamWidth > streamHeight;
  let targetWidth = 0;
  let targetHeight = 0;
  const maximumHeight = window.innerHeight - 300; // 80 percent of height
  const maximumWidth = window.innerWidth - 150;
  if (isWidthBigger) {
    targetWidth = videoAndSelectContainer.value?.clientWidth ?? 0;
    targetHeight = (streamHeight / streamWidth) * targetWidth;
    if (targetHeight > maximumHeight) {
      targetHeight = maximumHeight;
      targetWidth = (streamWidth / streamHeight) * targetHeight;
    }
  } else {
    targetHeight = streamHeight > maximumHeight ? maximumHeight : streamHeight;
    targetWidth = (streamWidth / streamHeight) * targetHeight;
    if (targetWidth > maximumWidth) {
      targetWidth = maximumWidth;
      targetHeight = (streamHeight / streamWidth) * targetWidth;
    }
  }

  videoEl.width = targetWidth;
  videoEl.height = targetHeight;

  if (props.isCircle && videoElContainer.value) {
    if (targetWidth > targetHeight) {
      videoElContainer.value.style.width = targetHeight + "px";
      videoElContainer.value.style.height = targetHeight + "px";
      videoWidth.value = targetHeight;
      videoHeight.value = targetHeight;
      emit("videoSizeChange", targetHeight, targetHeight);
    } else {
      videoElContainer.value.style.width = targetWidth + "px";
      videoElContainer.value.style.height = targetWidth + "px";
      videoWidth.value = targetWidth;
      videoHeight.value = targetWidth;
      emit("videoSizeChange", targetWidth, targetWidth);
    }
  } else {
    emit("videoSizeChange", targetWidth, targetHeight);
  }
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
  <div v-show="stream" ref="videoAndSelectContainer" class="relative">
    <div
      v-show="!isRecording"
      class="absolute flex justify-center w-full pt-3 z-10 left-0 right-0 mx-auto max-w-[160px]"
      :class="{
        'mt-10': isCircle,
      }"
    >
      <select
        @change="updateSelectedStreamTrack"
        :value="selectedDevice?.deviceId"
        class="p-2 rounded-xl outline-0 border border-gray-600 bg-transparent text-white w-full"
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
      class="absolute right-0 left-0 bottom-0 mb-3 mx-auto animate-ping w-2 h-2 bg-red-500"
      :class="{ 'rounded-full': isCircle }"
    />
    <div
      ref="videoElContainer"
      class="video-container overflow-hidden m-auto"
      :class="{ 'my-5 rounded-full': isCircle }"
    >
      <video
        ref="video"
        height="800"
        class="mx-auto block outline-red-500 object-cover w-full h-full"
        :class="{ 'outline outline-2': isRecording }"
        muted
      />
    </div>
    <AppCircularTicks
      v-if="isCircle"
      :width="videoWidth + 20"
      :height="videoHeight + 20"
      :percent="videoLengthProgressPercent"
    />
  </div>
</template>

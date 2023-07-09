<script lang="ts" setup>
import AppImageCanvas from "@/components/common/AppImageCanvas/AppImageCanvas.vue";
import { StreamProvider } from "@/constants";
import type { StreamProviderInjection } from "@/customTypes";
import { inject, ref, computed } from "vue";
import AppButton from "../AppButton/AppButton.vue";
import AppLiveCamera from "../AppLiveCamera/AppLiveCamera.vue";
import AppRequestCameraButton from "../AppRequestCameraButton/AppRequestCameraButton.vue";
import { dataURIToBlob } from "@/utils/dataURIToBlob";
import { uploadImage } from "@/services/imageServices";
import { useNotification } from "@kyvg/vue3-notification";
import AppNationalCardMask from "../AppNationalCardMask/AppNationalCardMask.vue";

const actionText = (window as unknown as { actionText: string })
  .actionText as string;

const canvasEl = ref<HTMLCanvasElement>();
const videoEl = ref<HTMLVideoElement>();
const imageCaptured = ref(false);
const sendingImage = ref(false);
const { stream } = inject(StreamProvider, {} as StreamProviderInjection);
const ctx = computed(() => {
  return canvasEl.value?.getContext("2d");
});

const { notify } = useNotification();

function drawImage() {
  const video = videoEl.value;
  if (!video) {
    return;
  }
  imageCaptured.value = true;
  const maskEl = document.getElementById("camera-mask-image");
  const maskedWidth =
    (maskEl?.clientWidth || 0) + (maskEl?.clientWidth || 0) / 4;
  const maskedHeight =
    (maskEl?.clientHeight || 0) + (maskEl?.clientHeight || 0) / 4;
  const canvasWidth = maskedWidth * 3;
  const canvasHeight = maskedHeight * 3;
  canvasEl.value?.setAttribute("width", canvasWidth.toString());
  canvasEl.value?.setAttribute("height", canvasHeight.toString());

  const coefficientForW = video.videoWidth / video.width;
  const coefficientForH = video.videoHeight / video.height;

  const maskStartPointX = video.width / 2 - maskedWidth / 2;
  const maskStartPointY = video.height / 2 - maskedHeight / 2;

  ctx.value?.drawImage(
    video,
    maskStartPointX * coefficientForW,
    maskStartPointY * coefficientForH,
    maskedWidth * coefficientForW,
    maskedHeight * coefficientForH,
    0,
    0,
    canvasWidth,
    canvasHeight
  );
}

function onVideoElInit(vEl: HTMLVideoElement | undefined) {
  if (!vEl) {
    return;
  }
  videoEl.value = vEl;
}

function onCanvasElInit(cEl: HTMLCanvasElement | undefined) {
  if (!cEl) {
    return;
  }
  canvasEl.value = cEl;
}

function onTryAgainClick() {
  imageCaptured.value = false;
}

async function submitImage() {
  try {
    sendingImage.value = true;
    const imageDataUrl = canvasEl.value?.toDataURL("image/jpeg") ?? "";
    const blob = dataURIToBlob(imageDataUrl);
    await uploadImage(blob);
  } catch (e) {
    notify({
      title: "Error",
      type: "error",
      text: "there was an error in sending",
    });
  } finally {
    sendingImage.value = false;
  }
}
const rulesTitleText = (window as any).rulesTitleText;
const rulesText = (window as any).rulesText;
</script>

<template>
  <div>
    <div v-if="!stream">
      <div class="text-center">
        <mdicon
          name="accountCircle"
          class="inline-block text-gray-300"
          size="128"
        />
      </div>
      <div class="text-gray-500">
        {{ rulesTitleText }}
      </div>
      <div
        class="bg-cyan-50 w-full my-8 p-4 border border-cyan-200 text-gray-500 flex space-x-2 space-x-reverse"
      >
        <div>
          <mdicon name="alertCircle" size="32" class="text-primary-green-500" />
        </div>
        <div class="flex flex-col space-y-4">
          <p v-for="(rule, index) in rulesText" :key="index" v-text="rule"></p>
        </div>
      </div>
      <div class="flex items-center justify-center mt-4">
        <AppRequestCameraButton with-audio class="m-auto grow" />
      </div>
    </div>
    <div v-show="stream">
      <div class="relative inline-block text-center my-5">
        <AppLiveCamera v-show="!imageCaptured" @init="onVideoElInit" />
        <AppNationalCardMask v-if="!imageCaptured" />
      </div>
      <p v-if="!imageCaptured" class="py-4">{{ actionText }}</p>

      <AppImageCanvas
        v-show="imageCaptured"
        :width="videoEl?.width"
        @init="onCanvasElInit"
      />

      <AppButton
        v-if="!imageCaptured"
        @click="drawImage"
        class="my-2 w-full text-center"
      >
        گرفتن عکس
      </AppButton>
      <template v-else>
        <div
          v-if="!sendingImage"
          class="text-center cursor-pointer text-gray-800 hover:text-gray-600 py-2 hover:underline w-full"
          @click="onTryAgainClick"
        >
          تلاش دوباره
        </div>
        <AppButton
          @click="submitImage"
          :is-loading="sendingImage"
          class="my-2 bg-green-500 hover:bg-green-600 w-full text-center"
        >
          ارسال تصویر
        </AppButton>
      </template>
    </div>
  </div>
</template>

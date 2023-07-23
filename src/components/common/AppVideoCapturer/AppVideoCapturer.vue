<script lang="ts" setup>
import { StreamProvider } from "@/constants";
import type { StreamProviderInjection } from "@/customTypes";
import { inject, ref } from "vue";
import AppButton from "../AppButton/AppButton.vue";
import AppLiveCamera from "../AppLiveCamera/AppLiveCamera.vue";
import AppRequestCameraButton from "../AppRequestCameraButton/AppRequestCameraButton.vue";
import { uploadVideo } from "@/services/videoService";
import { useNotification } from "@kyvg/vue3-notification";
import AppStopRecordingButton from "../AppStopRecordingButton/AppStopRecordingButton.vue";

enum RecordingStates {
  NOT_RECORDED,
  RECORDING,
  RECORDED,
}

const videoEl = ref<HTMLVideoElement>();
const { stream } = inject(StreamProvider, {} as StreamProviderInjection);
const recordingStatus = ref<RecordingStates>(RecordingStates.NOT_RECORDED);
const mediaRecorder = ref<MediaRecorder>();
const recorderBlobs = ref<Blob[]>([]);
const recordedVideo = ref<string>("");
const isSendingVideo = ref(false);
const videoWidth = ref(0);
const videoHeight = ref(0);
const videoLengthProgressPercent = ref(0);
const previewPlayer = ref<HTMLVideoElement>();
const isPlaying = ref(false);

const { notify } = useNotification();

function onVideoElInit(vEl: HTMLVideoElement | undefined) {
  if (!vEl) {
    return;
  }
  videoEl.value = vEl;
}

function onRecorderDataAvailable(e: { data: Blob }) {
  recorderBlobs.value.push(e.data);
}

function onRecorderStop() {
  recordedVideo.value = URL.createObjectURL(
    new Blob(recorderBlobs.value, { type: "video/mp4" })
  );
  recordingStatus.value = RecordingStates.RECORDED;
}

function startRecording() {
  if (!stream.value) {
    return;
  }
  recordedVideo.value = "";
  recorderBlobs.value = [];
  recordingStatus.value = RecordingStates.RECORDING;
  mediaRecorder.value = new MediaRecorder(stream.value, {
    mimeType: "video/mp4",
  });
  mediaRecorder.value.ondataavailable = onRecorderDataAvailable;
  mediaRecorder.value.start(350);
}

function onTryAgainClick() {
  videoLengthProgressPercent.value = 0;
  recordingStatus.value = RecordingStates.NOT_RECORDED;
  if (previewPlayer.value) {
    previewPlayer.value.currentTime = 0;
    isPlaying.value = false;
  }
}

function onStopClick() {
  mediaRecorder.value?.stop();
  onRecorderStop();
}

async function sendVideo() {
  try {
    isSendingVideo.value = true;
    const blob = new Blob(recorderBlobs.value, {
      type: "video/mp4",
    });
    await uploadVideo(blob);
  } catch (e) {
    notify({
      title: "Error",
      type: "error",
      text: "there was an error in sending",
    });
  } finally {
    isSendingVideo.value = false;
  }
}

function updateVideoLengthProgressPercent(percent: number) {
  videoLengthProgressPercent.value = percent;
}

function videoSizeChangeHandler(width: number, height: number) {
  videoWidth.value = width;
  videoHeight.value = height;
}

function onTogglePlayClick() {
  if (!previewPlayer.value) {
    return;
  }
  if (isPlaying.value) {
    previewPlayer.value.pause();
    isPlaying.value = false;
  } else {
    previewPlayer.value.currentTime = 0;
    previewPlayer.value.play();
    isPlaying.value = true;
  }
}

const rulesTitleText = (window as any).rulesTitleText;
const rulesText = (window as any).rulesText;
const actionText = (window as any).actionText;
const videoText = (window as any).videoText;
</script>

<template>
  <div class="text-right">
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
      <AppLiveCamera
        v-show="recordingStatus !== RecordingStates.RECORDED"
        is-circle
        :is-recording="recordingStatus == RecordingStates.RECORDING"
        :videoLengthProgressPercent="videoLengthProgressPercent"
        @init="onVideoElInit"
        @videoSizeChange="videoSizeChangeHandler"
      />
      <div
        v-if="recordingStatus === RecordingStates.RECORDED"
        class="flex justify-center"
      >
        <div
          class="inline-block rounded-full overflow-hidden relative cursor-pointer w-full my-5"
          :style="{ width: videoWidth + 'px', height: videoHeight + 'px' }"
        >
          <video
            ref="previewPlayer"
            class="mx-auto w-full h-full object-cover"
            :width="videoWidth"
            :height="videoHeight"
            :controls="false"
            :src="recordedVideo"
          />
          <mdicon
            :name="isPlaying ? 'pause' : 'play'"
            class="text-white absolute top-0 left-0 right-0 bottom-0 m-auto w-12 h-12"
            size="48"
            @click="onTogglePlayClick"
          />
        </div>
      </div>

      <div
        v-if="
          [RecordingStates.NOT_RECORDED, RecordingStates.RECORDING].includes(
            recordingStatus
          )
        "
        class="py-4"
      >
        <div class="text-gray-500">
          {{ actionText }}
        </div>
        <div class="bg-gray-50 w-full my-8 p-4 border text-gray-500">
          <p v-text="videoText"></p>
        </div>
      </div>

      <!-- start recording -->
      <AppButton
        v-if="recordingStatus === RecordingStates.NOT_RECORDED"
        class="my-2 w-full text-center"
        @click="startRecording"
      >
        شروع ضبط
      </AppButton>
      <AppStopRecordingButton
        v-if="recordingStatus === RecordingStates.RECORDING"
        @progress="updateVideoLengthProgressPercent"
        @click="onStopClick"
      />
      <div
        v-if="recordingStatus === RecordingStates.RECORDED && !isSendingVideo"
        class="text-center cursor-pointer text-gray-800 hover:text-gray-600 py-2 hover:underline my-2"
        @click="onTryAgainClick"
      >
        تلاش دوباره
      </div>
      <!-- send video -->
      <AppButton
        v-if="recordingStatus === RecordingStates.RECORDED"
        :is-loading="isSendingVideo"
        class="my-2 bg-green-500 hover:bg-green-600 w-full text-center"
        @click="sendVideo"
      >
        ارسال ویدیو
      </AppButton>
    </div>
  </div>
</template>

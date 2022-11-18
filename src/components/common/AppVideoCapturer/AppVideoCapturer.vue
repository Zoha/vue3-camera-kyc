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
    new Blob(recorderBlobs.value, { type: "video/webm" })
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
    mimeType: "video/webm",
  });
  mediaRecorder.value.ondataavailable = onRecorderDataAvailable;
  mediaRecorder.value.start(350);
}

function onTryAgainClick() {
  recordingStatus.value = RecordingStates.NOT_RECORDED;
}

function onStopClick() {
  mediaRecorder.value?.stop();
  onRecorderStop();
}

async function sendVideo() {
  try {
    isSendingVideo.value = true;
    const blob = new Blob(recorderBlobs.value, {
      type: "video/webm",
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
</script>

<template>
  <div class="text-center">
    <div v-if="!stream" class="flex items-center justify-center h-screen">
      <AppRequestCameraButton with-audio class="m-auto" />
    </div>
    <div v-show="stream">
      <AppLiveCamera
        v-show="recordingStatus !== RecordingStates.RECORDED"
        :is-recording="recordingStatus == RecordingStates.RECORDING"
        @init="onVideoElInit"
      />
      <video
        v-if="recordingStatus === RecordingStates.RECORDED"
        ref="previewPlayer"
        class="mx-auto"
        :width="videoEl?.width"
        :height="videoEl?.height"
        controls
        :src="recordedVideo"
      />
      <!-- start recording -->
      <AppButton
        v-if="recordingStatus === RecordingStates.NOT_RECORDED"
        class="my-2"
        @click="startRecording"
      >
        Start Recording
      </AppButton>
      <AppStopRecordingButton
        v-if="recordingStatus === RecordingStates.RECORDING"
        @click="onStopClick"
      />
      <div
        v-if="recordingStatus === RecordingStates.RECORDED && !isSendingVideo"
        class="text-center cursor-pointer text-gray-800 hover:text-gray-600 py-2 hover:underline my-2"
        @click="onTryAgainClick"
      >
        Try again
      </div>
      <!-- send video -->
      <AppButton
        v-if="recordingStatus === RecordingStates.RECORDED"
        :is-loading="isSendingVideo"
        class="my-2 bg-green-500 hover:bg-green-600"
        @click="sendVideo"
      >
        Send Video
      </AppButton>
    </div>
  </div>
</template>

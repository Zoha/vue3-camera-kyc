<script setup lang="ts">
import { provide, readonly, ref } from "vue";
import type { StreamProviderInjection } from "@/customTypes";
import { StreamProvider } from "@/constants";

const stream = ref<MediaStream>();
const devices = ref<MediaDeviceInfo[]>([]);
const selectedDevice = ref<MediaDeviceInfo>();

function updateStream(newValue: MediaStream) {
  stream.value = newValue;
}

function stopCurrentSelectedStreamTracks() {
  stream.value?.getTracks().forEach((track) => {
    track.stop();
  });
}

// select stream -> default select by facing mode priority
async function selectDeviceToStream(
  deviceInfo: MediaDeviceInfo,
  withAudio = false
) {
  try {
    stopCurrentSelectedStreamTracks();
    selectedDevice.value = devices.value.find(
      (i) => i.deviceId === deviceInfo.deviceId
    );
    const cons = {
      video: deviceInfo.deviceId
        ? {
            deviceId: { exact: deviceInfo.deviceId },
          }
        : { facingMode: "environment" },
      audio: withAudio,
    };
    let stream = await navigator.mediaDevices.getUserMedia(cons);
    updateStream(stream);
  } catch (e) {
    console.error((e as Error).message);
  }
}

async function updateDevicesList(withAudio = false): Promise<void> {
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  const videoInputs = allDevices.filter(
    (device) => device.kind === "videoinput"
  );
  if (!videoInputs.length) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return updateDevicesList(withAudio);
  }
  devices.value = videoInputs;
  selectDeviceToStream(devices.value[0], withAudio);
}

async function requestForStream(withAudio = false) {
  return updateDevicesList(withAudio);
}

provide(StreamProvider, {
  requestForStream,
  selectDeviceToStream,
  stream: readonly(stream),
  devices: readonly(devices),
  selectedDevice: readonly(selectedDevice),
} as StreamProviderInjection);
</script>

<template>
  <slot />
</template>

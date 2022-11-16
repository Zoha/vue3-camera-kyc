import type { DeepReadonly, Ref } from "vue";

export interface StreamProviderInjection {
  requestForStream(widthAudio?: boolean): Promise<void>;
  selectDeviceToStream(deviceInfo: MediaDeviceInfo): Promise<void>;
  stream: DeepReadonly<Ref<MediaStream | undefined>>;
  devices: DeepReadonly<Ref<MediaDeviceInfo[]>>;
  selectedDevice: DeepReadonly<Ref<MediaDeviceInfo | undefined>>;
}

export interface ApiResponse {
  status: boolean;
  redirectUrl?: string;
}

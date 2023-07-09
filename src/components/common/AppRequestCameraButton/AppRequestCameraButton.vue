<script lang="ts" setup>
import type { StreamProviderInjection } from "@/customTypes";
import { StreamProvider } from "@/constants";
import { inject } from "vue";
import AppButton from "../AppButton/AppButton.vue";

const props = withDefaults(
  defineProps<{
    withAudio?: boolean;
  }>(),
  {
    withAudio: false,
  }
);

const { requestForStream } = inject<StreamProviderInjection>(
  StreamProvider,
  {} as StreamProviderInjection
);
</script>

<template>
  <AppButton @click="requestForStream(props.withAudio)" class="text-center">
    <slot> شروع</slot>
  </AppButton>
</template>

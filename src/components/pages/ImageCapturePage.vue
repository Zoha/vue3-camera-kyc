<script lang="ts" setup>
import AppLayout from "../common/AppLayout/AppLayout.vue";
import AppStreamContainer from "../common/AppStreamContainer/AppStreamContainer.vue";
import AppImageCapturer from "../common/AppImageCapturer/AppImageCapturer.vue";
</script>

<template>
  <AppStreamContainer>
    <AppLayout>
      <AppImageCapturer />
    </AppLayout>
  </AppStreamContainer>
</template>

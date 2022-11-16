<script lang="ts" setup>
import AppLayout from "../common/AppLayout/AppLayout.vue";
import AppStreamContainer from "../common/AppStreamContainer/AppStreamContainer.vue";
import AppVideoCapturer from "../common/AppVideoCapturer/AppVideoCapturer.vue";
</script>

<template>
  <AppStreamContainer>
    <AppLayout>
      <AppVideoCapturer />
    </AppLayout>
  </AppStreamContainer>
</template>

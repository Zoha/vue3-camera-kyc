<script lang="ts" setup>
const isForBack = (window as unknown as { isForCardBack: boolean })
  .isForCardBack as boolean;
const imagePath = isForBack ? "/back-mask.svg" : "/front-mask.svg";
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full flex items-center">
    <div
      class="w-full bg-clip-content flex items-center justify-center lg:border-[100px] md:border-[60px] border-[20px] border-gray-800/70 p-4 lg:after:hidden after:w-full after:h-[25%] after:absolute after:bg-gray-800/70 after:top-0 after:left-0 lg:before:hidden before:w-full before:h-[25%] before:absolute before:bg-gray-800/70 before:bottom-0 before:left-0 lg:h-auto h-1/2"
    >
      <img
        id="camera-mask-image"
        :src="imagePath"
        alt="front-mask"
        class="w-full bg-transparent"
      />
    </div>
  </div>
</template>

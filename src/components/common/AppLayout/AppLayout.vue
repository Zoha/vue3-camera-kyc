<script setup lang="ts">
const cardTitleText = (window as any).cardTitleText;
const changeMethodUrl = (window as any).changeMethodUrl;
</script>

<template>
  <div class="lg:w-10/12 w-full px-8 mx-auto my-10">
    <notifications position="bottom right" />
    <div class="text-center pt-6">
      <a href="/">
        <img src="/logo.png" class="inline-block" alt="logo image" />
      </a>
    </div>
    <div class="my-10 border max-w-lg mx-auto p-6">
      <div class="border-b flex justify-between py-3">
        <div class="font-bold text-xl">{{ cardTitleText }}</div>
        <a :href="changeMethodUrl" class="text-primary-green-500">
          <div>تغییر روش</div>
        </a>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<template>
  <div
    class="absolute transform lg:scale-1 scale-90 w-[340px] lg:w-[410px] h-[240px] top-0 bottom-0 left-0 lg:right-0 m-auto"
  >
    <div class="relative p-4">
      <div
        class="inline-flex border-4 border-blue-500 rounded-lg first-letter:space-x-10 items-center justify-between p-2 relative z-10 w-full"
      >
        <!-- avatar -->
        <div class="flex flex-col items-center space-y-2 py-8 lg:py-14">
          <div class="rounded-full w-16 h-16 border-4 border-blue-500"></div>
          <div class="rounded-t-3xl w-28 h-14 border-4 border-blue-500"></div>
        </div>
        <!-- texts -->
        <div
          class="flex flex-col items-end space-y-4 lg:space-y-7 self-start pt-1 pr-2"
        >
          <div class="rounded-full w-8 h-8 border-4 border-blue-500 mr-3"></div>
          <div class="rounded-xl w-36 h-3 border-4 border-blue-500"></div>
          <div>
            <div
              class="rounded-xl w-24 h-3 border-4 border-blue-500 mt-4"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

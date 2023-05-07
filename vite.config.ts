import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), basicSsl()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        video: resolve(__dirname, "htmls/video.html"),
        front: resolve(__dirname, "htmls/front.html"),
        back: resolve(__dirname, "htmls/back.html"),
      },
    },
  },
});

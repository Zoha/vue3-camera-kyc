import ImageCapturePageVue from "@/components/pages/ImageCapturePage.vue";
import { createApp } from "vue";
import Notifications from "@kyvg/vue3-notification";
import * as icons from "@mdi/js";
import mdiVue from "mdi-vue/v3";

import "../assets/main.css";

const app = createApp(ImageCapturePageVue);

app.use(Notifications);
app.use(mdiVue, {
  icons,
});

app.mount("#app");

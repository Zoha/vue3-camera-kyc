import ImageCapturePageVue from "@/components/pages/ImageCapturePage.vue";
import { createApp } from "vue";
import Notifications from "@kyvg/vue3-notification";

import "../assets/main.css";

const app = createApp(ImageCapturePageVue);

app.use(Notifications);

app.mount("#app");

import VideoCapturePageVue from "@/components/pages/VideoCapturePage.vue";
import { createApp } from "vue";
import Notifications from "@kyvg/vue3-notification";

import "../assets/main.css";

const app = createApp(VideoCapturePageVue);

app.use(Notifications);

app.mount("#app");

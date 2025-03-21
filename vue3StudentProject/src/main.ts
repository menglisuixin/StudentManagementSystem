import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// @ts-ignore
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from "./router";
import "@/assets/index.css";
import pinia from "./store";
import "./permission";
const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
// 注册全局组件方便在任意时候使用图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(pinia);
app.mount("#app");

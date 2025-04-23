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
import * as echarts from "echarts";
import "../style.css";

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
// 注册全局组件方便在任意时候使用图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.globalProperties.$echarts = echarts;
// 将 echarts 挂载到 window 对象上
window.echarts = echarts;

// 动态加载 china.json 并注册地图
const loadChinaMap = async () => {
  try {
    const response = await fetch("/china.json");
    if (!response.ok) {
      throw new Error(`加载中国地图数据失败，状态码: ${response.status}`);
    }
    const chinaMapData = await response.json();
    echarts.registerMap("china", chinaMapData);
    // 继续完成应用的挂载
    app.use(router);
    app.use(pinia);
    app.mount("#app");
  } catch (error) {
    console.error("加载中国地图数据失败:", error);
    app.mount("#app");
  }
};

loadChinaMap();

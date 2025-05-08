<template>
  <div ref="chartContainer" class="echarts-demo"></div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";
import { getMapOptions } from "./map-presets";

// 扩展图表类型，包含地图
type ChartType = "bar" | "line" | "pie" | "map" | "custom";

interface Props {
  type?: ChartType; // 图表类型
  options: EChartsOption; // ECharts 配置项
  initTheme?: object | string; // 主题配置
  manualUpdate?: boolean; // 是否手动更新
  height?: string | number; // 图表高度
  width?: string | number; // 图表宽度
  mapName?: string; // 地图名称，如 'china'
  useMapPreset?: boolean; // 是否使用预设的地图配置
  mapPresetType?: string; // 预设地图类型，如 'flight'
}

const props = withDefaults(defineProps<Props>(), {
  type: "bar",
  initTheme: "default",
  manualUpdate: false,
  height: "300px",
  width: "100%",
  mapName: "china",
  useMapPreset: false,
  mapPresetType: "flight",
});

const chartContainer = shallowRef<HTMLElement | null>(null);
const chartInstance = shallowRef<ECharts | null>(null);

// 初始化图表
const initChart = async () => {
  if (!chartContainer.value) return;

  // 清理已有实例
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  // 创建实例
  chartInstance.value = echarts.init(chartContainer.value, props.initTheme, {
    renderer: "canvas",
  });

  // 如果是地图类型且使用预设配置，加载预设
  if (props.type === "map" && props.useMapPreset) {
    try {
      // 获取地图预设配置
      const mapOptions = await getMapOptions(
        props.mapPresetType,
        props.mapName
      );

      // 合并用户选项和预设选项
      const finalOptions = echarts.util.merge(mapOptions, props.options, true);

      chartInstance.value.setOption(finalOptions);
    } catch (error) {
      console.error("加载地图预设失败:", error);
      // 如果预设加载失败，使用用户提供的选项
      chartInstance.value.setOption(props.options);
    }
  } else {
    // 非地图类型或不使用预设，直接使用用户选项
    chartInstance.value.setOption(props.options);
  }
};

// 更新图表
const updateChart = async () => {
  if (!chartInstance.value) return;

  if (props.type === "map" && props.useMapPreset) {
    try {
      // 获取地图预设配置
      const mapOptions = await getMapOptions(
        props.mapPresetType,
        props.mapName
      );

      // 合并用户选项和预设选项
      const finalOptions = echarts.util.merge(mapOptions, props.options, true);

      chartInstance.value.setOption(finalOptions, true);
    } catch (error) {
      console.error("更新地图预设失败:", error);
      chartInstance.value.setOption(props.options, true);
    }
  } else {
    chartInstance.value.setOption(props.options, true);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  chartInstance.value?.resize();
};
/*
ResizeObserver 是一个浏览器 API，它可以用来监听元素的大小变化。当 main 容器的宽度因为 navbar 的收起或展开而改变时，ResizeObserver 会捕获到这个变化，并触发相应的回调函数。在回调函数中，调用 echarts 实例的 resize 方法，让图表重新计算并适应新的容器宽度。
 */
// 监听容器宽度变化
let resizeObserver: ResizeObserver | null = null;
const observeResize = () => {
  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(chartContainer.value);
  }
};

const unobserveResize = () => {
  resizeObserver?.disconnect();
};

// 生命周期钩子
onMounted(() => {
  nextTick(initChart);
  window.addEventListener("resize", handleResize);
  observeResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance.value?.dispose();
  unobserveResize();
});

// 监听配置项变化
watch(
  () => props.options,
  () => {
    if (!props.manualUpdate) {
      nextTick(updateChart);
    }
  },
  { deep: true }
);

// 监听类型变化
watch(
  () => props.type,
  () => {
    nextTick(initChart);
  }
);

// 监听地图预设类型变化
watch([() => props.mapPresetType, () => props.mapName], () => {
  if (props.type === "map" && props.useMapPreset) {
    nextTick(updateChart);
  }
});

// 暴露方法
defineExpose({
  getInstance: () => chartInstance.value,
  updateChart,
  resize: handleResize,
});
</script>

<style scoped>
.echarts-demo {
  width: v-bind("props.width");
  height: v-bind("props.height");
}
</style>

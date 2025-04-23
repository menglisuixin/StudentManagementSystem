import type { EChartsOption } from "echarts";

// 地图预设类型
// export type MapPresetType = "flight" | "heatmap";
export type MapPresetType = "flight";

// 地图预设加载器
export async function getMapOptions(
  presetType: string = "flight",
  mapName: string = "china"
): Promise<EChartsOption> {
  try {
    // 动态导入预设模块
    switch (presetType) {
      case "flight":
        const { default: flightOptions } = await import("./flight");
        return flightOptions(mapName);
      // case "heatmap":
      //   const { default: heatmapOptions } = await import("./heatmap");
      //   return heatmapOptions(mapName);
      default:
        // 默认使用航线图
        const { default: defaultOptions } = await import("./flight");
        return defaultOptions(mapName);
    }
  } catch (error) {
    console.error(`加载地图预设 ${presetType} 失败:`, error);
    // 返回一个基本的地图配置
    return {
      geo: {
        map: mapName,
        roam: true,
      },
    };
  }
}

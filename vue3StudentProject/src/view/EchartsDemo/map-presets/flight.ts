import type { EChartsOption } from "echarts";

// 定义城市名称类型作为字面量联合类型
type CityName =
  | "上海"
  | "东莞"
  | "东营"
  | "中山"
  | "临汾"
  | "临沂"
  | "丹东"
  | "丽水"
  | "乌鲁木齐"
  | "佛山"
  | "保定"
  | "兰州"
  | "包头"
  | "北京"
  | "北海"
  | "南京"
  | "南宁"
  | "南昌"
  | "南通"
  | "厦门"
  | "台州"
  | "合肥"
  | "呼和浩特"
  | "咸阳"
  | "哈尔滨"
  | "唐山"
  | "嘉兴"
  | "大同"
  | "大连"
  | "天津"
  | "太原"
  | "威海"
  | "宁波"
  | "宝鸡"
  | "宿迁"
  | "常州"
  | "广州"
  | "廊坊"
  | "延安"
  | "张家口"
  | "徐州"
  | "德州"
  | "惠州"
  | "成都"
  | "扬州"
  | "承德"
  | "拉萨"
  | "无锡"
  | "日照"
  | "昆明"
  | "杭州"
  | "枣庄"
  | "柳州"
  | "株洲"
  | "武汉"
  | "汕头"
  | "江门"
  | "沈阳"
  | "沧州"
  | "河源"
  | "泉州"
  | "泰安"
  | "泰州"
  | "济南"
  | "济宁"
  | "海口"
  | "淄博"
  | "淮安"
  | "深圳"
  | "清远"
  | "温州"
  | "渭南"
  | "湖州"
  | "湘潭"
  | "滨州"
  | "潍坊"
  | "烟台"
  | "玉溪"
  | "珠海"
  | "盐城"
  | "盘锦"
  | "石家庄"
  | "福州"
  | "秦皇岛"
  | "绍兴"
  | "聊城"
  | "肇庆"
  | "舟山"
  | "苏州"
  | "莱芜"
  | "菏泽"
  | "营口"
  | "葫芦岛"
  | "衡水"
  | "衢州"
  | "西宁"
  | "西安"
  | "贵阳"
  | "连云港"
  | "邢台"
  | "邯郸"
  | "郑州"
  | "鄂尔多斯"
  | "重庆"
  | "金华"
  | "铜川"
  | "银川"
  | "镇江"
  | "长春"
  | "长沙"
  | "长治"
  | "阳泉"
  | "青岛"
  | "韶关";

// 中国城市地理坐标数据
const geoCoordMap: Record<CityName, [number, number]> = {
  上海: [121.4648, 31.2891],
  东莞: [113.8953, 22.901],
  东营: [118.7073, 37.5513],
  中山: [113.4229, 22.478],
  临汾: [111.4783, 36.1615],
  临沂: [118.3118, 35.2936],
  丹东: [124.541, 40.4242],
  丽水: [119.5642, 28.1854],
  乌鲁木齐: [87.9236, 43.5883],
  佛山: [112.8955, 23.1097],
  保定: [115.0488, 39.0948],
  兰州: [103.5901, 36.3043],
  包头: [110.3467, 41.4899],
  北京: [116.4551, 40.2539],
  北海: [109.314, 21.6211],
  南京: [118.8062, 31.9208],
  南宁: [108.479, 23.1152],
  南昌: [116.0046, 28.6633],
  南通: [121.1023, 32.1625],
  厦门: [118.1689, 24.6478],
  台州: [121.1353, 28.6688],
  合肥: [117.29, 32.0581],
  呼和浩特: [111.4124, 40.4901],
  咸阳: [108.4131, 34.8706],
  哈尔滨: [127.9688, 45.368],
  唐山: [118.4766, 39.6826],
  嘉兴: [120.9155, 30.6354],
  大同: [113.7854, 39.8035],
  大连: [122.2229, 39.4409],
  天津: [117.4219, 39.4189],
  太原: [112.3352, 37.9413],
  威海: [121.9482, 37.1393],
  宁波: [121.5967, 29.6466],
  宝鸡: [107.1826, 34.3433],
  宿迁: [118.5535, 33.7775],
  常州: [119.4543, 31.5582],
  广州: [113.5107, 23.2196],
  廊坊: [116.521, 39.0509],
  延安: [109.1052, 36.4252],
  张家口: [115.1477, 40.8527],
  徐州: [117.5208, 34.3268],
  德州: [116.6858, 37.2107],
  惠州: [114.6204, 23.1647],
  成都: [103.9526, 30.7617],
  扬州: [119.4653, 32.8162],
  承德: [117.5757, 41.4075],
  拉萨: [91.1865, 30.1465],
  无锡: [120.3442, 31.5527],
  日照: [119.2786, 35.5023],
  昆明: [102.9199, 25.4663],
  杭州: [119.5313, 29.8773],
  枣庄: [117.323, 34.8926],
  柳州: [109.3799, 24.9774],
  株洲: [113.5327, 27.0319],
  武汉: [114.3896, 30.6628],
  汕头: [117.1692, 23.3405],
  江门: [112.6318, 22.1484],
  沈阳: [123.1238, 42.1216],
  沧州: [116.8286, 38.2104],
  河源: [114.917, 23.9722],
  泉州: [118.3228, 25.1147],
  泰安: [117.0264, 36.0516],
  泰州: [120.0586, 32.5525],
  济南: [117.1582, 36.8701],
  济宁: [116.8286, 35.3375],
  海口: [110.3893, 19.8516],
  淄博: [118.0371, 36.6064],
  淮安: [118.927, 33.4039],
  深圳: [114.5435, 22.5439],
  清远: [112.9175, 24.3292],
  温州: [120.498, 27.8119],
  渭南: [109.7864, 35.0299],
  湖州: [119.8608, 30.7782],
  湘潭: [112.5439, 27.7075],
  滨州: [117.8174, 37.4963],
  潍坊: [119.0918, 36.524],
  烟台: [120.7397, 37.5128],
  玉溪: [101.9312, 23.8898],
  珠海: [113.7305, 22.1155],
  盐城: [120.2234, 33.5577],
  盘锦: [121.9482, 41.0449],
  石家庄: [114.4995, 38.1006],
  福州: [119.4543, 25.9222],
  秦皇岛: [119.2126, 40.0232],
  绍兴: [120.564, 29.7565],
  聊城: [115.9167, 36.4032],
  肇庆: [112.1265, 23.5822],
  舟山: [122.2559, 30.2234],
  苏州: [120.6519, 31.3989],
  莱芜: [117.6526, 36.2714],
  菏泽: [115.6201, 35.2057],
  营口: [122.4316, 40.4297],
  葫芦岛: [120.1575, 40.578],
  衡水: [115.8838, 37.7161],
  衢州: [118.6853, 28.8666],
  西宁: [101.4038, 36.8207],
  西安: [109.1162, 34.2004],
  贵阳: [106.6992, 26.7682],
  连云港: [119.1248, 34.552],
  邢台: [114.8071, 37.2821],
  邯郸: [114.4775, 36.535],
  郑州: [113.4668, 34.6234],
  鄂尔多斯: [108.9734, 39.2487],
  重庆: [107.7539, 30.1904],
  金华: [120.0037, 29.1028],
  铜川: [109.0393, 35.1947],
  银川: [106.3586, 38.1775],
  镇江: [119.4763, 31.9702],
  长春: [125.8154, 44.2584],
  长沙: [113.0823, 28.2568],
  长治: [112.8625, 36.4746],
  阳泉: [113.4778, 38.0951],
  青岛: [120.4651, 36.3373],
  韶关: [113.7964, 24.7028],
};

// 定义数据项接口
interface CityData {
  name: CityName;
  value?: number;
}

interface FlightLine {
  source: CityData;
  target: CityData;
}

interface ConvertedData {
  fromName: string;
  toName: string;
  coords: [number, number][];
  value: number;
}

// 默认航线数据
const flightRoutes: Record<string, FlightLine[]> = {
  XAData: [
    { source: { name: "西安" }, target: { name: "北京", value: 100 } },
    { source: { name: "西安" }, target: { name: "上海", value: 100 } },
    { source: { name: "西安" }, target: { name: "广州", value: 100 } },
    { source: { name: "西安" }, target: { name: "西宁", value: 100 } },
    { source: { name: "西安" }, target: { name: "银川", value: 100 } },
    { source: { name: "西安" }, target: { name: "哈尔滨", value: 100 } },
  ],
  XNData: [
    { source: { name: "西宁" }, target: { name: "北京", value: 100 } },
    { source: { name: "西宁" }, target: { name: "上海", value: 100 } },
    { source: { name: "西宁" }, target: { name: "广州", value: 100 } },
    { source: { name: "西宁" }, target: { name: "西安", value: 100 } },
    { source: { name: "西宁" }, target: { name: "银川", value: 100 } },
  ],
  YCData: [
    { source: { name: "银川" }, target: { name: "北京", value: 100 } },
    { source: { name: "银川" }, target: { name: "广州", value: 100 } },
    { source: { name: "银川" }, target: { name: "上海", value: 100 } },
    { source: { name: "银川" }, target: { name: "西安", value: 100 } },
    { source: { name: "银川" }, target: { name: "西宁", value: 100 } },
  ],
  HEBData: [
    { source: { name: "哈尔滨" }, target: { name: "北京", value: 100 } },
    { source: { name: "哈尔滨" }, target: { name: "上海", value: 100 } },
    { source: { name: "哈尔滨" }, target: { name: "广州", value: 100 } },
    { source: { name: "哈尔滨" }, target: { name: "深圳", value: 100 } },
  ],
};

// 飞机路径图标
const planePath =
  "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

// 数据转换函数
const convertData = (data: FlightLine[]): ConvertedData[] => {
  const res: ConvertedData[] = [];
  for (let i = 0; i < data.length; i++) {
    const dataItem = data[i];
    const fromCoord = geoCoordMap[dataItem.source.name];
    const toCoord = geoCoordMap[dataItem.target.name];
    if (fromCoord && toCoord) {
      res.push({
        fromName: dataItem.source.name,
        toName: dataItem.target.name,
        coords: [fromCoord, toCoord],
        value: dataItem.target.value || 0,
      });
    }
  }
  return res;
};

// 导出地图配置生成函数
export default function getFlightMapOptions(mapName = "china"): EChartsOption {
  const color = ["#a6c84c", "#ffa022", "#46bee9"]; // 航线颜色
  const series: any[] = [];

  // 为四个城市生成系列
  const cityData: [string, FlightLine[]][] = [
    ["西安", flightRoutes.XAData],
    ["西宁", flightRoutes.XNData],
    ["银川", flightRoutes.YCData],
    ["哈尔滨", flightRoutes.HEBData],
  ];

  cityData.forEach((item, i) => {
    const cityName = item[0];
    const flightData = item[1];

    // 添加飞行效果线
    series.push({
      name: cityName + " Top3",
      type: "lines",
      zlevel: 1,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        color: "red",
        symbolSize: 3,
      },
      lineStyle: {
        color: color[i],
        width: 0,
        curveness: 0.2,
      },
      data: convertData(flightData),
    });

    // 添加带飞机图标的航线
    series.push({
      name: cityName + " Top3",
      type: "lines",
      zlevel: 2,
      symbol: ["none", "arrow"],
      symbolSize: 10,
      effect: {
        show: true,
        period: 6,
        trailLength: 0,
        symbol: planePath,
        symbolSize: 15,
      },
      lineStyle: {
        color: color[i],
        width: 1,
        opacity: 0.6,
        curveness: 0.2,
      },
      data: convertData(flightData),
    });

    // 添加目的地城市标记
    series.push({
      name: cityName + " Top3",
      type: "effectScatter",
      coordinateSystem: "geo",
      zlevel: 2,
      rippleEffect: {
        brushType: "stroke",
      },
      label: {
        show: true,
        position: "right",
        formatter: "{b}",
      },
      symbolSize: function (val: any) {
        return val[2] / 8;
      },
      itemStyle: {
        color: color[i],
      },
      emphasis: {
        itemStyle: {
          areaColor: "#2B91B7",
        },
      },
      data: flightData.map((dataItem) => {
        const coords = geoCoordMap[dataItem.target.name];
        return {
          name: dataItem.target.name,
          value: [...coords, dataItem.target.value || 0],
        };
      }),
    });
  });

  return {
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (params.seriesType === "effectScatter") {
          return "线路：" + params.data.name + "" + params.data.value[2];
        } else if (params.seriesType === "lines") {
          return (
            params.data.fromName +
            ">" +
            params.data.toName +
            "<br />" +
            params.data.value
          );
        } else {
          return params.name;
        }
      },
    },
    legend: {
      orient: "vertical",
      top: "bottom",
      left: "right",
      data: ["西安 Top3", "西宁 Top3", "银川 Top3", "哈尔滨 Top3"],
      textStyle: {
        color: "#fff",
      },
      selectedMode: "multiple",
    },
    geo: {
      map: mapName,
      label: {
        color: "#fff",
      },
      zoom: 1.2,
      roam: true,
      itemStyle: {
        areaColor: "rgba(20, 41, 87, 0.7)",
        borderColor: "#195BB9",
        borderWidth: 1,
      },
      emphasis: {
        label: {
          show: true,
          color: "#fff",
        },
        itemStyle: {
          areaColor: "#2B91B7",
        },
      },
    },
    series: series,
  };
}

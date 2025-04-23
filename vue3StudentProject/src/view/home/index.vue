<template>
  <div class="home_title" style="text-align: center">
    <el-button :icon="ArrowLeft" @click="getPreYearData">上一年</el-button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <span>{{ year }}</span>
    <span>年学员数量</span>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <el-button :icon="ArrowRight" @click="getNextYearData">下一年</el-button>

    <!-- 使用EchartsDemo组件替换原来的div -->
    <EchartsDemo
      type="bar"
      :options="chartOptions"
      height="500px"
      :key="year"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { reqStudentForYear } from "@/api/student";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import EchartsDemo from '../EchartsDemo/index.vue';

const year = ref(new Date().getFullYear());
// 使用reactive创建图表配置对象
const chartOptions = reactive({
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  },
  yAxis: {
    type: "value",
    min: 0,
    max: 10,
    // 将坐标值转为整数
    axisLabel: {
      formatter: function (value: number) {
        return Math.round(value);
      }
    }
  },
  series: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      type: "bar",
    },
  ],
  title: {
    text: `${year.value}年学员数量`,
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
} as any); // 使用类型断言解决类型问题

// 更新标题
watch(year, (newYear) => {
  chartOptions.title.text = `${newYear}年学员数量`;
});

// 获取上一年数据
const getPreYearData = () => {
  year.value--;
  getMsg();
};

// 获取下一年数据
const getNextYearData = () => {
  year.value++;
  getMsg();
};

// 获取数据的方法
const getMsg = () => {
  reqStudentForYear(year.value).then((res) => {
    if (res.status == '0') {
      let dataArr = Array(12).fill(0); // 创建一个长度为12的数组并填充0

      if(res.data && res.data.length) {
        res.data.forEach((item) => {
          dataArr[parseInt(item._id) - 1] = item.count;
        });
      }

      // 更新图表数据
      chartOptions.series[0].data = dataArr;
    }
  });
};

onMounted(() => {
  getMsg();
});
</script>
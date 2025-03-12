<template>
  <div class="home_title" style="text-align: center">
    <el-button :icon="ArrowLeft" @click="getPreYearData">上一年</el-button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <span>{{ year }}</span>
    <span>年学员数量</span>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <el-button :icon="ArrowRight" @click="getNextYearData">下一年</el-button>
    <div id="main" style="height: 500px"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { reqStudentForYear } from "@/api/student";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

const year = ref(new Date().getFullYear());
let getPreYearData = () => {
  year.value--;
  getMsg()
};
let getNextYearData = () => {
  year.value++;
  getMsg()
};
let getMsg = () => {
  reqStudentForYear(year.value).then((res) => {
    if (res.status == '0') {
      let chartDom = document.getElementById("main");
      let myChart = echarts.init(chartDom);
      let option;
      let dataArr = [0]
      if(res.data && res.data.length) {
        res.data.forEach((item) => {
          dataArr[parseInt(item._id) -1] =item.count
        })
      }
      option = {
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
            formatter: function (value:number) {
              return Math.round(value);
            }
          }
        },
        series: [
          {
            data: dataArr,
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
      }
      option && myChart.setOption(option);
    }
  });
}
onMounted(() => {
  getMsg()
});
</script>

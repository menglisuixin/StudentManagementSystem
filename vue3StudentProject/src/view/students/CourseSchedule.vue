<template>
  <!-- 待扩展 -->
  <div class="course-schedule">
    <h1 class="text-2xl font-bold mb-4">我的课表</h1>
    <el-table :data="courseTableData" stripe border>
      <el-table-column prop="day" label="星期" width="100"></el-table-column>
      <el-table-column prop="time" label="时间" width="150"></el-table-column>
      <el-table-column prop="course" label="课程"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 模拟课表数据
const courseTableData = ref([
  {
    day: "星期一",
    time: "08:00 - 09:40",
    course: "高等数学",
  },
  {
    day: "星期一",
    time: "10:00 - 11:40",
    course: "大学英语",
  },
  {
    day: "星期二",
    time: "08:00 - 09:40",
    course: "计算机科学基础",
  },
  {
    day: "星期二",
    time: "10:00 - 11:40",
    course: "线性代数",
  },
  // 可以添加更多课程信息
]);
</script>

<style scoped>
.course-schedule {
  padding: 20px;
}
h1 {
  text-align: center;
}
</style>

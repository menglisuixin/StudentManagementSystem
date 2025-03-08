<template>
  <div class="header">
    <a href="#">
      <img class="logo" src="@/assets/vue.svg" alt="" />
      <span class="company">学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        admin
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="date">{{ currentTime }}</span>
  </div>
</template>
<script setup lang="ts">
import { formateTime } from "@/utils/dateUtils";
import { ref, onUnmounted } from "vue";
let currentTime = ref<string>(formateTime(Date.now()));
let timer = setInterval(function () {
  currentTime.value = formateTime(Date.now());
}, 1000);
onUnmounted(() => {
  clearInterval(timer);
});
const handleCommand = (command: string) => {
  switch (command) {
    case "a":
      console.log("修改密码");
      break;
    case "b":
      console.log("退出系统");
      break;
    default:
      break;
  }
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
  width: 20px;
}
.company {
  position: absolute;
  color: #fff;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
  height: 50px;
  line-height: 50px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  outline: none;
  align-items: center;
}
.date {
  float: right;
  color: #fff;
  margin-right: 50px;
}
</style>

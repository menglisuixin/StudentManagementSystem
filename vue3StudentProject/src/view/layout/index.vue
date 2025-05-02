<template>
  <div class="grid-container">
    <appHeader class="header"></appHeader>
    <appNavBar
      class="navbar"
      :style="{ width: isNavbarOpen ? '230px' : '0' }"
    >
    </appNavBar>
    <appMain
      class="main"
      :isNavbarOpen="isNavbarOpen"
      @toggleNavbar="toggleNavbar"
    ></appMain>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import appHeader from "@/components/AppHeader/index.vue";
import appMain from "@/components/AppMain/index.vue";
import appNavBar from "@/components/AppNavBar/index.vue";

// 从 localStorage 中获取初始状态，如果没有则默认为 true
const storedValue = localStorage.getItem('isNavbarOpen');
const isNavbarOpen = ref(storedValue === 'true' || storedValue === null);

const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value;
  // 将状态存入 localStorage
  localStorage.setItem('isNavbarOpen', isNavbarOpen.value.toString());

};

onMounted(() => {
  // 页面加载时检查 localStorage 中的状态
  const storedValue = localStorage.getItem('isNavbarOpen');
  if (storedValue) {
    isNavbarOpen.value = storedValue === 'true';
  }
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    "header header"
    "navbar main";
  height: 100vh;
}

.header {
  grid-area: header;
  line-height: 50px;
  background-color: #2d3a4b;
}

.navbar {
  grid-area: navbar;
  overflow-y: auto;
  background-color: #545c64;
  transition: width 0.3s;
  overflow-x: hidden;
}

.main {
  grid-area: main;
  padding: 10px;
  overflow-y: auto;
  position: relative; /* 添加相对定位，以便按钮定位 */
}
</style>
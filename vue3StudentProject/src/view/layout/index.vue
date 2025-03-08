<template>
  <div>
    <appHeader></appHeader>
    <appMain></appMain>
    <appNavBar></appNavBar>
  </div>
</template>
<script setup lang="ts">
import appHeader from "@/components/AppHeader/index.vue";
import appMain from "@/components/AppMain/index.vue";
import appNavBar from "@/components/AppNavBar/index.vue";
</script>
<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  line-height: 50px;
  background-color: #2d3a4b;
}
.navbar {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  padding: 0;
  width: 230px;
  overflow-y: auto;
  background-color: #545c64;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  overflow-y: auto;
  background-color: #3c4b5a;
}
</style>

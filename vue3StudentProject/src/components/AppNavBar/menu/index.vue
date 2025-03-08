<template>
  <!-- 看成递归组件 -->
  <template v-for="item in menuList" :key="item.index">
    <div>{{ item }}</div>
  </template>
</template>
<script lang="ts">
export default {
  name: "menu",
  props: ["menuList"],
};
</script>
<style scoped></style>

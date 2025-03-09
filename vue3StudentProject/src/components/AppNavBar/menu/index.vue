<template>
  <!-- 看成递归组件 -->
  <template v-for="item in menuList" :key="item.index">
    <!-- 没有子项显示 -->
    <el-menu-item v-if="!item.children" :index="item.index">
      <template #title>
        <el-icon>
          <!-- 用于渲染动态组件或元素的元组件 -->
          <!-- 要渲染的实际组件由isprop决定 -->
          <!-- 当is是字符串时，既可以是HTML标签名也可以是组件的注册名 -->
          <!-- 或者 is 也可以直接绑定到组件的内部定义 -->
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有子项显示 -->
    <el-sub-menu v-if="item.children" :index="item.index">
      <template #title>
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>
<script lang="ts">
export default {
  name: "Menu",
  props: ["menuList"],
};
</script>
<style scoped></style>

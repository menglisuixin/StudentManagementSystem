<template>
  <div class="navbar">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
      :default-openeds="['/students']"
      :default-active="$route.path"
      :router="true"
    >
      <Menu :menuList="menuNodes" />
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import Menu from "./menu/index.vue";
import menuList from "@/config/menuConfig";
import type { MenuData, MenuChildData } from "./types/type";
import useUserStore from "@/store/modules/user";
import { useRoute } from "vue-router";

let userStore = useUserStore();
let $route = useRoute();
let menuNodes: any[] = [];
const hashAuth = (item: MenuData) => {
  const { index, isPublic } = item;
  const menus = userStore.user?.role.menus;
  const username = userStore.user?.username;
  // admin 所有权限
  if (username == "admin" || isPublic || menus?.indexOf(index) !== -1) {
    return true;
  } else if (item.children) {
    return item.children.find((child: MenuChildData) => {
      menus.indexOf(child.index) !== -1;
    });
  } else {
    return false;
  }
};
const getMenuNode = () => {
  menuList.forEach((item) => {
    if (!item.children) {
      if (hashAuth(item)) {
        menuNodes.push(item);
      }
    } else {
      let tempArr: any = [];
      item.children.forEach((i) => {
        if (hashAuth(i)) {
          tempArr.push(i);
        }
      });
      let obj = { ...item, children: tempArr };
      menuNodes.push(obj);
    }
  });
};
getMenuNode();
</script>
<style scoped>
.el-menu {
  border: 0;
}
</style>

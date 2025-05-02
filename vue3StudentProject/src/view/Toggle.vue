<template>
  <component :is="currentComponent" />
</template>

<script setup lang="ts">
import { watchEffect,shallowRef } from "vue";
import useUserStore from "@/store/modules/user";
import useRoleStore from "@/store/modules/role";
import Home from "@/view/home/index.vue";
import CourseSchedule from "@/view/students/CourseSchedule.vue";

const userStore = useUserStore();
const roleStore = useRoleStore();
const currentComponent = shallowRef(Home);

watchEffect(async () => {
  const roleId = userStore.user?.role?._id;
  if (roleId) {
    await roleStore.roleList();
    const role = roleStore.roles?.find((r) => r._id === roleId);
    currentComponent.value = role?.name === "学生" ? CourseSchedule : Home;
  }
});
</script>
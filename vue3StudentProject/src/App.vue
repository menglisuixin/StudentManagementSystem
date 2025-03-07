<template>
  <h2>你好</h2>
</template>
<script setup lang="ts">
import { reqLogin } from "@/api/user";
import { onMounted } from "vue";

onMounted(() => {
  reqLogin({ username: "test1", password: "1234" }).then((res) => {
    console.log("登录", res);
  });
});
</script>
<style scoped></style>

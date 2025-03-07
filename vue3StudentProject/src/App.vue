<template>
  <h2>你好</h2>
  <button @click="getUserInfo">获取用户信息</button>
</template>
<script setup lang="ts">
import request from "@/utils/request";
import { onMounted } from "vue";

let token = "";
onMounted(() => {
  request({
    url: "login",
    method: "post",
    data: {
      username: "test1",
      password: "1234",
    },
  }).then((res) => {
    // console.log(res);
    token = res.data.token;
  });
});
const getUserInfo = () => {
  request({
    url: "/user/info",
    method: "get",
    headers: {
      token,
    },
  }).then((res) => {
    console.log("获取用户信息", res);
  });
};
</script>
<style scoped></style>

<template>
  <h2>你好</h2>
  <div>
    <el-button :icon="Search" circle />
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </div>
  <test />
</template>
<script setup lang="ts">
import { Check, Delete, Edit, Message, Search, Star } from "@element-plus/icons-vue";
import test from "@/components/text.vue";
</script>
<style scoped></style>

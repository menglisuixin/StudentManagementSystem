<template>
  <div class="main">
    <router-view></router-view>
    <div class="box" @click="handleToggle">
      {{ isNavbarOpen ? "" : "" }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const { isNavbarOpen } = defineProps({
  isNavbarOpen: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["toggleNavbar"]);

const handleToggle = () => {
  emits("toggleNavbar");
};
</script>

<style scoped>
.box {
  width: 20px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #545c646f;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 0 20px 20px 0;
  z-index: 10;
}
</style>

<template>
  <div>
    <el-form
      :model="updateRole"
      ref="authFormRef"
      :rules="rules"
      label-width="100px"
      label-position="right"
      style="width: 400px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="updateRole.name" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
    <!-- 属性控件 -->
    <el-tree
      :data="authList"
      show-checkbox
      node-key="index"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
      @check-change="handleCheckChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { FormRules } from "element-plus";
import type { roleInfoData } from "@/api/role/type";
import menuList from "@/config/menuConfig";

let props = defineProps(["role"]);
let updateRole: roleInfoData = reactive({
  name: "",
});

let rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: ["blur"],
    },
  ],
});
let authList = ref([]);
let checkedKeys: any = reactive([]);

let handleCheckChange = (data: tree, checked: boolean) => {
  if (checked) {
    if (data.index !== "/students" && checkedKeys.indexOf(data.index) == -1) {
      checkedKeys.push(data.index);
    }
  } else {
    if (checkedKeys.indexOf(data.index) != -1) {
      checkedKeys.splice(checkedKeys.indexOf(data.index), 1);
    }
  }
};
interface tree {
  index: string;
}
let getMenus = () => {
  updateRole.menus = checkedKeys;
  return updateRole;
};
defineExpose({
  getMenus,
});
let getAuthNodes = (menuList: any) => {
  return menuList.map((item: any) => {
    if (!item.children) {
      return {
        index: item.index,
        label: item.title,
      };
    } else {
      return {
        index: item.index,
        label: item.title,
        children: getAuthNodes(item.children),
      };
    }
  });
};
onMounted(() => {
  authList.value = getAuthNodes(menuList);
  updateRole = reactive({ ...props.role });
  checkedKeys = [...props.role.menus];
});
</script>

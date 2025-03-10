<template>
  <el-table :data="usersList" style="width: 100%; height: 380px">
    <el-table-column type="index" width="60" label="序号" align="center" />
    <el-table-column property="username" label="用户名称" align="center" />
    <el-table-column property="name" label="真实姓名" align="center" />
    <el-table-column property="phone" label="电话号码" align="center" />
    <el-table-column
      property="create_time"
      label="创建时间"
      :formatter="resetDate"
      align="center"
    />
    <el-table-column
      property="role_id"
      label="所属角色"
      align="center"
      :formatter="resetRole"
    />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="success" @click="handleEdit(scope.row._id)"> 编辑 </el-button>
        <el-button type="danger" @click="handleDelete(scope.row._id)"> 删除 </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formateDate } from "@/utils/dateUtils";
import useRoleStore from "@/store/modules/role";
import { roleInfoData } from "@/api/role/type";
let roleStore = useRoleStore();
const usersList = ref([
  {
    _id: "1",
    username: "测试",
    name: "老王",
    phone: "13351911273",
    create_time: 1741579509119,
    role_id: "67860eb8473a16da1fdcb8dd",
  },
  {
    _id: "1",
    username: "测试",
    name: "小张",
    phone: "13351911273",
    create_time: 1741579509119,
    role_id: "67860eb8473a16da1fdcb8dd",
  },
]);
let roleOptions = ref<roleInfoData[] | undefined>([]);
const getRoleList = () => {
  if (roleStore.roles?.length) {
    roleOptions.value = roleStore.roles;
  } else {
    roleStore.roleList().then(() => {
      roleOptions.value = roleStore.roles;
    });
  }
};
const resetDate = (_row: any, _column: any, cellValue: any, _index: number) => {
  return formateDate(cellValue);
};
const resetRole = (_row: any, _column: any, cellValue: any, _index: number) => {
  let role = roleOptions.value?.find((item) => item._id == cellValue) || { name: "" };
  return role.name;
};
let handleEdit = (_id: string) => {
  console.log(_id);
};
let handleDelete = (_id: string) => {
  console.log(_id);
};
onMounted(() => {
  getRoleList();
});
</script>
<style scoped></style>

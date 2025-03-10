<template>
  <el-table :data="users" style="width: 100%; height: 380px">
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
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[5, 10, 15, 20]"
    layout="total,sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    style="display: flex; justify-content: center; align-items: center"
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formateDate } from "@/utils/dateUtils";
import useRoleStore from "@/store/modules/role";
import { roleInfoData } from "@/api/role/type";
import useUserStore from "@/store/modules/user";
import type { userInfoData } from "@/api/user/type";
let roleStore = useRoleStore();
let userStore = useUserStore();
const users = ref<userInfoData[] | undefined>();

const getUserList = () => {
  userStore.getUserList({ page: currentPage.value, size: pageSize.value }).then((res) => {
    users.value = userStore.users;
    total.value = res?.total as number;
  });
};
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
  getUserList();
});
// 分页
let currentPage = ref(1);
let pageSize = ref(5);
let total = ref(0);
let handleSizeChange = (val: number) => {
  console.log(val, "1111");
};
let handleCurrentChange = (val: number) => {
  console.log(val, "22222");
};
</script>
<style scoped></style>

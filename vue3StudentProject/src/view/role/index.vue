<template>
  <div style="margin: 20px 0">
    <el-button @click="handleAdd">创建角色</el-button>
    <el-button
      :disabled="currentRow == null ? true : false"
      @click="roleAuthVisible = true"
      >设置角色权限</el-button
    >
  </div>
  <el-table
    ref="singleTableRef"
    :data="roleList"
    highlight-current-row
    style="width: 100%"
    @current-change="handleCurrentChange"
    border
    height="380"
  >
    <el-table-column type="index" width="60" label="序号" />
    <el-table-column property="name" label="角色名称" />
    <el-table-column property="create_time" label="创建时间" :formatter="resetDate" />
    <el-table-column property="auth_time" label="授权时间" :formatter="resetDate" />
    <el-table-column property="auth_name" label="授权人" />
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="添加角色" width="500">
    <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addData(roleFormRef)">确定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="roleAuthVisible" title="设置角色权限" width="500">
    <Auth v-if="roleAuthVisible" :role="currentRow" ref="authRef" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateData()">确定</el-button>
        <el-button @click="roleAuthVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onMounted } from "vue";
import { ElMessage, ElTable } from "element-plus";
import { formateDate } from "@/utils/dateUtils";
import type { roleInfoData } from "@/api/role/type";
import type { FormInstance, FormRules } from "element-plus";
import useRoleStore from "@/store/modules/role";
import Auth from "./Auth.vue";

// import useUserStore from "@/store/modules/user";

let roleStore = useRoleStore();
const resetDate = (_row: any, _column: any, cellValue: any, _index: number) => {
  return formateDate(cellValue);
};
const currentRow = ref();

const singleTableRef = ref();

//弹出框
let dialogFormVisible = ref(false);
// 添加角色的对象
let roleForm = reactive({
  name: "",
});
// 添加角色
let addData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      roleStore.useAddRole(roleForm).then(() => {
        dialogFormVisible.value = false;
        getRoleList();
        ElMessage({
          type: "success",
          message: `添加角色${roleForm.name}成功`,
        });
      });
    }
  });
};
// 表单校验
let rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入角色名称", trigger: ["blur"] }],
});
const roleFormRef = ref<FormInstance>();

const handleCurrentChange = (val: any) => {
  // console.log(val);
  currentRow.value = val;
};

//控制添加权限的变量
let roleAuthVisible = ref(false);
// 用户仓库
// let userStore = useUserStore();
let authRef = ref();
// 更新角色权限
let updateData = () => {
  // console.log("updateData");
  const newRole = authRef.value.getMenus();
  console.log(newRole);
  // 关闭设置权限的弹出框
  roleAuthVisible.value = false;
  // 取消选择当前行
  if (singleTableRef.value) {
    singleTableRef.value.setCurrentRow();
    currentRow.value = null;
  }
};
const roleList = ref<roleInfoData[] | undefined>([]);
// 添加角色
let handleAdd = () => {
  dialogFormVisible.value = true;
  nextTick(() => {
    roleFormRef.value?.resetFields();
  });
};
// 获取角色列表
const getRoleList = () => {
  roleStore.roleList().then(() => {
    roleList.value = roleStore.roles;
  });
};
onMounted(() => {
  getRoleList();
});
</script>

<template>
  <div style="margin: 20px 0">
    <el-button @click="handleAdd">创建角色</el-button>
    <el-button>设置权限</el-button>
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
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from "vue";
import { ElTable } from "element-plus";
import { formateDate } from "@/utils/dateUtils";
import type { roleInfoData } from "@/api/role/type";
import type { FormInstance, FormRules } from "element-plus";

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
      console.log(valid, 123);
    }
  });
};
// 表单校验
let rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入角色名称", trigger: ["blur"] }],
});
const roleFormRef = ref<FormInstance>();

const handleCurrentChange = (val: any) => {
  currentRow.value = val;
};
const roleList = ref<roleInfoData[]>([
  {
    name: "教师",
    create_time: 1741502941666,
    __v: 1,
  },
]);
// 添加角色
let handleAdd = () => {
  dialogFormVisible.value = true;
  nextTick(() => {
    roleFormRef.value?.resetFields();
  });
};
</script>

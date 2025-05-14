<template>
  <div style="margin: 20px 0">
    <el-button @click="handleAdd">新增学校</el-button>
  </div>
  <div v-if="schools">
    <el-table :data="schools" style="width: 100%; height: 380px">
      <el-table-column type="index" width="60" label="序号" align="center" />
      <el-table-column property="schoolname" label="学校名称" align="center" />

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="success" @click="handleEdit(scope.row._id)">
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row._id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- <div v-else>
    数据加载中...
  </div> -->
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
  <!-- 弹出对话框 -->
  <el-dialog v-model="schoolFormVisible" :title="dialogTitle" width="500">
    <el-form
      :model="school"
      :rules="rules"
      ref="schoolFormRef"
      label-width="90px"
    >
      <el-form-item label="学校名称" prop="schoolname">
        <el-input v-model="school.schoolname" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="
            school._id == null
              ? addData(schoolFormRef)
              : updateData(schoolFormRef)
          "
          >确定</el-button
        >
        <el-button @click="schoolFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useSchoolStore from "@/store/modules/school";
import type { schoolInfoData } from "@/api/school/type";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { nextTick } from "vue";
const dialogTitle = ref("");
let schoolStore = useSchoolStore();
const schools = ref<schoolInfoData[] | undefined>();

const getSchoolList = () => {
  schoolStore
    .getSchoolList({ page: currentPage.value, size: pageSize.value })
    .then((res) => {
      schools.value = schoolStore.schools;
      total.value = res?.total as number;
    });
};

let handleEdit = (_id: string) => {
  handleAdd();
  schoolStore.getSchoolById(_id).then((res) => {
    school.value = res as schoolInfoData;
  });
  dialogTitle.value = "编辑学校";
};
let updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      schoolStore.updateSchool(school.value).then(() => {
        schoolFormVisible.value = false;
        getSchoolList();
      });
    } else {
    }
  });
};
let handleDelete = (_id: string) => {
  ElMessageBox.confirm("你确定删除吗", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    schoolStore.deleteSchool(_id).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getSchoolList();
    });
  });
};
onMounted(() => {
  getSchoolList();
});
// 分页
let currentPage = ref(1);
let pageSize = ref(5);
let total = ref(0);
let handleSizeChange = (val: number) => {
  pageSize.value = val;
  getSchoolList();
};
let handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getSchoolList();
};
let schoolFormVisible = ref(false);
let school = ref<schoolInfoData>({
  _id: null,
  schoolname: "",
});
const schoolFormRef = ref<FormInstance>();

let rules = reactive<FormRules>({
  schoolname: [
    {
      required: true,
      message: "请输入学校名称",
      trigger: ["change", "blur"],
    },
  ],
});
let addData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        schoolStore.addSchool(school.value).then(() => {
          schoolFormVisible.value = false;
          getSchoolList();
        });
      } catch (error) {}
    } else {
    }
  });
};
let handleAdd = () => {
  school.value = {
    _id: null,
    schoolname: "",
  };
  schoolFormVisible.value = true;
  dialogTitle.value = "添加学校";
  nextTick(() => {
    schoolFormRef.value?.resetFields();
  });
};
</script>
<style scoped></style>

<template>
  <div style="margin: 20px 0">
    <el-button @click="handleAdd">新增专业</el-button>
  </div>
  <div v-if="majors">
    <el-table :data="majors" style="width: 100%; height: 380px">
      <el-table-column type="index" width="60" label="序号" align="center" />
      <el-table-column property="majorname" label="专业名称" align="center" />

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
  <!-- <div v-else>数据加载中...</div> -->
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
  <el-dialog v-model="majorFormVisible" title="添加专业" width="500">
    <el-form
      :model="major"
      :rules="rules"
      ref="majorFormRef"
      label-width="90px"
    >
      <el-form-item label="专业名称" prop="majorname">
        <el-input v-model="major.majorname" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="
            major._id == null ? addData(majorFormRef) : updateData(majorFormRef)
          "
          >确定</el-button
        >
        <el-button @click="majorFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useMajorStore from "@/store/modules/major";
import type { majorInfoData } from "@/api/major/type";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { nextTick } from "vue";

let majorStore = useMajorStore();
const majors = ref<majorInfoData[] | undefined>();

const getMajorList = () => {
  majorStore
    .getMajorList({ page: currentPage.value, size: pageSize.value })
    .then((res) => {
      majors.value = majorStore.majors;
      total.value = res?.total as number;
    });
};

let handleEdit = (_id: string) => {
  handleAdd();
  majorStore.getMajorById(_id).then((res) => {
    major.value = res as majorInfoData;
  });
};
let updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      majorStore.updateMajor(major.value).then(() => {
        majorFormVisible.value = false;
        getMajorList();
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
    majorStore.deleteMajor(_id).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getMajorList();
    });
  });
};
onMounted(() => {
  getMajorList();
});
// 分页
let currentPage = ref(1);
let pageSize = ref(5);
let total = ref(0);
let handleSizeChange = (val: number) => {
  pageSize.value = val;
  getMajorList();
};
let handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getMajorList();
};
let majorFormVisible = ref(false);
let major = ref<majorInfoData>({
  _id: null,
  majorname: "",
});
const majorFormRef = ref<FormInstance>();

let rules = reactive<FormRules>({
  majorname: [
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
        majorStore.addMajor(major.value).then(() => {
          majorFormVisible.value = false;
          getMajorList();
        });
      } catch (error) {}
    } else {
    }
  });
};
let handleAdd = () => {
  major.value = {
    _id: null,
    majorname: "",
  };
  majorFormVisible.value = true;
  nextTick(() => {
    majorFormRef.value?.resetFields();
  });
};
</script>
<style scoped></style>

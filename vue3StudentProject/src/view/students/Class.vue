<template>
  <div style="margin: 20px 0">
    <el-form :inline="true" :model="searchMap" ref="searchFormRef">
      <el-form-item style="width: 150px">
        <el-select v-model="searchMap.teacher_id" placeholder="根据教师查询">
          <el-option
            v-for="item in teacherOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="width: 150px">
        <el-select v-model="searchMap.manager_id" placeholder="根据学管查询">
          <el-option
            v-for="item in managerOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchData">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="handleAdd">新增班级</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <el-table :data="classes" style="width: 100%" height="380px" border>
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column property="classname" label="班级名称" />
      <el-table-column
        property="teacher_id"
        label="授课教师"
        :formatter="resetTeacher"
      />
      <el-table-column
        property="manager_id"
        label="学管"
        :formatter="resetManager"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            @click="handleEdit(scope.row._id)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row._id)"
          >
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
  <el-dialog v-model="classFormVisible" title="添加班级" width="500">
    <el-form :model="updateClass" :rules="rules" ref="classFormRef">
      <el-form-item label="班级名称:" prop="classname">
        <el-input v-model="updateClass.classname" />
      </el-form-item>
      <el-form-item label="授课教师:" prop="teacher_id">
        <el-select v-model="updateClass.teacher_id" placeholder="点击选择">
          <el-option
            v-for="item in teacherOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学管:" prop="manager_id">
        <el-select v-model="updateClass.manager_id" placeholder="点击选择">
          <el-option
            v-for="item in managerOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="
            updateClass._id == null
              ? addData(classFormRef)
              : updateData(classFormRef)
          "
          >确定</el-button
        >
        <el-button @click="classFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { classInfoData } from "@/api/class/type";
import { ref, reactive, onMounted, nextTick } from "vue";
import useClassStore from "@/store/modules/class";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { roleInfoData } from "@/api/role/type";
import { userInfoData } from "@/api/user/type";
import useRoleStore from "@/store/modules/role";
import useUserStore from "@/store/modules/user";
const getClassList = () => {
  classStore
    .getClassList({ page: currentPage.value, size: pageSize.value, searchMap })
    .then((res) => {
      classes.value = classStore.classes;
      total.value = res?.total as number;
    });
};
const classes = ref<classInfoData[] | undefined>();
let classStore = useClassStore();
let updateClass = ref<classInfoData>({
  _id: null,
  classname: "",
  teacher_id: "",
  manager_id: "",
});
let classFormVisible = ref(false);
const classFormRef = ref<FormInstance>();
let currentPage = ref(1);
let pageSize = ref(5);
let total = ref(0);
let handleSizeChange = (val: number) => {
  pageSize.value = val;
  getClassList();
};
let handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getClassList();
};
let rules = reactive<FormRules>({
  classname: [{ required: true, message: "请输入班级名称" }],
  teacher_id: [{ required: true, message: "请添加授课教师" }],
  manager_id: [{ required: true, message: "请添加学管" }],
});
let handleEdit = (_id: string) => {
  handleAdd();
  classStore.getClassById(_id).then((res) => {
    updateClass.value = res as classInfoData;
  });
};
let updateData = (formEL: FormInstance | undefined) => {
  if (!formEL) {
    return;
  }
  formEL.validate(async (valid) => {
    if (valid) {
      classStore.updateClass(updateClass.value).then(() => {
        classFormVisible.value = false;
        getClassList();
      });
    }
  });
};
let handleDelete = (_id: string) => {
  ElMessageBox.confirm("你确定删除吗", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      classStore.deleteClass(_id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getClassList();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};

let addData = (formEL: FormInstance | undefined) => {
  if (!formEL) {
    return;
  }
  formEL.validate(async (valid) => {
    if (valid) {
      const oldPage = currentPage.value;
      classStore.addClass(updateClass.value).then(() => {
        classFormVisible.value = false;

        getClassList();
        const maxPage = Math.ceil(total.value / pageSize.value);

        // 智能调整逻辑
        if (oldPage === maxPage || oldPage > maxPage) {
          currentPage.value = maxPage;
        }

        // 数据可能发生变化，强制刷新
        getClassList();
      });
    } else {
    }
  });
};
let handleAdd = () => {
  updateClass.value = {
    _id: null,
    classname: "",
    teacher_id: "",
    manager_id: "",
  };
  classFormVisible.value = true;
  nextTick(() => {
    classFormRef.value?.resetFields();
  });
};
let teacherOptions = ref<roleInfoData[] | undefined>([]);
let managerOptions = ref<roleInfoData[] | undefined>([]);
let teacher_role_id = ref<string | undefined>("");
let manager_role_id = ref<string | undefined>("");
let userStore = useUserStore();
let roleStore = useRoleStore();
let roleOptions = ref<roleInfoData[] | undefined>([]);
let userOptions = ref<userInfoData[] | undefined>([]);
const getUserList = () => {
  userStore.getUserAll().then(() => {
    userOptions.value = userStore.users;
    userOptions.value.forEach((item) => {
      if (item.role_id == teacher_role_id.value) {
        teacherOptions.value?.push(item);
      } else if (item.role_id == manager_role_id.value) {
        managerOptions.value?.push(item);
      }
    });
  });
};
const getRoleList = () => {
  roleStore.roleList().then(() => {
    roleOptions.value = roleStore.roles;
    roleOptions.value?.forEach((item) => {
      if (item.name == "教师") {
        teacher_role_id.value = item._id;
      } else if (item.name == "学管") {
        manager_role_id.value = item._id;
      }
    });
  });
};
const resetTeacher = (_row: any, _column: any, cellValue: any, _index: any) => {
  console.log(cellValue, teacherOptions.value, "====");

  let teacher = teacherOptions.value?.find((item) => item._id == cellValue) || {
    name: "",
  };
  console.log(teacher);

  return teacher.name;
};
const resetManager = (_row: any, _column: any, cellValue: any, _index: any) => {
  let manager = managerOptions.value?.find((item) => item._id == cellValue) || {
    name: "",
  };
  return manager.name;
};
let searchMap = reactive({
  teacher_id: "",
  manager_id: "",
});
let searchFormRef = ref<FormInstance>();
let resetForm = () => {
  searchMap.manager_id = "";
  searchMap.teacher_id = "";
  currentPage.value = 1;
  getClassList();
};
let searchData = () => {
  currentPage.value = 1;
  getClassList();
};

onMounted(() => {
  Promise.all([getRoleList(), getUserList()]).then(() => {
    getClassList();
  });
});
</script>
<style scoped></style>

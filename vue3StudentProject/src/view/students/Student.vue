<template>
  <div style="margin: 20px 0">
    <el-form :inline="true" :model="searchMap" ref="searchFormRef">
      <el-form-item style="width: 150px">
        <el-input
          v-model="searchMap.name"
          placeholder="根据姓名查询"
        ></el-input>
      </el-form-item>

      <el-form-item style="width: 157px">
        <el-select v-model="searchMap.direction" placeholder="根据学习方向查询">
          <el-option
            v-for="item in directionOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="width: 150px">
        <el-select v-model="searchMap.class" placeholder="根据班级查询">
          <el-option
            v-for="item in classOptions"
            :key="item._id"
            :label="item.classname"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
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
        <el-button @click="handleAdd">新增学员</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-if="students">
    <el-table :data="students" style="width: 100%" height="380px" border>
      <el-table-column type="expand">
        <template #default="props">
          <div>
            <p>学生姓名: {{ props.row.name }}</p>
            <p>性别: {{ dataFilter(props.row.gender, genderOptions) }}</p>
            <p>所在学校: {{ props.row.school }}</p>
            <p>专业: {{ props.row.student }}</p>
            <p>年级: {{ dataFilter(props.row.grade, gradeOptions) }}</p>
            <p>学历: {{ dataFilter(props.row.education, educationOptions) }}</p>
            <p>
              学习方向: {{ dataFilter(props.row.direction, directionOptions) }}
            </p>
            <p>身份证号码: {{ props.row.id_number }}</p>
            <p>电话号码: {{ props.row.phone }}</p>
            <p>家长姓名: {{ props.row.parent }}</p>
            <p>家长联系电话: {{ props.row.parent_phone }}</p>
            <p>家庭住址: {{ props.row.address }}</p>
            <p>QQ号码: {{ props.row.qq }}</p>
            <p>所在班级: {{ classFilter(props.row.class, classOptions) }}</p>
            <p>入学时间: {{ props.row.admission_date }}</p>
            <p>
              授课教师: {{ dataFilter(props.row.teacher_id, teacherOptions) }}
            </p>
            <p>学管: {{ dataFilter(props.row.manager_id, managerOptions) }}</p>
            <p>
              照片:
              <el-image
                v-for="(item, index) in props.row.pictures"
                :key="index"
                style="width: 100px; height: 100px"
                :src="baseApi + '/upload/' + item"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="getSrcList(props.row.pictures)"
                :initial-index="4"
                fit="cover"
              />
            </p>
            <p>备注信息:<span v-html="props.row.note"> </span></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column label="学生姓名" prop="name" width="100px" />
      <el-table-column label="性别" prop="gender" width="100px">
        <template #default="scope">
          {{ dataFilter(scope.row.gender, genderOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="学习方向" prop="direction">
        <template #default="scope">
          {{ dataFilter(scope.row.direction, directionOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="phone" />
      <el-table-column label="所在班级" prop="class">
        <template #default="scope">
          {{ classFilter(scope.row.class, classOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="授课教师" prop="teacher_id">
        <template #default="scope">
          {{ dataFilter(scope.row.teacher_id, teacherOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="学管" prop="manager_id">
        <template #default="scope">
          {{ dataFilter(scope.row.manager_id, managerOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="入学时间" prop="admission_date" />
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
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from "vue";
import useStudentStore from "@/store/modules/student";
import useClassStore from "@/store/modules/class";
import useRoleStore from "@/store/modules/role";
import useUserStore from "@/store/modules/user";
import type { studentInfoData } from "@/api/student/type";
import type { classInfoData } from "@/api/class/type";
import type { roleInfoData } from "@/api/role/type";
import type { userInfoData } from "@/api/user/type";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { useRouter } from "vue-router";

const baseApi = import.meta.env.VITE_APP_BASE_API;

let $router = useRouter();
const students = ref<studentInfoData[] | undefined>([]);
let studentStore = useStudentStore();
let classStore = useClassStore();
let roleStore = useRoleStore();
let userStore = useUserStore();

let teacherOptions = ref<roleInfoData[] | undefined>([]);
let managerOptions = ref<roleInfoData[] | undefined>([]);
let classOptions = ref<classInfoData[] | undefined>([]);
let roleOptions = ref<roleInfoData[] | undefined>([]);
let userOptions = ref<userInfoData[] | undefined>([]);
// 根据后端返回的_id,手写过滤器，并显示对应的名字
let genderOptions = ref<FilterData[]>([
  {
    _id: "0",
    name: "男",
  },
  {
    _id: "1",
    name: "女",
  },
]);
let gradeOptions = ref<FilterData[]>([
  {
    _id: "1",
    name: "大一",
  },
  {
    _id: "2",
    name: "大二",
  },
  {
    _id: "3",
    name: "大三",
  },
  {
    _id: "4",
    name: "大四",
  },
  {
    _id: "5",
    name: "研究生",
  },
]);
let educationOptions = ref<FilterData[]>([
  {
    _id: "1",
    name: "专科",
  },
  {
    _id: "2",
    name: "本科",
  },
  {
    _id: "3",
    name: "硕士",
  },
  {
    _id: "4",
    name: "社会",
  },
]);
let directionOptions = ref<FilterData[]>([
  {
    _id: "1",
    name: "web前端",
  },
  {
    _id: "2",
    name: "java",
  },
  {
    _id: "3",
    name: "c/c++",
  },
  {
    _id: "4",
    name: "少儿编程",
  },
  {
    _id: "5",
    name: "产品经理",
  },
]);
let teacher_role_id = ref<string | undefined>("");
let manager_role_id = ref<string | undefined>("");

let dataFilter = (_id: string, options: any) => {
  const obj = options.find((item: any) => item._id == _id);
  return obj ? obj.name : "";
};
let classFilter = (_id: string, options: any) => {
  const obj = options.find((item: any) => item._id == _id);
  return obj ? obj.classname : "";
};
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
const getClassList = () => {
  if (classStore.classes?.length) {
    classOptions.value = classStore.classes;
  } else {
    classStore.getClassAll().then(() => {
      classOptions.value = classStore.classes;
    });
  }
};
const getStudentList = () => {
  studentStore
    .getStudentList({
      page: currentPage.value,
      size: pageSize.value,
      searchMap,
    })
    .then((res) => {
      students.value = studentStore.students;
      total.value = res?.total as number;
    });
};

let student = ref<studentInfoData>({
  name: "",
  gender: "",
  direction: "",
  class: "",
  teacher_id: "",
  manager_id: "",
  student_id: "",
});
interface FilterData {
  _id: string;
  name: string;
}

let handleEdit = (_id: string) => {
  $router.push(`/student/update/${_id}`);
};
let handleDelete = (_id: string) => {
  ElMessageBox.confirm("你确定删除吗", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    studentStore.deleteStudent(_id).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getStudentList();
    });
  });
};

// 分页
let currentPage = ref(1);
let pageSize = ref(5);
let total = ref(0);
let handleSizeChange = (val: number) => {
  pageSize.value = val;
  getStudentList();
};
let handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getStudentList();
};
let studentFormVisible = ref(false);

const studentFormRef = ref<FormInstance>();

let handleAdd = () => {
  $router.push(`/student/update/-1`);
  student.value = {
    name: "",
    gender: "",
    direction: "",
    class: "",
    teacher_id: "",
    manager_id: "",
    student_id: "",
  };
  studentFormVisible.value = true;
  nextTick(() => {
    studentFormRef.value?.resetFields();
  });
};

let resetForm = () => {
  searchMap.name = "";
  searchMap.direction = "";
  searchMap.class = "";
  searchMap.teacher_id = "";
  searchMap.manager_id = "";
  getStudentList();
};
let searchMap = reactive({
  name: "",
  direction: "",
  class: "",
  teacher_id: "",
  manager_id: "",
});
let searchData = () => {
  currentPage.value = 1;
  getStudentList();
};
const getSrcList = (imgList: string[]) => {
  const srcList = imgList.map((item) => baseApi + "/upload/" + item);
  // console.log("图片路径列表:", srcList);
  return srcList;
};

onMounted(() => {
  Promise.all([getRoleList(), getUserList(), getClassList()]).then(() => {
    getStudentList();
  });
});
</script>
<style scoped></style>

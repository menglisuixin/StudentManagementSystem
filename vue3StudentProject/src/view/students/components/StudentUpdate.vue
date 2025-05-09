<template>
  <div class="student-update">
    <el-button icon="Back" @click="$router.push('/student')"></el-button>
    <el-form
      class="update-form"
      label-position="right"
      label-width="100px"
      style="width: 100%; height: 100%"
      :status-icon="true"
      :model="updateStudent"
      :rules="rules"
      ref="studentFormRef"
    >
      <!-- <el-form-item label="姓名" prop="name">
        <el-input v-model="updateStudent.name" />
      </el-form-item> -->
      <!--
      用v-model绑定updateStudent.name属性，
      提交表单用的是updateStudent对象，
      所以从这里取数据
       -->
      <el-form-item label="姓名">
        <el-select
          v-model="updateStudent.name"
          class="filter-item"
          placeholder="请点击选择"
        >
          <!-- value取名字 -->
          <el-option
            v-for="option in studentOptions"
            :key="option._id"
            :label="option.name"
            :value="option.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="updateStudent.gender"
          class="filter-item"
          placeholder="请点击选择"
          width="600px"
        >
          <el-option
            v-for="option in genderOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在学校" prop="school">
        <el-autocomplete
          class="inline-input"
          v-model="updateStudent.school"
          :fetch-suggestions="querySearchSchool"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-autocomplete
          class="inline-input"
          v-model="updateStudent.major"
          :fetch-suggestions="querySearchMajor"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select
          v-model="updateStudent.grade"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in gradeOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select
          v-model="updateStudent.education"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in educationOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学习方向" prop="direction">
        <el-select
          v-model="updateStudent.direction"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in directionOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码" prop="id_number">
        <el-input v-model="updateStudent.id_number" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="updateStudent.phone" />
      </el-form-item>
      <el-form-item label="家长姓名" prop="parent">
        <el-input v-model="updateStudent.parent" />
      </el-form-item>
      <el-form-item label="家长联系电话" prop="parent_phone">
        <el-input v-model="updateStudent.parent_phone" />
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input v-model="updateStudent.address" />
      </el-form-item>
      <el-form-item label="QQ号码" prop="qq">
        <el-input v-model="updateStudent.qq" />
      </el-form-item>
      <el-form-item label="所在班级" prop="class">
        <el-select
          v-model="updateStudent.class"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in classOptions"
            :key="option._id"
            :label="option.classname"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入学时间" prop="admission_date">
        <el-date-picker
          v-model="updateStudent.admission_date"
          type="date"
          placeholder="请点击选择"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="授课教师" prop="teacher_id">
        <el-select
          v-model="updateStudent.teacher_id"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in teacherOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学管" prop="manager_id">
        <el-select
          v-model="updateStudent.manager_id"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in managerOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="照片" prop="pictures">
        <el-upload
          :file-list="fileList"
          :action="baseApi + '/manage/img/upload'"
          list-type="picture-card"
          :on-change="handleChange"
          name="image"
          :auto-upload="true"
          accept="image/*"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <div>
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <el-icon><zoom-in /></el-icon>
                </span>

                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible" style="width: 450px">
          <img
            style="width: 400px; height: 400px"
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <Editor
          :api-key="tiny.apiKey"
          :init="tiny.init"
          v-model="updateStudent.note"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="
          updateStudent._id == null
            ? addData(studentFormRef)
            : updateData(studentFormRef)
        "
      >
        确定
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import useUserStore from "@/store/modules/user";
import useRoleStore from "@/store/modules/role";
import useClassStore from "@/store/modules/class";
import useMajorStore from "@/store/modules/major";
import useSchoolStore from "@/store/modules/school";
import useStudentStore from "@/store/modules/student";
import { roleInfoData } from "@/api/role/type";
import { classInfoData } from "@/api/class/type";
import { userInfoData } from "@/api/user/type";
import { schoolInfoData } from "@/api/school/type";
import { majorInfoData } from "@/api/major/type";
import { studentInfoData } from "@/api/student/type";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile, UploadFile } from "element-plus";
import request from "@/utils/request";
import Editor from "@tinymce/tinymce-vue";
let $router = useRouter();
let $route = useRoute();
// 更新/添加学员数据对象
const updateStudent = ref<studentInfoData>({
  _id: null,
  name: "", //姓名
  gender: "", //性别
  school: "", //学校
  major: "", //专业
  grade: "", //年级
  education: "", //学历
  direction: "", //学习方向
  id_number: "", //身份号码
  phone: "", //电话号码
  parent: "", //家长姓名
  parent_phone: "", //家长联系电话
  address: "", //家庭住址
  qq: "", //QQ号码
  class: "", //所在班级
  admission_date: "", //入学时间
  teacher_id: "", //教师id
  manager_id: "", //学管id
  student_id: "",
  pictures: [], //照片数组
  note: "", //备注信息
});
let validatePhone = (_rule: any, value: any, callback: any) => {
  value = value.trim();
  const pwdReg = /^1[3-9]\d{9}$/;
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else if (!pwdReg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};

// 自定义校验规则（身份证号码）
const validateIdNumber = (_rule: any, value: any, callback: any) => {
  value = value.trim();
  const _IDRe18 =
    /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const _IDre15 =
    /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;

  if (_IDRe18.test(value) || _IDre15.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确的身份证号码"));
  }
};
let rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: "请选择性别",
      trigger: "blur",
    },
  ],
  direction: [
    {
      required: true,
      message: "请选择学习方向",
      trigger: "blur",
    },
  ],
  id_number: [
    {
      required: true,
      validator: validateIdNumber,
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {
      required: true,
      validator: validatePhone,
      trigger: ["blur", "change"],
    },
  ],
  class: [
    {
      required: true,
      message: "请选择班级",
      trigger: "blur",
    },
  ],
  admission_date: [
    {
      required: true,
      message: "请选择入学时间",
      trigger: "blur",
    },
  ],
  teacher_id: [
    {
      required: true,
      message: "请选择授课教师",
      trigger: "blur",
    },
  ],
  manager_id: [
    {
      required: true,
      message: "请选择学管",
      trigger: "blur",
    },
  ],
});
interface FilterData {
  _id: string;
  name: string;
}
let classStore = useClassStore();
let roleStore = useRoleStore();
let userStore = useUserStore();
let majorStore = useMajorStore();
let schoolStore = useSchoolStore();
let studentStore = useStudentStore();
let teacherOptions = ref<roleInfoData[] | undefined>([]);
let managerOptions = ref<roleInfoData[] | undefined>([]);
let studentOptions = ref<userInfoData[] | undefined>([]);
let classOptions = ref<classInfoData[] | undefined>([]);
let roleOptions = ref<roleInfoData[] | undefined>([]);
let userOptions = ref<userInfoData[] | undefined>([]);
let schoolOptions = ref<schoolInfoData[] | undefined>([]);
let majorOptions = ref<majorInfoData[] | undefined>([]);
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
let student_role_id = ref<string | undefined>("");
const getUserList = () => {
  userStore.getUserAll().then(() => {
    userOptions.value = userStore.users;
    userOptions.value.forEach((item) => {
      if (item.role_id == teacher_role_id.value) {
        teacherOptions.value?.push(item);
      } else if (item.role_id == manager_role_id.value) {
        managerOptions.value?.push(item);
      } else if (item.role_id === student_role_id.value) {
        studentOptions.value?.push(item);
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
      } else if (item.name === "学生") {
        // 获取学生角色的 ID
        student_role_id.value = item._id;
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

const getSchoolList = () => {
  if (schoolStore.schools?.length) {
    schoolOptions.value = schoolStore.schools;
  } else {
    schoolStore.getSchoolAll().then(() => {
      schoolOptions.value = schoolStore.schools;
    });
  }
};
const getMajorList = () => {
  if (majorStore.majors?.length) {
    majorOptions.value = majorStore.majors;
  } else {
    majorStore.getMajorAll().then(() => {
      majorOptions.value = majorStore.majors;
    });
  }
};
const getStudentList = () => {
  const { id } = $route.params;
  if (id != "-1") {
    studentStore.getStudentById(id as string).then((res) => {
      updateStudent.value = res as studentInfoData;
      const { pictures } = res as studentInfoData;
      if (pictures && pictures.length != 0) {
        fileList.value = pictures.map((item) => ({
          name: item,
          url: baseApi + "/upload/" + item,
        }));
      }
    });
  }
};
// 用来生成过滤规则的函数
let createFilter = (queryString: string) => {
  return (res: any) => {
    // 判断当前项是不是以用户输入的字符串开头，如果是，那么indeOf返回值为0，return true 否则return false
    return res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};
let querySearchSchool = (queryString: any, cb: any) => {
  // 为学校选项中的每一个人绑定value属性值为学校名称
  schoolOptions.value?.forEach((item: any) => {
    item.value = item.schoolname;
  });
  // 用变量接收用户输入的字符串，如果字符串不为空则根据工厂函数返回的规律规则（true or false）如果为true则保留，false则过滤掉，这样返回的就是过滤后的学校若字符串为空直接返回全部学校
  let result = queryString
    ? schoolOptions.value?.filter(createFilter(queryString))
    : schoolOptions.value;
  cb(result);
};
let querySearchMajor = (queryString: any, cb: any) => {
  majorOptions.value?.forEach((item: any) => {
    item.value = item.majorname;
  });
  let result = queryString
    ? majorOptions.value?.filter(createFilter(queryString))
    : majorOptions.value;
  cb(result);
};

const studentFormRef = ref<FormInstance>();
onMounted(() => {
  getRoleList();
  getUserList();
  getClassList();
  getSchoolList();
  getMajorList();
  getStudentList();
});
let addData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      console.log(updateStudent.value);

      updateStudent.value.pictures = getImgs();
      studentStore.addStudent(updateStudent.value).then(() => {
        $router.replace("/student");
      });
    }
  });
};
let updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      updateStudent.value.pictures = getImgs();
      studentStore.updateStudent(updateStudent.value).then(() => {
        $router.replace("/student");
      });
    }
  });
};
let baseApi = import.meta.env.VITE_APP_BASE_API;
// let baseUrl = import.meta.env.VITE_APP_SERVICE_URL;
let dialogImageUrl = ref();
let dialogVisible = ref(false);
let disabled = ref(false);
let fileList = ref<UploadUserFile[]>([]);
let handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  if (uploadFile.status == "success") {
    const result: any = uploadFile.response;
    if (result.status == 0) {
      const { name, url } = result.data;
      uploadFile = uploadFiles[uploadFiles.length - 1];
      uploadFile.name = name;
      uploadFile.url = url;
    }
  }
  fileList.value = uploadFiles;
};
let getImgs = () => {
  return fileList.value.map((item) => item.name);
};
let handleRemove = (file: UploadFile) => {
  request
    .post<any, any>("/manage/img/delete", { name: file.name })
    .then((res) => {
      if (res.status == 0) {
        fileList.value.splice(fileList.value.indexOf(file), 1);
      }
    });
};
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
const tiny = reactive({
  apiKey: "fug9o90qmh5vu3vp010ayiqz9iuf14eyzgayi7wvtm6ue6mm",
  init: {
    toolbar_mode: "sliding",
    plugins:
      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss",
    toolbar:
      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
    tinycomments_mode: "embedded",
    tinycomments_author: "Author name",
    mergetags_list: [
      { value: "First.Name", title: "First Name" },
      { value: "Email", title: "Email" },
    ],
    ai_request: (_request: any, respondWith: any) =>
      respondWith.string(() =>
        Promise.reject("See docs to implement AI Assistant")
      ),
  },
});
</script>
<style scoped></style>

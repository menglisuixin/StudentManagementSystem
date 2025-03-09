<template>
  <div class="header">
    <a href="#">
      <img class="logo" src="@/assets/vue.svg" alt="" />
      <span class="company">学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ userStore.user?.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="date">{{ currentTime }}</span>
    <!-- 弹出对话框 -->
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
      <el-form :model="userForm" :rules="rules" ref="userFormRef">
        <el-form-item label="原始密码" prop="oldPass">
          <el-input type="password" v-model="userForm.oldPass" />
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="userForm.pass" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userForm.checkPass" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updatePwd(userFormRef)">确认修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { formateTime } from "@/utils/dateUtils";
import { ref, onUnmounted, reactive } from "vue";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { reqCheckPwd, reqUpdatePwd } from "@/api/user/index";
import { nextTick } from "vue";

let $router = useRouter();
let userStore = useUserStore();
let currentTime = ref<string>(formateTime(Date.now()));
let timer = setInterval(function () {
  currentTime.value = formateTime(Date.now());
}, 1000);
onUnmounted(() => {
  clearInterval(timer);
});
const handleCommand = (command: string) => {
  switch (command) {
    case "a":
      // console.log("修改密码");
      handlePwd();
      break;
    case "b":
      // console.log("退出系统");
      handleLogOut();
      break;
    default:
      break;
  }
};
const handleLogOut = () => {
  userStore.removeUser();
  if (!userStore.user) {
    $router.replace("/login");
  }
};
let userFormRef = ref<FormInstance>();
let dialogFormVisible = ref(false);
let userForm = reactive({
  oldPass: "",
  pass: "",
  checkPass: "",
});
let validateOldPass = (_rule: any, value: any, callback: any) => {
  reqCheckPwd({ userId: userStore.user?._id as string, password: value }).then((res) => {
    if (res.status == 0) {
      callback();
    } else {
      callback(new Error(res.msg));
    }
  });
};
let validateCheckPass = (_rule: any, value: any, callback: any) => {
  if (value !== userForm.pass) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};
let rules = reactive<FormRules>({
  oldPass: [
    {
      required: true,
      validator: validateOldPass,
      trigger: ["blur"],
    },
  ],
  pass: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  checkPass: [
    {
      required: true,
      validator: validateCheckPass,
      trigger: ["blur"],
    },
  ],
});
let updatePwd = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate((valid) => {
    if (valid) {
      reqUpdatePwd({
        userId: userStore.user?._id as string,
        password: userForm.pass,
      }).then((res) => {
        if (res.status == 0) {
          handleLogOut();
          dialogFormVisible.value = false;
        }
      });
    }
  });
};
let handlePwd = () => {
  dialogFormVisible.value = true;
  nextTick(() => {
    userFormRef.value?.resetFields();
  });
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
  width: 20px;
}
.company {
  position: absolute;
  color: #fff;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
  height: 50px;
  line-height: 50px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  outline: none;
  align-items: center;
}
.date {
  float: right;
  color: #fff;
  margin-right: 50px;
}
</style>

<template>
  <div class="login-container">
    <el-form
      ref="ruleFormRef"
      :model="form"
      status-icon
      label-width="80px"
      class="login-form"
      :rules="rules"
    >
      <h2 class="login-title">登&emsp;录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" type="text" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const ruleFormRef = ref<FormInstance>();

const form = reactive({
  username: "",
  password: "",
});

let validateUserName = (_rule: any, value: any, callback: any) => {
  value = value.trim();
  const length = value && value.length;
  const pwdReg = /^[A-z0-9_]+$/;
  if (value == "") {
    callback(new Error("请输入账号"));
  } else if (length < 4 || length > 12) {
    callback(new Error("长度必须在4-12之间"));
  } else if (!pwdReg.test(value)) {
    callback(new Error("必须是数字字母下划线组成"));
  } else {
    callback();
  }
};

let rules = reactive<FormRules>({
  username: [
    {
      required: true,
      validator: validateUserName,
      trigger: ["change", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});

let onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate((valid) => {
    if (valid) {
      console.log("success");
    } else {
      console.log("error");
    }
  });
};
</script>
<style scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../../assets/login-bg.jpg") no-repeat center/100%;
}
.login-form {
  width: 350px;
  border-radius: 20px 10px;
  background-color: #ffffff71;
  box-shadow: #35343481 0px 0px 3px;
  padding: 30px;
  margin: 260px auto;
}
.login-title {
  text-align: center;
  color: #00000077;
}
</style>

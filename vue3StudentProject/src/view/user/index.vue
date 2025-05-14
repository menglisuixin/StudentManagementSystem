<template>
  <div style="margin: 20px 0">
    <el-button @click="handleAdd">新增用户</el-button>
  </div>
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
        <el-button type="success" @click="handleEdit(scope.row._id)">
          编辑
        </el-button>
        <el-button type="danger" @click="handleDelete(scope.row._id)">
          删除
        </el-button>
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
  <!-- 弹出对话框 -->
  <el-dialog v-model="userFormVisible" :title="dialogTitle" width="500">
    <el-form :model="user" :rules="rules" ref="userFormRef" label-width="90px">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input type="password" v-model="user.password" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="角色类型" prop="role_id">
        <el-select v-model="user.role_id" placeholder="点击选择">
          <el-option
            v-for="item in roleOptions"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="user.phone" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="
            user._id == undefined
              ? addData(userFormRef)
              : updateData(userFormRef)
          "
          >确定</el-button
        >
        <el-button @click="userFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { formateDate } from "@/utils/dateUtils";
import useRoleStore from "@/store/modules/role";
import { roleInfoData } from "@/api/role/type";
import useUserStore from "@/store/modules/user";
import type { userInfoData } from "@/api/user/type";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { nextTick } from "vue";
const dialogTitle = ref("");
let roleStore = useRoleStore();
let userStore = useUserStore();
const users = ref<userInfoData[] | undefined>();

const getUserList = async () => {
  const res = await userStore.getUserList({
    page: currentPage.value,
    size: pageSize.value,
  });
  users.value = userStore.users;
  total.value = res?.total as number;
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
  let role = roleOptions.value?.find((item) => item._id == cellValue) || {
    name: "",
  };
  return role.name;
};
let handleEdit = (_id: string) => {
  handleAdd();
  userStore.getUserById(_id).then((res) => {
    console.log(res);
    user.value = res as userInfoData;
  });
  dialogTitle.value = "编辑用户";
  // console.log(_id);
};
let updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      userStore.updateUser(user.value).then(() => {
        userFormVisible.value = false;
        getUserList();
      });
    } else {
    }
  });
};
let handleDelete = (_id: string) => {
  // console.log(_id);
  ElMessageBox.confirm("你确定删除吗", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore.deleteUser(_id).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getUserList();
    });
  });
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
  pageSize.value = val;
  getUserList();
};
let handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getUserList();
};
let userFormVisible = ref(false);
let user = ref<userInfoData>({
  _id: undefined,
  username: "",
  password: "",
  phone: "",
  name: "",
  role_id: "",
});
const userFormRef = ref<FormInstance>();
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
let validatePhone = (_rule: any, value: any, callback: any) => {
  value = value.trim();
  const pwdReg =
    /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  if (value == "") {
    callback(new Error("请输入手机号"));
  } else if (!pwdReg.test(value)) {
    callback(new Error("请输入正确的手机号"));
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
    {
      min: 3,
      message: "密码长度必须大于3",
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: ["blur"],
    },
  ],
  role_id: [
    {
      required: true,
      message: "请选择角色",
      trigger: ["blur"],
    },
  ],
  phone: [
    {
      required: true,
      validator: validatePhone,
      trigger: ["blur"],
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
        // 保存当前页码用于后续计算
        const oldPage = currentPage.value;

        userStore.addUser(user.value).then(() => {
          userFormVisible.value = false;

          // 先获取最新数据（含更新后的total）
          getUserList().then(() => {
            // 计算最大页码
            const maxPage = Math.ceil(total.value / pageSize.value);

            // 智能调整页码逻辑
            if (oldPage === maxPage) {
              // 如果之前就在最后一页，保持当前页
              currentPage.value = maxPage;
            } else if (oldPage > maxPage) {
              // 如果新增导致总页数减少（如刚好满页时新增）
              currentPage.value = maxPage;
            }
            // 其他情况保持当前页码

            // 强制刷新数据（考虑分页边界情况）
            getUserList();
          });
        });
      } catch (error) {
        ElMessage.error("添加失败");
      }
    } else {
    }
  });
};
let handleAdd = () => {
  user.value = {
    _id: undefined,
    username: "",
    password: "",
    phone: "",
    name: "",
    role_id: "",
  };
  userFormVisible.value = true;
  dialogTitle.value = "添加用户";
  nextTick(() => {
    userFormRef.value?.resetFields();
  });
};
</script>
<style scoped></style>

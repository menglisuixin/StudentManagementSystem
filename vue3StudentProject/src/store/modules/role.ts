import { defineStore } from "pinia";
import { getRoleList, addRole, updateRole, deleteRole } from "@/api/role/index";
import { RoleState } from "./types/type";
import type {
  getRoleListResponseData,
  roleInfoData,
  addRoleResponseData,
  deleteRoleResponseData,
} from "@/api/role/type";

let useRoleStore = defineStore("role", {
  state: (): RoleState => {
    return {
      roles: [],
    };
  },
  actions: {
    async roleList() {
      let result: getRoleListResponseData = await getRoleList();
      if (result.status == 0) {
        this.roles = result.data;
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async useAddRole(data: roleInfoData) {
      let result: addRoleResponseData = await addRole(data);
      if (result.status == 0) {
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async useUpdateRole(data: roleInfoData) {
      let result: addRoleResponseData = await updateRole(data);
      if (result.status == 0) {
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async useDeleteRole(data: roleInfoData) {
      let result: deleteRoleResponseData = await deleteRole(data);
      if (result.status == 0) {
        // 删除成功后重新获取列表
        await this.roleList();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});
export default useRoleStore;

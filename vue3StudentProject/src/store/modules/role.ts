import { defineStore } from "pinia";
import { getRoleList, addRole, updateRole, deleteRole } from "@/api/role/index";
import { RoleState } from "./types/type";
import type {
  getRoleListResponseData,
  roleInfoData,
  addRoleResponseData,
  deleteRoleResponseData,
} from "@/api/role/type";

/**
 * 角色状态管理模块
 * 负责处理角色数据的获取、添加、更新和删除等操作
 */
let useRoleStore = defineStore("role", {
  // 状态定义
  state: (): RoleState => {
    return {
      // 角色列表数据
      roles: [],
    };
  },

  // 定义方法
  actions: {
    /**
     * 获取角色列表
     * @returns 操作结果
     */
    async roleList() {
      let result: getRoleListResponseData = await getRoleList();
      if (result.status == 0) {
        // 获取成功，更新角色列表
        this.roles = result.data;
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 添加角色
     * @param data 角色信息
     * @returns 操作结果
     */
    async useAddRole(data: roleInfoData) {
      let result: addRoleResponseData = await addRole(data);
      if (result.status == 0) {
        await this.roleList();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 更新角色信息
     * @param data 角色信息
     * @returns 操作结果
     */
    async useUpdateRole(data: roleInfoData) {
      let result: addRoleResponseData = await updateRole(data);
      if (result.status == 0) {
        await this.roleList();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 删除角色
     * @param data 角色信息
     * @returns 操作结果
     */
    async useDeleteRole(data: roleInfoData) {
      let result: deleteRoleResponseData = await deleteRole(data);
      if (result.status == 0) {
        // 删除成功，重新获取角色列表以确保数据一致性
        await this.roleList();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});

export default useRoleStore;

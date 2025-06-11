import { defineStore } from "pinia";
import {
  reqLogin,
  reqUserAdd,
  reqUserAll,
  reqUserById,
  reqUserDelete,
  reqUserList,
  reqUserUpdate,
} from "@/api/user";
import type {
  loginFormData,
  loginResponseData,
  userAllResponseData,
  userInfoData,
  userListFormData,
  userListResponseData,
} from "@/api/user/type";
import type { UserState } from "./types/type";

/**
 * 用户状态管理模块
 * 负责处理用户认证、用户列表管理等功能
 */
let useUserStore = defineStore("user", {
  // 定义状态
  state: (): UserState => {
    return {
      // 当前登录用户信息，从本地存储中获取
      user: JSON.parse(localStorage.getItem("D2402-user") as string),
      // 用户列表数据
      users: [],
    };
  },
  // 定义方法
  actions: {
    /**
     * 用户登录
     * @param data 登录表单数据
     * @returns 登录成功返回 "OK"，失败返回错误
     */
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data);
      if (result.status == 0) {
        // 登录成功，保存用户信息到状态和本地存储
        this.user = result.data as userInfoData;
        localStorage.setItem("D2402-user", JSON.stringify(result.data));
        return "OK";
      } else {
        // 登录失败，返回错误
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 清除用户信息（登出）
     */
    removeUser() {
      this.user = null;
      localStorage.removeItem("D2402-user");
    },

    /**
     * 获取所有用户列表
     * @returns 获取成功返回 "OK"，失败返回错误
     */
    async getUserAll() {
      let result: userAllResponseData = await reqUserAll();
      if (result.status == 0) {
        // 获取成功，更新用户列表状态
        this.users = result.data as userInfoData[];
        return "OK";
      } else {
        // 获取失败，返回错误
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 获取分页用户列表
     * @param data 分页查询参数
     * @returns 返回分页数据
     */
    async getUserList(data: userListFormData) {
      let result: userListResponseData = await reqUserList(data);
      if (result.status == 0) {
        // 获取成功，更新用户列表状态
        this.users = result.data?.data as userInfoData[];
        return result.data;
      } else {
        // 获取失败，返回错误
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 添加用户
     * @param data 用户信息
     * @returns 添加成功返回 "OK"，失败返回错误
     */
    async addUser(data: userInfoData) {
      let result: loginResponseData = await reqUserAdd(data);
      if (result.status == 0) {
        // 添加成功，将新用户添加到用户列表
        this.users.push(result.data as userInfoData);
        return "OK";
      } else {
        // 添加失败，返回错误
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 根据 ID 获取用户信息
     * @param _id 用户 ID
     * @returns 返回用户信息
     */
    async getUserById(_id: string) {
      let result: loginResponseData = await reqUserById(_id);
      if (result.status == 0) {
        return result.data;
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 更新用户信息
     * @param data 用户信息
     * @returns 更新成功返回 "OK"，失败返回错误
     */
    async updateUser(data: userInfoData) {
      let result: loginResponseData = await reqUserUpdate(data);
      if (result.status == 0) {
        // 更新成功，重新获取用户列表以确保数据一致性
        await this.getUserAll();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 删除用户
     * @param userId 用户 ID
     * @returns 删除成功返回 "OK"，失败返回错误
     */
    async deleteUser(userId: string) {
      let result: loginResponseData = await reqUserDelete(userId);
      if (result.status == 0) {
        // 删除成功，重新获取用户列表以确保数据一致性
        await this.getUserAll();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});
export default useUserStore;

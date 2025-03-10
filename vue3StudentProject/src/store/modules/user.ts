import { defineStore } from "pinia";
import { reqLogin, reqUserAdd, reqUserAll, reqUserList } from "@/api/user";
import type {
  loginFormData,
  loginResponseData,
  userAllResponseData,
  userInfoData,
  userListFormData,
  userListResponseData,
} from "@/api/user/type";
import type { UserState } from "./types/type";

let useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      user: JSON.parse(localStorage.getItem("D2402-user") as string),
      users: [],
    };
  },
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data);
      if (result.status == 0) {
        this.user = result.data as userInfoData;
        localStorage.setItem("D2402-user", JSON.stringify(result.data));
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    removeUser() {
      this.user = null;
      localStorage.removeItem("D2402-user");
    },
    // 获取所有用户
    async getUserAll() {
      let result: userAllResponseData = await reqUserAll();
      if (result.status == 0) {
        this.users = result.data as userInfoData[];
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async getUserList(data: userListFormData) {
      let result: userListResponseData = await reqUserList(data);
      if (result.status == 0) {
        this.users = result.data?.data as userInfoData[];
        return result.data;
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async addUser(data: userInfoData) {
      let result: loginResponseData = await reqUserAdd(data);
      if (result.status == 0) {
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});
export default useUserStore;

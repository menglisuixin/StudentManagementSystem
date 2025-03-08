import { defineStore } from "pinia";
import { reqLogin } from "@/api/user";
import type { loginFormData, loginResponseData } from "@/api/user/type";
import type { UserState } from "./types/type";

let useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      token: localStorage.getItem("D2402-token"),
    };
  },
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data);
      if (result.status == 0) {
        this.token = result.data?.token as string;
        localStorage.setItem("D2402-token", result.data?.token as string);
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});
export default useUserStore;

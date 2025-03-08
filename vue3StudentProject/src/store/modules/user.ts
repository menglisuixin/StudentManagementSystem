import { defineStore } from "pinia";
import { reqLogin } from "@/api/user";
import type {
  loginFormData,
  loginResponseData,
  userInfoData,
} from "@/api/user/type";
import type { UserState } from "./types/type";

let useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      user: JSON.parse(localStorage.getItem("D2402-user") as string),
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
  },
});
export default useUserStore;

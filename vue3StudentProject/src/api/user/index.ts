// 最终发请求的地方
import request from "@/utils/request";
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from "./type";
// 枚举类型
enum API {
  LOGIN_URL = "/login",
  LOGOUT_URL = "/logout",
  USERINFO_URL = "/user/info",
}
//登录
export const reqLogin = (data: loginFormData) => {
  return request.post<any, loginResponseData>(API.LOGIN_URL, data);
};
// 获取用户信息
export const reqUserInfo = () => {
  return request.get<any, userInfoReponseData>(API.LOGIN_URL);
};
// 退出
export const reqLogOut = () => {
  return request.post<any, any>(API.LOGOUT_URL);
};

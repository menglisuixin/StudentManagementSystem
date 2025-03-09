// 最终发请求的地方
import request from "@/utils/request";
import type {
  loginFormData,
  loginResponseData,
  pwdData,
  checkPwdREsponseData,
} from "./type";
// 枚举类型
enum API {
  LOGIN_URL = "/login",
  LOGOUT_URL = "/logout",
  CHECK_PWD_URL = "/manage/user/pwd",
  UPDATE_PWD_URL = "/manage/user/pwd",
}
//登录
export const reqLogin = (data: loginFormData) => {
  return request.post<any, loginResponseData>(API.LOGIN_URL, data);
};
// 退出
export const reqLogOut = () => {
  return request.post<any, any>(API.LOGOUT_URL);
};
export const reqCheckPwd = (data: pwdData) =>
  request.post<any, checkPwdREsponseData>(API.CHECK_PWD_URL, data);
export const reqUpdatePwd = (data: pwdData) =>
  request.put<any, checkPwdREsponseData>(API.CHECK_PWD_URL, data);

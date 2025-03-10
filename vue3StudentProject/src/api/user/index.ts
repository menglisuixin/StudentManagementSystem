// 最终发请求的地方
import request from "@/utils/request";
import type {
  loginFormData,
  loginResponseData,
  pwdData,
  checkPwdREsponseData,
  userAllResponseData,
  userListFormData,
  userListResponseData,
  userInfoData,
} from "./type";
// 枚举类型
enum API {
  LOGIN_URL = "/login",
  LOGOUT_URL = "/logout",
  CHECK_PWD_URL = "/manage/user/pwd",
  UPDATE_PWD_URL = "/manage/user/pwd",
  USER_ALL_URL = "/manage/user/all",
  USER_LIST_URL = "/manage/user/list",
  USER_ADD_URL = "/manage/user/add",
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
export const reqUserAll = () =>
  request.get<any, userAllResponseData>(API.USER_ALL_URL);
export const reqUserList = (data: userListFormData) =>
  request.post<any, userListResponseData>(API.USER_LIST_URL, data);
export const reqUserAdd = (data: userInfoData) =>
  request.post<any, loginResponseData>(API.USER_ADD_URL, data);

// 约束接口的类型
// 登录接口需要携带参数ts类型
export interface loginFormData {
  username: string;
  password: string;
}
// 登录接口返回数据类型
export interface loginResponseData {
  status: number;
  data?: userInfoData;
  msg?: string;
}
// 角色数据类型
interface userRoleData {
  _id?: string;
  name?: string;
  menus: string[];
  create_time?: number;
  __v?: number;
  auth_time?: number;
  auth_name?: string;
}
// 服务器返回用户信息中data选项的数据类型
export interface userInfoData {
  token?: string;
  _id?: string;
  username: string;
  name?: string;
  password: string;
  phone?: string;
  role_id?: string;
  create_time: number;
  __v?: number;
  role: userRoleData;
}

//校验
export interface pwdData {
  userId: string;
  password: string;
}
// 校验的返回
export interface checkPwdREsponseData {
  status?: number;
  data?: userInfoData;
  msg?: string;
}
// 获取用户列表接口需要携带参数ts类型
export interface userListFormData {
  page: number;
  size: number;
}
// 获取所有用户接口返回数据类型
export interface userAllResponseData {
  status: number;
  data?: userInfoData[];
  msg?: string;
}
// 获取用户列表接口返回数据类型
export interface userListResponseData {
  status: number;
  data?: userListData;
  msg?: string;
}
// 用户列表data数据类型
export interface userListData {
  data: userInfoData[];
  roles: [];
  total: number;
}

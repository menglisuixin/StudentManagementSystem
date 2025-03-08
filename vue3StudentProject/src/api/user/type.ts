// 登录接口需要携带参数ts类型
export interface loginFormData {
  username: string;
  password: string;
}
// 登录接口返回数据类型中data选项的数据类型
interface dataType {
  token?: string;
}
// 登录接口返回数据类型
export interface loginResponseData {
  status: number;
  data?: dataType;
  msg?: string;
}
// 服务器返回用户信息中data选项的数据类型
interface userInfoData {
  _id?: string;
  username: string;
  name: string;
  password: string;
  phone: string;
  role_id: string;
  create_time: number;
  token: string;
  __v?: number;
}

// 服务器返回用户信息的数据类型
export interface userInfoReponseData {
  status: number;
  data: userInfoData;
}

import axios from "axios";
import { ElMessage } from "element-plus";

let request = axios.create({
  baseURL: "/mock",
  //   baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});
// 请求拦截器
request.interceptors.request.use((config) => {
  return config;
});
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 请求失败的回调
    let msg = "";
    let status = error.response.status;
    switch (status) {
      case 401:
        msg = "Token过期";
        break;
      case 403:
        msg = "无权访问";
        break;
      case 404:
        msg = "请求地址错误";
        break;
      case 500:
        msg = "服务器内部问题";
        break;
      default:
        msg = "网络不给力";
    }
    ElMessage({
      type: "error",
      message: msg,
    });
    return Promise.reject(error);
  }
);
export default request;

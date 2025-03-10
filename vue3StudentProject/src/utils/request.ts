import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";

let request = axios.create({
  // baseURL: "/mock",
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});
function msgText() {
  let userStore = useUserStore();
  const msg = "当前用户权限被修改请重新登录";
  localStorage.setItem("msg", msg);
  userStore.removeUser();
  if (!userStore.user) {
    window.location.href = "/login";
  }
}
// 获取权限列表
const getMenus = () => {
  let userStore = useUserStore();
  // 拿到当前登录人的角色
  const roleId = userStore.user?.role?._id;
  // 拿到当前登录人的权限列表
  const userMenus = userStore.user?.role?.menus;
  if (userStore.user?.username == "admin") {
    return;
  } else {
    request({
      url: "/menus",
      method: "post",
      data: {
        roleId,
      },
    }).then((res) => {
      if (res.status == 0) {
        const menus = res.data.menus;
        if (userMenus?.length == menus.length) {
          userMenus?.forEach((item) => {
            if (menus.indexOf(item) == -1) {
              msgText();
            }
          });
        } else {
          userStore.removeUser();
          msgText();
        }
      }
    });
  }
};
// 请求拦截器
request.interceptors.request.use((config) => {
  if (config.url != "/menus" && config.url != "/login") {
    getMenus();
  }
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

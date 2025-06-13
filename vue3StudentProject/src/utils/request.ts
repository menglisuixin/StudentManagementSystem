import axios from "axios";
import { ElMessage, ElLoading, ElNotification } from "element-plus";
import useUserStore from "@/store/modules/user";

// 创建 axios 实例，配置基础 URL 和超时时间
let request = axios.create({
  // baseURL: "/mock",
  //  import.meta找本地的环境变量
  baseURL: import.meta.env.VITE_APP_BASE_API, // 从环境变量获取 API 基础 URL
  timeout: 5000, // 请求超时时间设置为 5 秒
});

// 处理权限变更的函数
function msgText() {
  let userStore = useUserStore();
  const msg = "当前用户权限被修改请重新登录";
  localStorage.setItem("msg", msg); // 存储提示信息到本地存储
  userStore.removeUser(); // 清除用户信息
  if (!userStore.user) {
    // 确认用户信息已清除
    window.location.href = "/login"; // 重定向到登录页面
  }
}

// 获取并验证用户权限列表
const getMenus = () => {
  let userStore = useUserStore();
  // 获取当前登录用户的角色 ID
  const roleId = userStore.user?.role?._id;
  // 获取当前登录用户的权限列表
  const userMenus = userStore.user?.role?.menus;

  // 管理员用户跳过权限验证
  if (userStore.user?.username == "admin") {
    return;
  } else {
    // 发送请求获取最新权限列表
    request({
      url: "/menus",
      method: "post",
      data: {
        roleId,
      },
    }).then((res) => {
      if (res.status == 0) {
        const menus = res.data.menus;
        // 比较权限列表长度
        if (userMenus?.length == menus.length) {
          // 逐项比较权限项
          userMenus?.forEach((item) => {
            if (menus.indexOf(item) == -1) {
              // 权限不匹配，执行权限变更处理
              msgText();
            }
          });
        } else {
          // 权限列表长度不一致，执行权限变更处理
          msgText();
        }
      }
    });
  }
};

// 请求拦截器配置
request.interceptors.request.use(
  (config) => {
    // 对非权限验证和登录请求添加加载状态并验证权限
    if (config.url != "/menus" && config.url != "/login") {
      loading.open(); // 显示加载状态
      getMenus(); // 验证用户权限
    }
    return config; // 返回处理后的请求配置
  },
  (error) => {
    loading.close(); // 请求错误时关闭加载状态
    return Promise.reject(error); // 拒绝 Promise 并传递错误
  }
);

// 响应拦截器配置
request.interceptors.response.use(
  (response) => {
    const resp = response.data;
    console.log(resp); // 打印响应数据（调试用）

    // 业务状态码非 0 时显示警告通知
    if (resp.status !== 0) {
      ElNotification({
        title: "警告",
        message: resp.msg,
        type: "warning",
      });
    }
    loading.close(); // 关闭加载状态
    return response.data; // 返回响应数据
  },
  (error) => {
    // 请求失败的回调
    let msg = "";
    let status = error.response?.status;

    // 根据 HTTP 状态码设置错误消息
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

    // 显示错误消息
    ElMessage({
      type: "error",
      message: msg,
    });
    return Promise.reject(error); // 拒绝 Promise 并传递错误
  }
);

// 加载状态管理对象
let loading = {
  loadingInstance: null,

  // 打开加载状态
  open() {
    if (this.loadingInstance === null) {
      // 创建加载实例，设置加载文本、背景和目标元素
      // @ts-ignore
      this.loadingInstance = ElLoading.service({
        text: "拼命加载中...",
        background: "rgba(0, 0, 0, 0.5)",
        target: ".main", // 加载状态覆盖的目标元素
      });
    }
  },

  // 关闭加载状态
  close() {
    if (this.loadingInstance !== null) {
      // @ts-ignore
      this.loadingInstance.close(); // 关闭加载实例
    }
    this.loadingInstance = null; // 重置加载实例
  },
};

// 导出封装后的请求实例
export default request;

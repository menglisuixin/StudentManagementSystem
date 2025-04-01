import router from "./router";
import pinia from "./store";
import useUserStore from "./store/modules/user";

let userStore = useUserStore(pinia);
// 路由守卫钩子函数
router.beforeEach((to, _from, next) => {
  const user = userStore.user;
  if (user && user._id) {
    if (to.path == "/login" || to.path == "/404") {
      next({ path: "/home" });
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});

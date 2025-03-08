import { createRouter, createWebHistory } from "vue-router";
let router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: () => import("@/view/login/index.vue"),
      name: "login",
    },
    {
      path: "/",
      component: () => import("@/view/layout/index.vue"),
      name: "layout",
    },
    {
      path: "/404",
      component: () => import("@/view/404/index.vue"),
      name: "404",
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
      name: "Any",
    },
  ],
});
export default router;

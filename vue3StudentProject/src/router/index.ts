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
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: () => import("@/view/home/index.vue"),
          //
          meta: { title: "首页" },
        },
        {
          path: "/user",
          component: () => import("@/view/user/index.vue"),
          meta: { title: "用户管理" },
        },
        {
          path: "/role",
          component: () => import("@/view/role/index.vue"),
          meta: { title: "角色管理" },
        },
        {
          path: "/student",
          component: () => import("@/view/students/Student.vue"),
          meta: { title: "学生管理" },
        },
        {
          path: "/class",
          component: () => import("@/view/students/Class.vue"),
          meta: { title: "班级管理" },
        },
        {
          path: "/school",
          component: () => import("@/view/students/School.vue"),
          meta: { title: "学校管理" },
        },
        {
          path: "/majors",
          component: () => import("@/view/students/Majors.vue"),
          meta: { title: "专业管理" },
        },
        {
          path: "/student/update/:id",
          component: () => import("@/view/students/components/StudentUpdate.vue"),
          meta: { title: "学生添加/编辑" },
        },
      ],
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

import { defineStore } from "pinia";
import {
  reqClassAdd,
  reqClassAll,
  reqClassById,
  reqClassDelete,
  reqClassList,
  reqClassUpdate,
} from "@/api/class/index";
import { ClassState } from "./types/type";
import type {
  classAllResponseData,
  classInfoData,
  classListFormData,
  classListResponseData,
  classResponseData,
} from "@/api/class/type";

/**
 * 班级状态管理模块
 * 负责处理班级数据的获取、添加、更新和删除等操作
 */
let useClassStore = defineStore("class", {
  // 状态定义
  state: (): ClassState => {
    return {
      // 班级列表数据
      classes: [],
    };
  },

  // 定义方法
  actions: {
    /**
     * 获取所有班级列表
     * @returns 操作结果
     */
    async getClassAll() {
      let result: classAllResponseData = await reqClassAll();
      if (result.status == 0) {
        // 获取成功，更新班级列表
        this.classes = result.data as classInfoData[];
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 获取分页班级列表
     * @param data 分页查询参数
     * @returns 分页数据
     */
    async getClassList(data: classListFormData) {
      let result: classListResponseData = await reqClassList(data);
      if (result.status == 0) {
        // 获取成功，更新班级列表
        this.classes = result.data?.data as classInfoData[];
        return result.data;
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 添加班级
     * @param data 班级信息
     * @returns 操作结果
     */
    async addClass(data: classInfoData) {
      let result: classResponseData = await reqClassAdd(data);
      if (result.status == 0) {
        await this.getClassAll();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 根据 ID 获取班级信息
     * @param _id 班级 ID
     * @returns 班级信息
     */
    async getClassById(_id: string) {
      let result: classResponseData = await reqClassById(_id);
      if (result.status == 0) {
        return result.data;
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 更新班级信息
     * @param data 班级信息
     * @returns 操作结果
     */
    async updateClass(data: classInfoData) {
      let result: classResponseData = await reqClassUpdate(data);
      if (result.status == 0) {
        await this.getClassAll();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },

    /**
     * 删除班级
     * @param classId 班级 ID
     * @returns 操作结果
     */
    async deleteClass(classId: string) {
      let result: classResponseData = await reqClassDelete(classId);
      if (result.status == 0) {
        await this.getClassAll();
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});

export default useClassStore;

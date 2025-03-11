import { defineStore } from "pinia";
import {
  reqSchoolAdd,
  reqSchoolAll,
  reqSchoolById,
  reqSchoolDelete,
  reqSchoolList,
  reqSchoolUpdate,
} from "@/api/school/index";
import { SchoolState } from "./types/type";
import type {
  schoolAllResponseData,
  schoolInfoData,
  schoolListFormData,
  schoolListResponseData,
  schoolResponseData,
} from "@/api/school/type";

let useSchoolStore = defineStore("school", {
  state: (): SchoolState => {
    return {
      schools: [],
    };
  },
  actions: {
    async getSchoolAll() {
      let result: schoolAllResponseData = await reqSchoolAll();
      if (result.status == 0) {
        this.schools = result.data as schoolInfoData[];
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async getSchoolList(data: schoolListFormData) {
      let result: schoolListResponseData = await reqSchoolList(data);
      if (result.status == 0) {
        this.schools = result.data?.data as schoolInfoData[];
        return result.data;
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async addSchool(data: schoolInfoData) {
      let result: schoolResponseData = await reqSchoolAdd(data);
      if (result.status == 0) {
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async getSchoolById(_id: string) {
      let result: schoolResponseData = await reqSchoolById(_id);
      if (result.status == 0) {
        return result.data;
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async updateSchool(data: schoolInfoData) {
      let result: schoolResponseData = await reqSchoolUpdate(data);
      if (result.status == 0) {
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    async deleteSchool(schoolId: string) {
      let result: schoolResponseData = await reqSchoolDelete(schoolId);
      if (result.status == 0) {
        return "OK";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
  },
});
export default useSchoolStore;

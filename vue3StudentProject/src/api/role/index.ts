import request from "@/utils/request";
import type {
  getRoleListResponseData,
  addRoleResponseData,
  roleInfoData,
} from "./type";

export const getRoleList = () =>
  request.get<any, getRoleListResponseData>("/manage/role/list");
export const addRole = (data: roleInfoData) =>
  request.post<any, addRoleResponseData>("/manage/role/add", data);
export const updateRole = (data: roleInfoData) =>
  request.post<any, addRoleResponseData>("/manage/role/update", data);

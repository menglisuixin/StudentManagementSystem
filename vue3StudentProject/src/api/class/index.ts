// 最终发请求的地方
import request from "@/utils/request";
import type {
  classAllResponseData,
  classInfoData,
  classListFormData,
  classListResponseData,
  classResponseData,
} from "./type";
// 枚举类型
enum API {
  CLASS_ALL_URL = "/manage/class/all",
  CLASS_LIST_URL = "/manage/class/list",
  CLASS_ADD_URL = "/manage/class/add",
  CLASS_GET_ID_URL = "/manage/class/find",
  CLASS_UPDATE_URL = "/manage/class/update",
  CLASS_DELETE_URL = "/manage/class/delete",
}

export const reqClassAll = () =>
  request.get<any, classAllResponseData>(API.CLASS_ALL_URL);
export const reqClassList = (data: classListFormData) =>
  request.post<any, classListResponseData>(API.CLASS_LIST_URL, data);
export const reqClassAdd = (data: classInfoData) =>
  request.post<any, classResponseData>(API.CLASS_ADD_URL, data);
export const reqClassById = (_id: string) =>
  request.get<any, classResponseData>(API.CLASS_GET_ID_URL + `?_id=${_id}`);
export const reqClassUpdate = (data: classInfoData) =>
  request.post<any, classResponseData>(API.CLASS_UPDATE_URL, data);
export const reqClassDelete = (classId: string) =>
  request.post<any, classResponseData>(API.CLASS_DELETE_URL, { classId });

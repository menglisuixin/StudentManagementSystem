// 最终发请求的地方
import request from "@/utils/request";
import type {
  majorAllResponseData,
  majorInfoData,
  majorListFormData,
  majorListResponseData,
  majorResponseData,
} from "./type";
// 枚举类型
enum API {
  MAJOR_ALL_URL = "/manage/major/all",
  MAJOR_LIST_URL = "/manage/major/list",
  MAJOR_ADD_URL = "/manage/major/add",
  MAJOR_GET_ID_URL = "/manage/major/find",
  MAJOR_UPDATE_URL = "/manage/major/update",
  MAJOR_DELETE_URL = "/manage/major/delete",
}

export const reqMajorAll = () =>
  request.get<any, majorAllResponseData>(API.MAJOR_ALL_URL);
export const reqMajorList = (data: majorListFormData) =>
  request.post<any, majorListResponseData>(API.MAJOR_LIST_URL, data);
export const reqMajorAdd = (data: majorInfoData) =>
  request.post<any, majorResponseData>(API.MAJOR_ADD_URL, data);
export const reqMajorById = (_id: string) =>
  request.get<any, majorResponseData>(API.MAJOR_GET_ID_URL + `?_id=${_id}`);
export const reqMajorUpdate = (data: majorInfoData) =>
  request.post<any, majorResponseData>(API.MAJOR_UPDATE_URL, data);
export const reqMajorDelete = (majorId: string) =>
  request.post<any, majorResponseData>(API.MAJOR_DELETE_URL, { majorId });

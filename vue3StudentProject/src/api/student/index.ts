// 最终发请求的地方
import request from "@/utils/request";
import type {
  studentAllResponseData,
  studentInfoData,
  studentListFormData,
  studentListResponseData,
  studentResponseData,
  studentYearResponseData
} from "./type";
// 枚举类型
enum API {
  STUDENT_ALL_URL = "/manage/student/all",
  STUDENT_LIST_URL = "/manage/student/list",
  STUDENT_ADD_URL = "/manage/student/add",
  STUDENT_GET_ID_URL = "/manage/student/find",
  STUDENT_UPDATE_URL = "/manage/student/update",
  STUDENT_DELETE_URL = "/manage/student/delete",
  STUDENT_MONTH_DATA_URL = "/manage/student/date",
}

export const reqStudentAll = () =>
  request.get<any, studentAllResponseData>(API.STUDENT_ALL_URL);
export const reqStudentList = (data: studentListFormData) =>
  request.post<any, studentListResponseData>(API.STUDENT_LIST_URL, data);
export const reqStudentAdd = (data: studentInfoData) =>
  request.post<any, studentResponseData>(API.STUDENT_ADD_URL, data);
export const reqStudentById = (_id: string) =>
  request.get<any, studentResponseData>(API.STUDENT_GET_ID_URL + `?_id=${_id}`);
export const reqStudentUpdate = (data: studentInfoData) =>
  request.post<any, studentResponseData>(API.STUDENT_UPDATE_URL, data);
export const reqStudentDelete = (studentId: string) =>
  request.post<any, studentResponseData>(API.STUDENT_DELETE_URL, { studentId });
export const reqStudentForYear = (year:number) =>
  request.post<any, studentYearResponseData>(API.STUDENT_MONTH_DATA_URL, { year });

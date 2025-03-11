import type { userInfoData } from "@/api/user/type";
import type { roleInfoData } from "@/api/role/type";
import type { schoolInfoData } from "@/api/school/type";
import type { majorInfoData } from "@/api/major/type";
import type { classInfoData } from "@/api/class/type";
export interface UserState {
  user: userInfoData | null;
  users: userInfoData[];
}
export interface RoleState {
  roles: roleInfoData[] | undefined;
}
export interface SchoolState {
  schools: schoolInfoData[] | undefined;
}
export interface MajorState {
  majors: majorInfoData[] | undefined;
}
export interface ClassState {
  classes: classInfoData[] | undefined;
}

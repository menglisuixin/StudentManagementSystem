import type { userInfoData } from "@/api/user/type";
import type { roleInfoData } from "@/api/role/type";
export interface UserState {
  user: userInfoData | null;
}
export interface RoleState {
  roles: roleInfoData[] | undefined;
}

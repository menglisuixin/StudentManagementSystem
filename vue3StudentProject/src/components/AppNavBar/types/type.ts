export interface MenuData {
  title: string;
  index: string;
  icon: string;
  isPublic?: boolean;
  children?: MenuChildData[];
}
export interface MenuChildData {
  title: string;
  index: string;
  icon: string;
}

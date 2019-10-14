export interface User {
  id: number;
  name: string;
}

export interface UsersSelectionInfo {
  selected: boolean;
  user: User;
}

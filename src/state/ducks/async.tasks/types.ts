import { Nullable, User } from "../common/types";

export interface PasswordType {
  password: string;
}
export interface GetAsyncTaskResponse {
  id: string;
  taskType: string;
  year: Nullable<string>;
  month: Nullable<string>;
  day: Nullable<string>;
  hour: Nullable<string>;
  minute: Nullable<string>;
  second: Nullable<string>;
  nextTaskTypes: Nullable<string>;
  status: string;
  user?: User;
}

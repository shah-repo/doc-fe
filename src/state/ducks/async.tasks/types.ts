import { User } from "../common/types";

export interface PasswordType {
  password: string;
}
export interface GetAsyncTaskResponse {
  id: string;
  taskType: string;
  year: string | null;
  month: string| null;
  day: string| null;
  hour: string| null;
  minute: string| null;
  second: string| null;
  nextTaskTypes: string | null;
  status: string;
  user?: User;
}

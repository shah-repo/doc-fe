import { Nullable, User } from '../common/types';

export interface PasswordType {
  password: string;
}
export interface GetAsyncTaskResponse {
  id: string;
  taskType: string;
  duration: number;
  nextTaskTypes: Nullable<string[]>;
  status: string;
  user?: User;
}

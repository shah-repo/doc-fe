import { Group } from "../auth/types";
import { User } from "../common";

export interface GetEmployeeResponse {
  id: string;
  active: boolean;
  groups: Group[];
  user: User;
}

import { GroupTag, Permission } from "../auth";
import { Id } from "../common";

export interface GroupRequestBody {
  id?: string;
  name?: string;
  permissions: Permission[];
  defaultForNewUsers: boolean;
  isOfficial: boolean;
  tags: GroupTag[];
  employees: Id[];
  parents: Id[];
}

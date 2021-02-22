import { includes, some } from "lodash";
import { Permission } from "../../../state/ducks/auth";
import { Employee } from "../../../state/ducks/company";

export const getHasOfficialPermissions = (currentEmployeePermissions: Permission[]) => includes(currentEmployeePermissions, Permission.GROUP_CREATE) &&
           includes(currentEmployeePermissions, Permission.GROUP_UPDATE);

export const getHasUnofficialPermissions = (currentEmployeePermissions: Permission[]) => includes(currentEmployeePermissions, Permission.GROUP_CREATE_UNOFFICIAL) &&
           includes(currentEmployeePermissions, Permission.GROUP_UPDATE_UNOFFICIAL);

export const getIsMemberOfGroup = (members: Employee[], id: string) => some(members, ["id", id]);

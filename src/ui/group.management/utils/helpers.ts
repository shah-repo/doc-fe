import { includes } from "lodash";
import { Permission } from "../../../state/ducks/auth/types";

export const getHasOfficialPermissions = (currentEmployeePermissions: Permission[]) => includes(currentEmployeePermissions, Permission.GROUP_CREATE) &&
           includes(currentEmployeePermissions, Permission.GROUP_UPDATE);

export const getHasUnofficialPermissions = (currentEmployeePermissions: Permission[]) => includes(currentEmployeePermissions, Permission.GROUP_CREATE_UNOFFICIAL) &&
           includes(currentEmployeePermissions, Permission.GROUP_UPDATE_UNOFFICIAL);

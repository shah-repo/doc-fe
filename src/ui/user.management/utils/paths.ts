import { generatePath } from "react-router-dom";
import { USER_MANAGEMENT_DETAIL_URL } from "../../constants/urls";
import { RouteParams } from "./types";

const userManagementPath = (path: string, routeParams: RouteParams) =>
  generatePath(path, { ...routeParams });

export const userManagementDetailsPath = (userId: string) =>
  userManagementPath(USER_MANAGEMENT_DETAIL_URL, { userId });

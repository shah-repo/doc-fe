import { generatePath } from "react-router-dom";
import { CHANGE_REQUEST_UPDATE_URL } from "../../constants/urls";
import { RouteParams } from "./types";

const changeRequestPath = (path: string, routeParams: RouteParams) =>
  generatePath(path, { ...routeParams });

export const changeRequestEditPath = (changeRequestId: string) => {
  return changeRequestPath(CHANGE_REQUEST_UPDATE_URL, { changeRequestId });
};

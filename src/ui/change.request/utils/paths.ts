import { generatePath } from "react-router-dom";
import { CHANGE_REQUEST_PREVIEW_URL } from "../../constants/urls";
import { RouteParams } from "./types";

const changeRequestPath = (path: string, routeParams: RouteParams) =>
  generatePath(path, { ...routeParams });

export const changeRequestPreviewPath = (changeRequestId: string) =>
  changeRequestPath(CHANGE_REQUEST_PREVIEW_URL, { changeRequestId });

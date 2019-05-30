import { generatePath } from "react-router-dom";
import { CHANGE_REQUEST_UPDATE_URL, CHANGE_REQUEST_PREVIEW_URL } from "../constants/urls";
import { ChangeRequestRouteParams } from "./types";

const generateChangeRequestPath = (path: string, routeParams: ChangeRequestRouteParams) =>
  generatePath(path, { ...routeParams });

export const generateChangeRequestEditPath = (changeRequestId: string) =>
  generateChangeRequestPath(CHANGE_REQUEST_UPDATE_URL, { changeRequestId });

export const generateChangeRequestPreviewPath = (changeRequestId: string) =>
  generateChangeRequestPath(CHANGE_REQUEST_PREVIEW_URL, { changeRequestId });

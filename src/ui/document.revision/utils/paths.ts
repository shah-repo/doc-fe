import { generatePath } from "react-router-dom";
import {
  DOCUMENT_REVISION_PREVIEW_URL,
  DOCUMENT_REVISION_UPDATE_URL,
} from "../../constants/urls";
import { RouteParams } from "./types";

const documentPath = (path: string, routeParams: RouteParams) =>
  generatePath(path, { ...routeParams });

export const documentEditPath = (documentRevisionId: string) =>
  documentPath(DOCUMENT_REVISION_UPDATE_URL, { documentRevisionId });

export const documentPreviewPath = (documentRevisionId: string) =>
  documentPath(DOCUMENT_REVISION_PREVIEW_URL, { documentRevisionId });

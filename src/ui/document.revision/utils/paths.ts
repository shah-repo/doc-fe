import { generatePath } from "react-router-dom";
import {
  DOCUMENT_REVISION_VERSION_URL,
} from "../../constants/urls";
import { RouteParams } from "./types";

const documentPath = (path: string, routeParams: RouteParams) =>
  generatePath(path, { ...routeParams });

export const documentEditPath = (documentRevisionId: string, documentId: string) =>
documentPath(DOCUMENT_REVISION_VERSION_URL, { documentRevisionId, documentId });

export const documentPreviewPath = (documentRevisionId: string, documentId: string) =>
documentPath(DOCUMENT_REVISION_VERSION_URL, { documentRevisionId, documentId });

export const documentVersionPath = (documentRevisionId: string, documentId: string) =>
documentPath(DOCUMENT_REVISION_VERSION_URL, { documentRevisionId, documentId });

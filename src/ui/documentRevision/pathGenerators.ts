import { generatePath } from "react-router-dom";
import { DOCUMENT_REVISION_PREVIEW_URL, DOCUMENT_REVISION_UPDATE_URL } from "../constants/urls";
import { DocumentRevisionRouteParams } from "./types";

const generateDocumentRevisionPath = (path: string, routeParams: DocumentRevisionRouteParams) =>
  generatePath(path, { ...routeParams });

export const generateDocumentRevisionEditPath = (documentRevisionId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_UPDATE_URL, { documentRevisionId });

export const generateDocumentRevisionPreviewPath = (documentRevisionId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_PREVIEW_URL, { documentRevisionId });

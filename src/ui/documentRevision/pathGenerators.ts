import { generatePath } from "react-router-dom";
import { DOCUMENT_REVISION_UPDATE_URL, DOCUMENT_REVISION_PREVIEW_URL } from "../constants/urls";
import { DocumentRevisionRouteParams } from "./types";

const generateDocumentRevisionPath = (path: string, routeParams: DocumentRevisionRouteParams) =>
  generatePath(path, { ...routeParams });

export const generateDocumentRevisionEditPath = (documentRevisionId: string, documentId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_UPDATE_URL, { documentRevisionId, documentId });

export const generateDocumentRevisionPreviewPath = (documentRevisionId: string, documentId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_PREVIEW_URL, { documentRevisionId, documentId });

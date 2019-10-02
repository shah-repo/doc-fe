import { generatePath } from "react-router-dom";
import { DOCUMENT_REVISION_VERSION_URL } from "../constants/urls";
import { DocumentRevisionRouteParams } from "./types";

// TODO: check if this is still being used
// ui/document.revisions/utils/paths seems to replace this
const generateDocumentRevisionPath = (path: string, routeParams: DocumentRevisionRouteParams) =>
  generatePath(path, { ...routeParams });

export const generateDocumentRevisionEditPath = (documentRevisionId: string, documentId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_VERSION_URL, { documentRevisionId, documentId });

export const generateDocumentRevisionPreviewPath = (documentRevisionId: string, documentId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_VERSION_URL, { documentRevisionId, documentId });

export const generateDocumentRevisionVersionPath = (documentRevisionId: string, documentId: string) =>
  generateDocumentRevisionPath(DOCUMENT_REVISION_VERSION_URL, { documentRevisionId, documentId });

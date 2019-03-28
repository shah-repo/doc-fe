import { generatePath } from "react-router-dom";
import { DOCUMENT_CLONE_URL, DOCUMENT_PREVIEW_URL, DOCUMENT_UPDATE_URL } from "../constants/urls";
import { DocumentRouteParams } from "./types";

const generateDocumentPath = (path: string, routeParams: DocumentRouteParams) =>
  generatePath(path, { ...routeParams });

export const generateDocumentEditPath = (documentId: string) =>
  generateDocumentPath(DOCUMENT_UPDATE_URL, { documentId });

export const generateDocumentPreviewPath = (documentId: string) =>
  generateDocumentPath(DOCUMENT_PREVIEW_URL, { documentId });

export const generateDocumentClonePath = (documentId: string) =>
  generateDocumentPath(DOCUMENT_CLONE_URL, { documentId });

import { generatePath } from "react-router-dom";
import { DOCUMENT_UPDATE_URL } from "../constants/urls";
import { DocumentRouteParams } from "./types";

export const generateDocumentEditPath = (documentId: string) => {
  const documentRouteParams: DocumentRouteParams = {
    documentId,
  };

  return generatePath(DOCUMENT_UPDATE_URL, { ...documentRouteParams });
};

import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useDocumentStatus = (
  documentTypeId = "",
  status = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[DisplayFieldType[`STATUS_${status}`]];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? status;

  return [isVisible, label];
};

export default useDocumentStatus;

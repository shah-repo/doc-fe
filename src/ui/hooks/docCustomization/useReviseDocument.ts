import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useReviseDocument = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[DisplayFieldType.REVISE_BTN];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "documentRevision.revise";

  return [isVisible, label];
};

export default useReviseDocument;

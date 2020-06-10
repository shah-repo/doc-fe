import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useDocumentHistory = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[DisplayFieldType.VERSIONS];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "document.revision.docVersion";

  return [isVisible, label];
};

export default useDocumentHistory;

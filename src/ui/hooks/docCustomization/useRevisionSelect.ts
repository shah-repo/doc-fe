import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useRevisionSelect = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.REVISION_SELECTION];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "documentRevision.form.typeOfRevisionChange";

  return [isVisible, label];
};

export default useRevisionSelect;

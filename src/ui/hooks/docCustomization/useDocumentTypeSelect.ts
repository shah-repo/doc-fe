import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";
import { UIConfig } from "./types";

const useDocumentTypeSelect = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.DOC_TYPE];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "document.type";
  const validation = config?.required ?? true ? validator(required) : undefined;

  return [isVisible, label, validation];
};

export default useDocumentTypeSelect;

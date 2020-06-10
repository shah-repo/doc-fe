import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";
import { UIConfig } from "./types";

const useDocId = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.DOC_ID];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "common.documentId";
  const validation = config?.required ?? true ? validator(required) : undefined;

  return [isVisible, label, validation];
};

export default useDocId;

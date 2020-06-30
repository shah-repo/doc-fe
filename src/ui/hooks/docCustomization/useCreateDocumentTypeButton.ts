import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";
import { UIConfig } from "./types";

const useCreateDocumentTypeButton = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[DisplayFieldType.ADD_NEW_BTN];
  const isVisible = config?.visible ?? true;
  const label = documentType.fieldsConfig?.[DisplayFieldType.ADD_NEW_BTN]
    ? "supplier.create.new"
    : "supplier.add.new";
  const validation = config?.required ?? true ? validator(required) : undefined;

  return [isVisible, label, validation];
};

export default useCreateDocumentTypeButton;

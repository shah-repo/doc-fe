import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";
import { UIConfig } from "./types";

const useTitle = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.TITLE];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "common.title1";
  const validation = config?.required ?? true ? validator(required) : undefined;

  return [isVisible, label, validation];
};

export default useTitle;

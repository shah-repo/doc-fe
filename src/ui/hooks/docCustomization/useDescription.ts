import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";
import { UIConfig } from "./types";

const useDescription = (
  documentTypeId = "",
  isQms = false,
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const validators = isQms ? validator(required) : undefined;

  const config = documentType?.fieldsConfig?.[InputFieldType.DESCRIPTION];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "common.description";
  const validation = config?.required ?? true ? validators : undefined;
  const tooltipConfig = {
    labelName: InputFieldType.DESCRIPTION,
    defaultLabel: config?.label,
    overriddenLabel: label,
    visibilityFlag: config?.visible,
    requiredFlag: config?.required,
  };

  return [isVisible, label, tooltipConfig, validation];
};

export default useDescription;

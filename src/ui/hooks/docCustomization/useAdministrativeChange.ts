import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useAdministrativeChange = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.ADM_CHANGE];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "documentRevision.form.administrativeChange";

  return [isVisible, label];
};

export default useAdministrativeChange;

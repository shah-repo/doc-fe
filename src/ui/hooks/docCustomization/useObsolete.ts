import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useObsolete = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.OBSOLETE];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "documentRevision.form.obsolete";

  return [isVisible, label];
};

export default useObsolete;

import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useTraining = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.TRAINING];
  const isVisible = config?.visible ?? true;

  return [isVisible];
};

export default useTraining;

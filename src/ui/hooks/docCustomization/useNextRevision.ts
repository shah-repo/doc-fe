import { useSelector } from "react-redux";
import { documentTypeSelectors, InputFieldType } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useNextRevision = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[InputFieldType.NEXT_REVISION];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "documentRevision.form.nextRevisionStage";

  return [isVisible, label];
};

export default useNextRevision;

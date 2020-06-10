import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { UIConfig } from "./types";

const useApproveAndRelease = (
  documentTypeId = "",
): UIConfig => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[DisplayFieldType.APPROVE_RELEASE_BTN];
  const isVisible = config?.visible ?? true;
  const label = config?.label ?? "common.approve.and.release";

  return [isVisible, label];
};

export default useApproveAndRelease;

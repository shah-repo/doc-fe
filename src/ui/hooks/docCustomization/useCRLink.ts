import { useSelector } from "react-redux";
import { DisplayFieldType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";

const useCRLink = (
  documentTypeId = "",
) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const config = documentType?.fieldsConfig?.[DisplayFieldType.CR_ID];
  const isVisible = config?.visible ?? true;

  return [isVisible];
};

export default useCRLink;

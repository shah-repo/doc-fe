import { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../state/ducks/documentRevisions/documentType";

const useCRLink = (
  documentTypeId = "",
) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  return useMemo(() => {
    switch (documentType?.documentTypeAcronym) {
      case DynamicUIDocTypes.WO:
      case DynamicUIDocTypes.RC:
      case DynamicUIDocTypes.PO:
      case DynamicUIDocTypes.SUP:
        return false;
      default:
        return true;
    }
  }, [documentType]);
};

export default useCRLink;

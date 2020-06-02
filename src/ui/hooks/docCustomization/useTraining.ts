import { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../state/ducks/documentRevisions/documentType";

const useTraining = (
  documentTypeId = "",
) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const isVisible = useMemo(() => {
    switch (documentType?.documentTypeAcronym) {
      case DynamicUIDocTypes.PO:
      case DynamicUIDocTypes.RC:
      case DynamicUIDocTypes.WO:
      case DynamicUIDocTypes.SUP:
        return false;
      default:
        return true;
    }
  }, [documentType]);

  return isVisible;
};

export default useTraining;

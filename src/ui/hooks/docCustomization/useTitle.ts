import { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../state/ducks/documentRevisions/documentType";
import { required, validator } from "../../components/forms/fields/validators";

const useTitle = (
  documentTypeId = "",
) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  return useMemo(() => {
    switch (documentType?.documentTypeAcronym) {
      // case DynamicUIDocTypes.WO:
      case DynamicUIDocTypes.RC:
      case DynamicUIDocTypes.PO:
        return [false];
      default:
        return [true, validator(required)];
    }
  }, [documentType]);
};

export default useTitle;

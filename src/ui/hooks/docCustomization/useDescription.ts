import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../state/ducks/documentRevisions/documentType";
import { validator } from "../../components/forms/fields/validators";

const useDescription = (
  documentTypeId = "",
  isQms = false,
) => {
  const intl = useIntl();
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  return useMemo(() => {
    let isVisible = true;
    const placeholder: string = isQms ?
      "" :
      intl.formatMessage({ id: "document.revision.no.qms.message" });
    let validators = isQms ? validator(require) : undefined;

    switch (documentType?.documentTypeAcronym) {
      case DynamicUIDocTypes.RC:
        isVisible = false;
        validators = undefined;
        break;
      case DynamicUIDocTypes.WO:
      case DynamicUIDocTypes.PO:
        validators = undefined;
        break;
      default:
        break;
    }

    return [isVisible, placeholder, validators];
  }, [documentType, intl, isQms]);
};

export default useDescription;


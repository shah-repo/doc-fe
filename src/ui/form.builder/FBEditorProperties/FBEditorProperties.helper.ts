import { DocumentGroupOptionsType, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { FBInputType, OmitIncludeNotes } from "../FBInput/FBInput.types";

export const FBEditorPropertiesDefaultValue = (type: FBInputType, docGroupOptions?: DocumentGroupOptionsType[]) => {
  if (docGroupOptions?.includes(DOC_TYPE_GROUP_OPTION.FB_DEFAULT_NOTES)) {
    if (!OmitIncludeNotes.includes(type)) {
      return {
        procedure: ["copyableValue", "includeNotes"],
        eqmaintenance: ["deleteDisabled", "includeNotes"],
        [type]: ["includeNotes"],
      };
    }
  }
  return {
    procedure: ["copyableValue"],
    eqmaintenance: ["deleteDisabled"],
  };
};

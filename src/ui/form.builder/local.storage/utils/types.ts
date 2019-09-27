import { DocumentRevisionType } from "../../../../state/ducks/documentRevisions";
import { FBTemplateStore } from "../../stores/utils/types";

export interface FBLocalStorageProps {
  templateSubmit: () => boolean;
  valuesSubmit: () => any;
  getTemplates: (by: DocumentRevisionType | string) => FBTemplateStore[];
  getValue: () => any;
}

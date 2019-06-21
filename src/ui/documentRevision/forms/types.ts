import { Attachment } from "../../../state/ducks/attachments";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { Reference } from "../../../state/ducks/documentRevisions/types";

export interface DocumentRevisionFormValues {
  id?: string;
  documentId?: string;
  description: string;
  name: string;
  attachments: Attachment[];
  type: string;
  referenceTo: OptionType[];
  referencedBy: Reference[];
}

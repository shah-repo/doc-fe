import { Attachment } from "../../../state/ducks/attachments";
import { DocumentRevisionDocument, Reference, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export interface DocumentRevisionFormValues {
  id?: string;
  docId?: string;
  typePrefix?: string;
  description: string;
  name: string;
  attachments: Attachment[];
  type: string;
  referenceTo: OptionType[];
  document?: Partial<DocumentRevisionDocument>;
  revisionChangeType?: RevisionChangeType;
}

import { Attachment } from "../../../state/ducks/attachments";
import { DocumentRevisionDocument, Reference, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest";

export interface DocumentRevisionFormValues {
  id?: string;
  documentId?: string;
  description: string;
  name: string;
  attachments: Attachment[];
  referenceTo: OptionType[];
  document?: Partial<DocumentRevisionDocument>;
  revisionChangeType?: RevisionChangeType;
  changeRequest?: ChangeRequest
}

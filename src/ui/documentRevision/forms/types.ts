import { Attachment } from "../../../state/ducks/attachments";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DocumentRevisionDocument, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export interface DocumentRevisionFormValues {
  id?: string;
  description: string;
  name: string;
  attachments: Attachment[];
  referenceTo: OptionType[];
  document?: Partial<DocumentRevisionDocument>;
  revisionChangeType?: RevisionChangeType;
  changeRequest?: ChangeRequest;
}

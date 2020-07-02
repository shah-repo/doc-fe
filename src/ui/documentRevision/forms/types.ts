import { Attachment } from "../../../state/ducks/attachments";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { Id } from "../../../state/ducks/common/types";
import { DocumentRevisionDocument, DocumentRevisionStatus, FBDocumentRevisionProps, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export interface DocumentRevisionFormValues extends FBDocumentRevisionProps {
  id?: string;
  description: string;
  name: string;
  attachments: Attachment[];
  referenceTo: OptionType[];
  document?: Partial<DocumentRevisionDocument>;
  revisionChangeType?: RevisionChangeType;
  changeRequest?: ChangeRequest;
  revisionStage?: number;
  retrain?: boolean;
  status?: DocumentRevisionStatus;
  securityEmployees: OptionType[];
  securityGroups: OptionType[];
  operators: OptionType[];
  outputRevision?: boolean;
  renderHTML?: string;
  outputDocumentTypes?: OptionType[];
}

export interface SecurityId {
  id: string;
}

export interface ApproveAndReleaseFormValues {
  approvals: OptionType[];
  password: string;
  formDocument: Id;
  documentType: Id;
}

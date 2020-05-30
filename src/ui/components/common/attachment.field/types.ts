import { FBDocumentRevisionProps, DocumentRevisionDocument, RevisionChangeType, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { Attachment } from "../../../../state/ducks/attachments";
import { OptionType } from "../../forms/fields/Autocomplete/types";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";


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
}

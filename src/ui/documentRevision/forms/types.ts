import { Attachment } from "../../../state/ducks/attachments";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import {
  DocumentRevisionDocument,
  DocumentRevisionStatus,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FBDocumentFlowProps } from "../../form.builder/types/formik";

export interface DocumentRevisionFormValues extends FBDocumentFlowProps {
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
}

export interface SecurityId {
  id: string;
}

import { Attachment } from "../../../state/ducks/attachments";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DocumentRevisionDocument, Reference, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FBFormInputProps, FBFormTemplateProps } from "../../form.builder/types/formik";

export interface DocumentRevisionFormValues extends FBFormInputProps {
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
  formTemplate?: FBFormTemplateProps;
}

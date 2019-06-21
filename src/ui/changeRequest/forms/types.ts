import { Attachment as AttachmentInterface } from "../../../state/ducks/attachments";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export type Attachment = AttachmentInterface;

export interface FileUploadFormValues {
  file?: File;
}

export interface Justifications {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface Assessment {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface ImplementationPlan {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface ChangeRequestFormValues {
  id?: string;
  description: string;
  justifications: Justifications;
  assessment: Assessment;
  implementationPlan: ImplementationPlan;
  effectiveDate?: Date;
  approvals: OptionType[];
  documentRevisions: string[];
}

export interface PasswordFormValues {
  password: string;
}

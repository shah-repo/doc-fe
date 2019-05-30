import { Attachment as AttachmentInterface } from "../../../state/ducks/attachments";

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
  description: string;
  justifications: Justifications;
  assessment: Assessment;
  implementationPlan: ImplementationPlan;
  effectiveDate?: Date;
  approvals: any[];
  documentRevisions: any[];
}

export interface PasswordFormValues {
  password: string;
}

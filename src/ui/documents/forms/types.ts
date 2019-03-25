import { Attachment as AttachmentInterface } from "../../../state/ducks/attachments";

export type Attachment = AttachmentInterface;

export interface FileUploadFormValues {
  file?: File;
}

export interface DocumentFormValues {
  id?: string;
  name: string;
  type: string;
  approvers: string[];
  attachments: Attachment[];
}

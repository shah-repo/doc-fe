import { Attachment } from "../../../state/ducks/attachments";

export interface DocumentRevisionFormValues {
  id?: string;
  documentId?: string;
  description: string;
  name: string;
  attachments: Attachment[];
  type: string;
}

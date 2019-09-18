import { Attachment } from "../../../../../state/ducks/attachments";

export interface ViewFileContainerProps {
  attachments: Attachment[];
  attachment?: Attachment;
  isOpen: boolean;
  handleClose(): void;
}

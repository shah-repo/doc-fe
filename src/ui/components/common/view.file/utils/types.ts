import { Attachment } from "../../../../../state/ducks/attachments";
import { AsyncState } from "../../../../../state/types";

export interface ViewFileContainerProps {
  attachments: Attachment[];
  attachment?: Attachment;
  isOpen: boolean;
  handleClose(): void;
}

export interface ViewFilePresenterProps {
  isOpen: boolean;
  asyncState: AsyncState;
  url: string;
  attachment?: Attachment;
  handleClose(): void;
}

export interface ViewFileContentProps {
  asyncState: AsyncState;
  url: string;
}

export interface ViewFileTitleProps {
  attachment?: Attachment;
}

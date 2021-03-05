import { Attachment } from "../../../../../state/ducks/attachments/types";
import { AsyncState } from "../../../../../state/types";
import { Password } from "../../../password/types";

export interface ViewFileContainerProps {
  attachments: Attachment[];
  attachment?: Attachment;
  isOpen: boolean;
  password?: Password;
  handleClose(): void;
}

export interface ViewFilePresenterProps {
  isOpen: boolean;
  asyncState: AsyncState;
  url: string;
  attachment?: Attachment;
  attachments: Attachment[];
  handleClose(): void;
}

export interface ViewFileContentProps {
  asyncState: AsyncState;
  url: string;
  type: string;
  handleClose(): void;
}

export interface ViewFileTitleProps {
  attachment?: Attachment;
  attachments: Attachment[];
}

export interface ViewFileTitleControlsProps {
  attachment?: Attachment;
  attachments: Attachment[];
}

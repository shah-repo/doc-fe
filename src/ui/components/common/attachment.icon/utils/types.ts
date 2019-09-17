import { Attachment, attachmentsActions, AttachmentType } from "../../../../../state/ducks/attachments";
import { RenderSize } from "../../../../../state/ducks/common";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export interface AttachmentIconDispatchProps {
  download: typeof attachmentsActions.download;
}

export interface AttachmentIconProps extends FormikHybridFieldProps {
  attachment?: Attachment;
  extension?: string;
  size?: RenderSize;
  disabled?: boolean;
  handleRemove?: (attachment: Attachment) => () => any;
  handleDownload?: (attachment: Attachment, type?: AttachmentType) => () => any;
  handleContextMenu?: (file: Attachment) => (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isUploading?: boolean;
}

export interface AttachmentMenuProps {
  handleDownload?: (attachment: Attachment, type?: AttachmentType) => () => any;
  handleClose?: () => void;
  anchorEl?: null | HTMLElement;
  attachment?: Attachment;
}

export interface AttachmentIconStyleProp {
  size: RenderSize;
  disabled: boolean;
}

export type AttachmentIconContainerProps = AttachmentIconProps & AttachmentIconDispatchProps;

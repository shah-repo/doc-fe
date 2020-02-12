import { Attachment, attachmentsActions, AttachmentType } from "../../../../../state/ducks/attachments";
import { RenderSize } from "../../../../../state/ducks/common";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export interface AttachmentIconDispatchProps {
  download: typeof attachmentsActions.download;
}

export interface AttachmentIconFactoryProps extends FormikHybridFieldProps {
  attachment?: Attachment;
  extension?: string;
  size?: RenderSize;
  disabled?: boolean;
  handleRemove?: (attachment: Attachment) => () => any;
  handleDownload?: (attachment: Attachment, type?: AttachmentType) => () => any;
  handleContextMenu?: (file: Attachment) => (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleViewFile?: (attachment: Attachment) => () => any;
  value?: Attachment[];
}

export interface AttachmentIconProps extends AttachmentIconFactoryProps {
  isUploading?: boolean;
  isLoading?: boolean;
  handleIconClick?: (attachment: Attachment, type?: AttachmentType) => () => any;
}

export interface AttachmentMenuProps {
  handleDownload?: (attachment: Attachment, type?: AttachmentType) => () => any;
  handleClose?: () => void;
  anchorEl?: null | HTMLElement;
  attachment?: Attachment;
  openFileView: () => void;
}

export interface AttachmentIconStyleProp {
  size: RenderSize;
  disabled: boolean;
}

export type AttachmentIconContainerProps = AttachmentIconProps & AttachmentIconDispatchProps;

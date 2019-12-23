import { Attachment, attachmentsActions, AttachmentType, WatermarkRequest } from "../../../../../state/ducks/attachments";
import { RenderSize } from "../../../../../state/ducks/common";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";
import { TextProps } from "../../../Text";

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

export interface WatermarkResponse {
  success: boolean;
  message: TextProps;
  data: WatermarkRequest;
}

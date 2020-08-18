import { Attachment, attachmentsActions, AttachmentType } from "../../../../../state/ducks/attachments";
import { RenderSize } from "../../../../../state/ducks/common";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export enum PasswordSubmitActionType {
  DOWNLOAD_CLEAN_COPY_FILE = "DOWNLOAD_CLEAN_COPY_FILE",
  DOWNLOAD_FILE = "DOWNLOAD_FILE",
  OPEN_FILE_VIEW = "OPEN_FILE_VIEW",
  DOWNLOAD_WATER_MARK = "DOWNLOAD_WATER_MARK"
}

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
  handleContextMenu?: (file: Attachment) => (evt: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleViewFile?: (attachment: Attachment) => () => any;
  value?: Attachment[];
  handleIconClick?: (attachment: Attachment) => any;
  canDeleteFile?: boolean;
  isNewVersion?: boolean;
  documentRevision?: DocumentRevision;
}

export interface AttachmentIconProps extends AttachmentIconFactoryProps {
  isUploading?: boolean;
  isLoading?: boolean;
  isRedLine?: boolean;
  isPrimary?: boolean;
  isTransferred?: boolean;
  handleIconClick?: (attachment: Attachment) => any;
}

export interface AttachmentMenuProps {
  download: (attachment: Attachment, type?: AttachmentType) => void;
  handleClose?: () => void;
  anchorEl?: null | HTMLElement;
  attachment?: Attachment;
  openFileView: () => void;
  openWarningDialog: () => void;
  setPasswordSubmitAction: (type: PasswordSubmitActionType) => void;
}

export interface AttachmentIconStyleProp {
  size: RenderSize;
  disabled: boolean;
}

export type AttachmentIconContainerProps = AttachmentIconProps & AttachmentIconDispatchProps;

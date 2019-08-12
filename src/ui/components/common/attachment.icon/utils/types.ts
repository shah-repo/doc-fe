import { Attachment, attachmentsActions } from "../../../../../state/ducks/attachments";
import { RenderSize } from "../../../../../state/ducks/common";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export interface AttachmentIconDispatchProps {
  download: typeof attachmentsActions.download;
}

export interface AttachmentIconProps extends FormikHybridFieldProps {
  attachment?: Attachment;
  extension?: string;
  size?: RenderSize;
  handleRemove?: (attachment: Attachment) => () => any;
  handleDownload?: (attachment: Attachment) => () => any;
}

export interface AttachmentIconStyleProp {
  size: RenderSize;
}

export type AttachmentIconContainerProps = AttachmentIconProps & AttachmentIconDispatchProps;

import { FieldProps } from "formik";
import { Attachment, attachmentsActions } from "../../../../../state/ducks/attachments";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export type AttachmentIconSize = "sm" | "md" | "lg";

export interface AttachmentIconDispatchProps {
  download: typeof attachmentsActions.download;
}

export interface AttachmentIconProps extends FormikHybridFieldProps {
  attachment?: Attachment;
  extension?: string;
  size?: AttachmentIconSize;
  handleRemove?: (attachment: Attachment) => () => any;
  handleDownload?: (attachment: Attachment) => () => any;
}

export interface AttachmentIconStyleProp {
  size: AttachmentIconSize;
}

export type AttachmentIconContainerProps = AttachmentIconProps & AttachmentIconDispatchProps & Partial<FieldProps>;

import { FieldProps } from "formik";
import { Attachment } from "../../../../../state/ducks/attachments";

export type AttachmentIconSize = "sm" | "md" | "lg";

export interface AttachmentIconProps {
  name: string;
  attachments?: Attachment[];
  extension?: string;
  size?: AttachmentIconSize;
  handleRemove?: (attachment: Attachment) => () => any;
  handleDownload?: (attachmentId: string) => () => any;
}

export interface AttachmentIconStyleProp {
  size: AttachmentIconSize;
}

export type AttachmentIconContainerProps = AttachmentIconProps & FieldProps;

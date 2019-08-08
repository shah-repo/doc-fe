import { FieldProps } from "formik";
import { Attachment } from "../../../../../state/ducks/attachments";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export type AttachmentIconSize = "sm" | "md" | "lg";

export interface AttachmentIconProps extends FormikHybridFieldProps {
  attachments?: Attachment[];
  extension?: string;
  size?: AttachmentIconSize;
  handleRemove?: (attachment: Attachment) => () => any;
}

export interface AttachmentIconStyleProp {
  size: AttachmentIconSize;
}

export type AttachmentIconContainerProps = AttachmentIconProps & Partial<FieldProps>;

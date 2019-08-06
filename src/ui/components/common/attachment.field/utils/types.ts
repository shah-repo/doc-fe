import { FieldProps } from "formik";
import { attachmentsActions } from "../../../../../state/ducks/attachments";

export type AttachmentComponent = "field" | "button";

export interface AttachmentFieldDispatchProps {
  upload: typeof attachmentsActions.upload;
}

export interface AttachmentFieldProps {
  name: string;
  multiple?: boolean;
  component?: AttachmentComponent;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => any;
}

export interface AttachmentStyleProps {
  isField: boolean;
}

export type AttachmentContainerProps = AttachmentFieldProps & AttachmentFieldDispatchProps & FieldProps;

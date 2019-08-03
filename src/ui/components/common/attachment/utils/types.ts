import { FieldProps } from "formik";
import { attachmentsActions } from "../../../../../state/ducks/attachments";

export type AttachmentComponent = "field" | "button";

export interface AttachmentDispatchProps {
  upload: typeof attachmentsActions.upload;
}

export interface AttachmentConfigProps {
  multiple?: boolean;
  component?: AttachmentComponent;
}

export interface AttachmentActionProps {
  onChange: (event: React.FormEvent<HTMLInputElement>) => any;
}

export interface AttachmentFieldProps extends AttachmentConfigProps {
  name: string;
}

export interface AttachmentStyleProps {
  isField: boolean;
}

export type AttachmentContainerProps = AttachmentDispatchProps & AttachmentFieldProps & FieldProps;
export type AttachmentPresenterProps = AttachmentConfigProps & AttachmentActionProps;

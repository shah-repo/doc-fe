import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

export type AttachmentComponent = "field" | "button";

export interface AttachmentFieldDispatchProps {
  upload: typeof attachmentsActions.upload;
}

export interface AttachmentFieldProps extends FormikHybridFieldProps {
  multiple?: boolean;
  component?: AttachmentComponent;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => any;
}

export interface AttachmentStyleProps {
  isField: boolean;
}

export type AttachmentContainerProps = AttachmentFieldProps & AttachmentFieldDispatchProps;

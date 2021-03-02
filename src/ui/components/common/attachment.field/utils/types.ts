import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { FormikHybridFieldProps } from "../../../hoc/utils/types";

type AttachmentComponent = "field" | "button";

export interface AttachmentFieldDispatchProps {
  upload: typeof attachmentsActions.upload;
}

export interface AttachmentFieldProps extends FormikHybridFieldProps {
  multiple?: boolean;
  component?: AttachmentComponent;
  disabled?: boolean;
  upload?: any;
}

export interface AttachmentStyleProps {
  isField: boolean;
}

export type AttachmentContainerProps = AttachmentFieldProps & AttachmentFieldDispatchProps;

import { FormikHybridFieldProps } from "../../../hoc/utils/types";

type AttachmentComponent = "field" | "button";

export interface AttachmentFieldProps extends FormikHybridFieldProps {
  multiple?: boolean;
  component?: AttachmentComponent;
  disabled?: boolean;
  upload?: any;
}

export interface AttachmentStyleProps {
  isField: boolean;
}

export type AttachmentContainerProps = AttachmentFieldProps;

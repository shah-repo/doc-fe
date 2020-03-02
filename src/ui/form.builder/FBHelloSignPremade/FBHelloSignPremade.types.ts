import { Dictionary } from "lodash";
import { FBDialogState } from "../FBDialog/FBDialog.state";
import { FBStateProps } from "../helpers/FBStateProps";
import { FBButtonProps } from "../types/button";
import { FBInputProps } from "../types/common";

export type FBHelloSignFieldType =
  | "text"
  | "checkbox"
  | "radio"
  | "date_signed"
  | "dropdown";

export interface FBHelloSignFieldProps {
  name: string;
  type: FBHelloSignFieldType;
}

export interface FBHelloSignPayload {
  templateId: string;
  documentRevision: {
    id: string;
  };
}

export interface FBHelloSignPayloadSignature {
  documentRevision: {
    id: string;
  };
}

export type FBHelloSignProps = FBStateProps<FBDialogState> &
  Pick<FBInputProps, "label" | "name" | "disabled"> &
  Pick<FBButtonProps, "onClick"> & {
    buttonLabel?: string;
    templateId?: string;
  };

export const FBHelloSignTypeMap: Dictionary<FBHelloSignFieldType> = {
  textfield: "text",
  checkbox: "checkbox",
  radio: "radio",
  datepicker: "date_signed",
  select: "dropdown",
};

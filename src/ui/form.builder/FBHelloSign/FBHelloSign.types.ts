import { Dictionary } from "lodash";
import { FBButtonProps, FBHelloSignState, FBInputProps } from "..";

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
  documentRevision: {
    id: string;
  };
}

export type FBHelloSignProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& Pick<FBButtonProps, "onClick">
& {
  helloSignState?: FBHelloSignState;
  buttonLabel?: string;
  waitOverlay?: boolean;
  loadingMessage?: string;
  signatureSent?: boolean;
  signatureSentMessage?: string;
};

export const FBHelloSignTypeMap: Dictionary<FBHelloSignFieldType> = {
  textfield: "text",
  checkbox: "checkbox",
  radio: "radio",
  datepicker: "date_signed",
  select: "dropdown",
};

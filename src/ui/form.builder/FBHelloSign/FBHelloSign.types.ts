import { Dictionary } from "lodash";
import { FBButtonProps } from "../types/button";
import { FBInputProps } from "../types/common";
import FBHelloSignState from "./FBHelloSign.state";

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
  Pick<FBInputProps, "label" | "name"> &
  Pick<FBButtonProps, "onClick"> & {
    buttonLabel?: string;
    waitOverlay?: boolean;
    backdropStyle?: any;
    loadingMessage?: string;
    signatureSent?: boolean;
    signatureSentMessage?: string;
    helloSignState?: FBHelloSignState;
  };

export const FBHelloSignTypeMap: Dictionary<FBHelloSignFieldType> = {
  textfield: "text",
  checkbox: "checkbox",
  radio: "radio",
  datepicker: "date_signed",
  select: "dropdown",
};

import { FBInputProps } from "../common";

export type FBCheckContextProps =
 & Pick<FBInputProps, "label" | "disabled" | "name" | "value" | "type">
 & {
    includeContext?: boolean;
    showContext?: boolean;
};

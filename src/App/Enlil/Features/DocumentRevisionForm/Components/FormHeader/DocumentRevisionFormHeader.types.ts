import { SMProviderProps } from "../../../../..";

export type DocumentRevisionFormHeaderProps =
& Pick<SMProviderProps, "_documentRevisionFormState">
& {
  isDisabledInput?: boolean;
};

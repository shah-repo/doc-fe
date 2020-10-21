import { FBInputProps, FBProviderProps } from "..";

export type FBEBPartProps =
& Pick<FBProviderProps, "dialogState">
& Pick<FBInputProps, "name">
& {
  onAddClick(): void;
};

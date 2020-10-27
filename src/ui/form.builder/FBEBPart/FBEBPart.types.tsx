import { FBFormProps, FBInputProps } from "..";

export type FBEBPartProps =
& Pick<FBFormProps, "formState">
& Pick<FBInputProps, "name">
& {
  onAddClick(): void;
};

import { FBFormProps, FBInputProps } from "..";

export type FBQuantityUnitFieldProps =
& FBInputProps
& Pick<FBFormProps, "initialValues">
& {
  unitDisabled?: boolean;
};

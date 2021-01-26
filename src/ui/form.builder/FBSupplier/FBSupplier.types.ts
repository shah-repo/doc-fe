import { FBInputProps, FBProviderProps } from "..";

export type FBSupplierProps =
& Pick<FBProviderProps, "dialogState" | "supplierState">
& Pick<FBInputProps, "name" | "label" | "disabled" | "loading">
& {
  handleAdd(): void;
};

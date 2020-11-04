import { FBFormProps } from "..";

export type FBEQMaintenanceProps =
& Pick<FBFormProps, "formState">
& {
  onAddClick(): void;
};

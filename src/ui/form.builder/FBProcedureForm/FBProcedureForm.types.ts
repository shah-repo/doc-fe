import { FBAutocompleteAsyncProps, FBFormProps, FBProcedureItemProps } from "..";

export type FBProcedureFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBProcedureItemProps, "type">
& Pick<FBAutocompleteAsyncProps, "optionId" | "disabledOptions" | "getOptionLabel">;

export interface FBProcedureFormActionsProps {
  handleAdd?: () => void;
  handleCancel?: () => void;
}

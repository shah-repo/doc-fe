import { FBAutocompleteAsyncProps, FBFormProps, FBProcedureItemProps } from "..";

export type FBProcedureFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBProcedureItemProps, "type">
& Pick<FBAutocompleteAsyncProps, "optionId" | "disabledOptions">;

export type FBProcedureFormActionsProps =
& Pick<FBProcedureItemProps, "handleAdd" | "handleCancel">;

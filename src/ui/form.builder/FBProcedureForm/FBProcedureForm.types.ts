import { FBAutocompleteAsyncProps, FBFormProps, FBProcedureItemProps } from "..";

export type FBProcedureFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBProcedureItemProps, "name" | "type">
& Pick<FBAutocompleteAsyncProps, "optionId">;

export type FBProcedureFormActionsProps =
& Pick<FBProcedureItemProps, "handleAdd" | "handleCancel">;

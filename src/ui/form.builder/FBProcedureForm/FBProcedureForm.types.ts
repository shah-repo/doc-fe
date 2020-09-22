import { FBFormProps, FBProcedureItemProps } from "..";

export type FBProcedureFormProps =
& Pick<FBFormProps, "formState" | "children" | "initialValues">
& Pick<FBProcedureItemProps, "name" | "type">;

export type FBProcedureFormActionsProps =
& Pick<FBProcedureItemProps, "handleAdd" | "handleCancel">;

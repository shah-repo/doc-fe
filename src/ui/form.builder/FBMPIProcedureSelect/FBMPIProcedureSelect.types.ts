import { FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBMPIProcedureSelectProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "children" | "initialValues">
& Pick<FBProviderProps, "formState" | "mpiProcedureSelectState">;

export interface FBMPIProcedureSelectActionsProps {
  handleAdd?: () => void;
  handleCancel?: () => void;
}

export interface FBMPIProcedureSelectValue {
  fieldId: string;
  forMaterial: string;
  quantity: number;
  unit: string;
  usedLot: { id: string };
}

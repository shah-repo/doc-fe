import { FBFormProps, FBInputProps, FBProcedureItemType, FBProviderProps } from "..";

export type FBMPIProcedureSelectProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "children" | "initialValues">
& Pick<FBProviderProps, "formState" | "mpiProcedureSelectState">
& {
  type: FBProcedureItemType;
};

export interface FBMPIProcedureSelectValue {
  fieldId: string;
  forMaterial: { id: string };
  quantity: number;
  unit: string;
  usedLot: { id: string };
}

import { FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBMPIProcedureSelectProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "children" | "initialValues">
& Pick<FBProviderProps, "formState" | "mpiProcedureSelectState">;

export interface FBMPIProcedureSelectValue {
  fieldId: string;
  forMaterial: { id: string };
  quantity: number;
  unit: string;
  usedLot: { id: string };
  lotDocId?: string;
  refId?: string;
  materialId?: string;
}

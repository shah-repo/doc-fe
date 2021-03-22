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
  forPreselected: { id: string };
  usedOverride: { id: string };
  type: FBProcedureItemType | "MATERIAL" | "EQUIPMENT";
  overrideDocId?: string;
  refId?: string;
  materialId?: string;
  equipmentId?: string;
  quantity?: number;
  unit?: string;
}

import { FBFormProps, FBInputProps, FBProcedureItemType, FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBMPIProcedureSelectProps =
& Pick<FBInputProps, "name">
& Pick<FBFormProps, "children" | "initialValues">
& Pick<FBProviderProps, "formState" | "mpiProcedureSelectState">
& {
  type: FBProcedureItemType;
  unitDisabled?: boolean;
};

export interface FBMPIProcedureSelectValue {
  fieldId: string;
  forPreselected: { id: string };
  usedOverride: Partial<DocumentRevision> | string;
  type: FBProcedureItemType | "MATERIAL" | "EQUIPMENT";
  overrideDocId?: string;
  refId?: string;
  materialId?: string;
  equipmentId?: string;
  quantity?: number;
  unit?: string;
}

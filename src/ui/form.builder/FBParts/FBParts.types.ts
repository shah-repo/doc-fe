import { FBInputProps, FBProcedureItemConfig } from "..";

export type FBPartsProps =
& Pick<FBInputProps, "name">
& {
  equipment: FBProcedureItemConfig[];
  materials: FBProcedureItemConfig[];
};

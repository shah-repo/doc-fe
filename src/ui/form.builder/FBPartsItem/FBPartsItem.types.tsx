import { FBProcedureItemConfig, FBProcedureItemProps } from "..";

export type FBPartsItemProps =
& Pick<FBProcedureItemProps, "name" | "type" | "getItem" | "loading">
& {
  collection?: FBProcedureItemConfig[];
};

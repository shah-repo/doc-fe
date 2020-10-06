import { FBProcedureItemConfig, FBProcedureItemProps } from "..";

export type FBPartsItemProps =
& Pick<FBProcedureItemProps, "name" | "type" | "getItem" | "loading">
& {
  getItemUrl?(id: string): string | undefined;
  collection?: FBProcedureItemConfig[];
};

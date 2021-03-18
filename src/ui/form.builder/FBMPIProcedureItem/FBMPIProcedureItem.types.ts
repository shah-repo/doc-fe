import { FBProcedureItemConfig, FBProcedureItemProps, FBProviderProps } from "..";

export type FBMPIProcedureItemProps =
& FBProcedureItemProps
& Pick<FBProviderProps, "mpiProcedureState">
& {
  handleSelect?: (item: FBProcedureItemConfig) => void;
  handleSelectionDelete?: (refId?: string) => void;
  multiplier?: number;
};

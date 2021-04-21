import { FBProcedureItemProps } from "..";

export type FBLHRStepProcedureItemProps =
& FBProcedureItemProps
& {
  multiplier?: number;
  lhrStepIndex?: number;
};

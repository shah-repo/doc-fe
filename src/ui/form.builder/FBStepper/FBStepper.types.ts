import { FBSwitchPanelProps } from "..";

export enum FBStepperWidth {
  default = "100%",
  middle = "60%",
}

export type FBStepperProps =
  & FBSwitchPanelProps
  & {
    steps?: React.ReactNode[];
    width?: FBStepperWidth;
    activeStep?: number;
    beforeStepChange?: (step: number) => any;
  };

import { FBSwitchPanelState } from "..";

interface FBSwitchPanelConfigProps {
  title: string;
  content: React.ReactNode | string;
}

export interface FBSwitchPanelProps {
  state?: FBSwitchPanelState;
  content?: React.ReactNode | string;
  config?: FBSwitchPanelConfigProps[];
}

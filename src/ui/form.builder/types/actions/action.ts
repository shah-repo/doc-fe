import FBActionContainerState from "../../components/actions/FBActionContainer.state";
import { FBStateProps } from "../../helpers/FBStateProps";

export type FBActionContainerProps =
  & FBStateProps<FBActionContainerState>
  & {
    actions?: string[] | React.ReactNode[];
  };

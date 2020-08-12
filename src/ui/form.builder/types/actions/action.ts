import FBActionContainerState from "../../components/actions/FBActionContainer.state";
import { FBStateProps } from "../../helpers/FBStateProps";
import { FBActionModel } from "../../stores/domain/models/FBActionModel";
import { FBFormikFieldProps } from "../formik";

export type FBActionContainerProps =
  & FBStateProps<FBActionContainerState>
  & {
    actions?: string[] | React.ReactNode[];
  };

export type FBActionProps =
    & Omit<FBFormikFieldProps, "name">
    & {
      indicators?: React.ReactNode[];
      actionButton?: React.ReactNode;
      action: Partial<FBActionModel>;
    };

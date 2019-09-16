import {
  DispatchProps as DashboardContainerDispatchProps,
  StateProps as DashboardContainerStateProps,
} from "./Dashboard.container";

export type DashboardPresenterParentProps = DashboardContainerStateProps & DashboardContainerDispatchProps;

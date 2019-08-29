import React from "react";
import { connect } from "react-redux";
import { Route, RouteProps } from "react-router-dom";

import { authSelectors } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import PrivateRoutePresenter from "./PrivateRoute.presenter";

interface StateProps {
  isUserAuthenticated: boolean;
}

interface OwnProps extends RouteProps {
  component: React.ComponentType;
}

type Props = OwnProps & StateProps;

const PrivateRouteContainer: React.FunctionComponent<Props> = ({
  component: Component,
  isUserAuthenticated,
  ...rest
}) => {
  const render = (props: any) => (
    <PrivateRoutePresenter {...props} component={Component} isAuthenticated={isUserAuthenticated} />
  );

  return (
    <Route {...rest} render={render} />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
});

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(PrivateRouteContainer);

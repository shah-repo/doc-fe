import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import StatusPresenter from "../../status/Status.presenter";
import { LOGIN_URL } from "../../constants/urls";

export interface PrivateRoutePresenterProps extends Pick<RouteComponentProps, "location"> {
  isAuthenticated: boolean;
  component: React.ComponentType;
}

const PrivateRoutePresenter: React.FunctionComponent<PrivateRoutePresenterProps> =
  ({ component: Component, isAuthenticated, ...rest }) => {
    if (isAuthenticated) {
      return <Component {...rest} />;
    }

    return (
      <Redirect to={{ pathname: LOGIN_URL, state: { from: rest.location }}}/>
    );
  };

export default PrivateRoutePresenter;

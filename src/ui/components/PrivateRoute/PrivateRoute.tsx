import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { LOGIN_URL } from "../../constants/urls";

export interface PrivateRouteProps extends Pick<RouteComponentProps, "location"> {
  isAuthenticated: boolean;
  component: React.ComponentType;
}

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> =
  ({ component: Component, isAuthenticated, ...rest }) => {
    if (isAuthenticated) {
      return <Component {...rest} />;
    }

    return (
      <Redirect to={{ pathname: LOGIN_URL, state: { from: rest.location }}}/>
    );
  };

export default PrivateRoute;

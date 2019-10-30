import React, { useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { LOGIN_URL } from "../../constants/urls";

export interface PrivateRoutePresenterProps extends Pick<RouteComponentProps, "location" | "history"> {
  isAuthenticated: boolean;
  component: React.ComponentType;
}

const PrivateRoutePresenter: React.FunctionComponent<PrivateRoutePresenterProps> =
  ({ component: Component, isAuthenticated, ...rest }) => {
    useEffect(() => {
      if (!isAuthenticated) {
        rest.history.replace("/");
      }
    }, [isAuthenticated]);

    if (isAuthenticated) {
      return <Component {...rest} />;
    }

    return (
      <Redirect to={{ pathname: LOGIN_URL, state: { from: rest.location }}}/>
    );
  };

export default PrivateRoutePresenter;

import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import Switch from "../app/Switch";
import { SLACK_COMPANY_URL, SLACK_USER_URL } from "../constants/urls";
import SlackLandingContainer from "./landing/Container";

type Props = RouteComponentProps;

const SlackContainer: React.FunctionComponent<Props> = () => (
  <Switch>
    <Route
      path={SLACK_COMPANY_URL}
      component={SlackLandingContainer}
      exact={true}
    />
    <Route
      path={SLACK_USER_URL}
      component={SlackLandingContainer}
      exact={true}
    />
  </Switch>
);

export default SlackContainer;

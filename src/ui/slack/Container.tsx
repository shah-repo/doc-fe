import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import Switch from "../app/Switch";
import { SLACK_COMPANY_URL, SLACK_USER_URL } from "../constants/urls";
import SlackLandingCompanyContainer from "./landing/Company.container";
import SlackLandingUserContainer from "./landing/User.container";

type Props = RouteComponentProps;

export const SlackContainer: React.FunctionComponent<Props> = () => {
  return (
    <Switch>
      <Route
        path={SLACK_COMPANY_URL}
        component={SlackLandingCompanyContainer}
      />
      <Route
        path={SLACK_USER_URL}
        component={SlackLandingUserContainer}
      />
    </Switch>
  );
};

export default SlackContainer;

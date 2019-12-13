import { parse } from "query-string";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { slackActions } from "../../../state/ducks/slack";
import { SLACK_COMPANY_OAUTH_URL, SLACK_USER_OAUTH_URL } from "../../../state/ducks/slack/constants";
import { HOME_URL, SLACK_COMPANY_URL } from "../../constants/urls";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import SlackLandingPresenter from "./Presenter";

type Props = RouteComponentProps;

export const SlackLandingContainer: React.FunctionComponent<Props> = ({
  location,
  history,
}) => {
  const URL = location.pathname === SLACK_COMPANY_URL ?
    SLACK_COMPANY_OAUTH_URL :
    SLACK_USER_OAUTH_URL;
  const { code } = parse(location.search);
  const postSlackCodeAction = useActionCreator(slackActions.postSlackCode);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const async = useAsync({
    onSuccess: () => {
      setTimeout(() => setSuccessMessage("slack.resgistration.completed"), 1000);
    },
    onError: () => {
      setTimeout(() => setSuccessMessage("slack.resgistration.failed"), 1000);
    },
  });

  useEffect(() => {
    async.start(postSlackCodeAction, URL, { code }, async);
  }, []);

  const onCounterFinish = () => {
    // history.push(HOME_URL);
    console.log(HOME_URL);
  };
  const goToDashboard = () => {
    history.push(HOME_URL);
  };
  const retry = () => {
    setSuccessMessage("");
    setErrorMessage("");
    async.start(postSlackCodeAction, URL, { code }, async);
  };

  return (
    <SlackLandingPresenter
      successMessage={successMessage}
      errorMessage={errorMessage}
      onCounterFinish={onCounterFinish}
      goToDashboard={goToDashboard}
      retry={retry}
    />
  );
};

export default SlackLandingContainer;

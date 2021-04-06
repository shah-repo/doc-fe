import queryString from "query-string";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { authActions } from "../../state/ducks/auth";
import AsyncGate from "../components/AsyncGate";
import { LOGIN_URL } from "../constants/urls";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";

const LoginWithCodeContainer: React.FunctionComponent<RouteComponentProps> = ({
  location,
  history,
}) => {
  const code = queryString.parse(location.search).code as string;
  const loginWithCodeAction = useActionCreator(authActions.loginWithCode);

  const async = useAsync({
    onSuccess: () => {
      // the user will be redirected to company select or dashboard screen
      history.replace(LOGIN_URL);
    },
    onError: () => {
      history.replace(LOGIN_URL);
    },
  });
  // NOTE: not sure if this is what the old code with useState tried to achieve
  useEffect(() => {
    if (code) {
      async.start(loginWithCodeAction, { code }, async);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!code) {
    history.replace(LOGIN_URL);
    return null;
  }

  return (
    <AsyncGate asyncState={async.asyncState} />
  );
};

export default LoginWithCodeContainer;

import queryString from "query-string";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authActions } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import AsyncGate from "../components/AsyncGate";
import { HOME_URL, LOGIN_URL } from "../constants/urls";
import useAsync from "../hooks/useAsync";

interface DispatchProps {
  loginWithCode: typeof authActions.loginWithCode;
}

export type LoginWithCodeContainerProps = DispatchProps & RouteComponentProps;

export const LoginWithCodeContainer: React.FunctionComponent<LoginWithCodeContainerProps> = ({
  loginWithCode, location, history,
}) => {
  const code = queryString.parse(location.search).code as string;
  const async = useAsync({
    onSuccess: () => {
      history.replace(HOME_URL);
    },
    onError: () => {
      history.replace(LOGIN_URL);
    },
  });
  // NOTE: not sure if this is what the old code with useState tried to achieve
  useEffect(() => {
    if (code) {
      async.start(loginWithCode, { code }, async)
    }
  }, [code]);

  if (!code) {
    history.replace(LOGIN_URL);
    return null;
  }

  return (
    <AsyncGate asyncState={async.asyncState} />
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  loginWithCode: authActions.loginWithCode,
})(LoginWithCodeContainer);

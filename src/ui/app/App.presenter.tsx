import { Box, CircularProgress } from "@material-ui/core";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { GroupWithGroupOptions } from "../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../state/reducers";
import { AsyncStatus } from "../../state/types";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import Routes from "./Routes";
import _ from "lodash";
import { toastError } from "../components/notifications";
import Config from "../../config";
import { useIntl } from "react-intl";

const AppPresenter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const pingServer = useCallback(() => dispatch(authActions.pingServer()), [dispatch]);
  const [showSpinner, toggleSpinner] = React.useState(true);

  const pingServerAsyncInfo = useSelector((state: ApplicationState) =>
    authSelectors.getPingServerAsyncState(state));

  useEffect(() => {
    if (pingServerAsyncInfo.status === AsyncStatus.Idle) {
      pingServer();
      toggleSpinner(true);
    }

    if (pingServerAsyncInfo.status === AsyncStatus.Success || pingServerAsyncInfo.status === AsyncStatus.Error) {
      setTimeout(() => {
        toggleSpinner(false);
      }, 500);
    }
  }, [pingServer, pingServerAsyncInfo]);

  const intl = useIntl();
  const async = useAsync({
    onSuccess: (response) => {
      if (!_.isEqual(response, GroupWithGroupOptions)) {
        // eslint-disable-next-line no-console
        console.log(intl.formatMessage({ id: "common.document.type.mismatch" }));
        if (!Config.isProduction) { toastError(intl.formatMessage({ id: "common.document.type.mismatch" })); }
      }
    },
  });

  const getGroupWithGroupOptions = useActionCreator(documentTypeActions.getGroupWithGroupOptions);
  useEffect(() => {
    async.start(getGroupWithGroupOptions, async);
  }, []);


  if (showSpinner) {
    return (
      <Box top="50%" right="50%" position="fixed" >
        <CircularProgress size={20} />
      </Box>
    );
  }
  return <Routes />;

};

export default AppPresenter;

import { isEqual } from "lodash";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { areValidCredentials } from "../../common/utils/iot/iotService";
import Config from "../../config";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { setIotCreds } from "../../state/ducks/auth/actions";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { GroupWithGroupOptions } from "../../state/ducks/documentRevisions/documentType/types";
import { pageDetailsActions } from "../../state/ducks/pageDetails";
import { userManagementActions } from "../../state/ducks/userManagement";
import { toastError } from "../components/notifications";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const iotCredentials = useSelector(authSelectors.getCredentials);
  const getGroupWithGroupOptions = useActionCreator(documentTypeActions.getGroupWithGroupOptions);

  useEffect(() => {
    if (employeeId) {
      dispatch(pageDetailsActions.allPageDetails());
      dispatch(documentTypeActions.loadTabConfiguration());
      dispatch(documentTypeActions.loadList());
      dispatch(authActions.getSessionDetails(employeeId));
      dispatch(authActions.loadUserGroups());
      dispatch(userManagementActions.loadCompanyGroups());
      dispatch(changeRequestsActions.loadAvailableApprovers());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (areValidCredentials(iotCredentials, employeeId)) {
      setIotCreds(iotCredentials);
      return;
    }
    if (employeeId) {
      dispatch(authActions.getIotCreds());
    }
  }, [dispatch, employeeId, iotCredentials]);

  const intl = useIntl();
  const async = useAsync({
    onSuccess: (response) => {
      if (!isEqual(response, GroupWithGroupOptions)) {
        // eslint-disable-next-line no-console
        console.log(intl.formatMessage({ id: "common.document.type.mismatch" }));
        if (!Config.isProduction) { toastError(intl.formatMessage({ id: "common.document.type.mismatch" })); }
      }
    },
  });

  useEffect(() => {
    async.start(getGroupWithGroupOptions, async);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

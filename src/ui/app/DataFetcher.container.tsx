import { isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { setIotCreds } from "../../state/ducks/auth/actions";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { GroupWithGroupOptions } from "../../state/ducks/documentRevisions/documentType/types";
import { pageDetailsActions } from "../../state/ducks/pageDetails";
import { userManagementActions } from "../../state/ducks/userManagement";
import { isEqual } from "lodash";
import { toastError } from "../components/notifications";
import Config from "../../config";
import useAsync from "../hooks/useAsync";
import useActionCreator from "../hooks/useActionCreator";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const iotCredentials = useSelector(authSelectors.getCredentials);
  const expirationIotDate = useSelector(authSelectors.getExpirationOfCredentials);

  useEffect(() => {
    dispatch(pageDetailsActions.allPageDetails());
    dispatch(documentTypeActions.loadList());
    dispatch(authActions.getSessionDetails(employeeId));
    dispatch(authActions.loadUserGroups());
    dispatch(userManagementActions.loadCompanyGroups());
    dispatch(changeRequestsActions.loadAvailableApprovers());
    if (moment().isAfter(moment(expirationIotDate)) || isEmpty(expirationIotDate)) {
      dispatch(authActions.getIotCreds());
    } else {
      setIotCreds(iotCredentials);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

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

  const getGroupWithGroupOptions = useActionCreator(documentTypeActions.getGroupWithGroupOptions);
  useEffect(() => {
    async.start(getGroupWithGroupOptions, async);
  }, []);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

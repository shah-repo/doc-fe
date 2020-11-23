import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { setIotCreds } from "../../state/ducks/auth/actions";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { pageDetailsActions } from "../../state/ducks/pageDetails";
import { userManagementActions } from "../../state/ducks/userManagement";

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
    if (moment().isAfter(moment(expirationIotDate))) {
      dispatch(authActions.getIotCreds());
    } else {
      setIotCreds(iotCredentials);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

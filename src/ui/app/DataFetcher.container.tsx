import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { pageDetailsActions } from "../../state/ducks/pageDetails";
import { userManagementActions } from "../../state/ducks/userManagement";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const expirationIotDate = useSelector(authSelectors.getExpirationOfCredentials);

  useEffect(() => {
    dispatch(pageDetailsActions.allPageDetails());
    dispatch(documentTypeActions.loadList());
    dispatch(authActions.getSessionDetails(employeeId));
    dispatch(authActions.loadUserGroups());
    dispatch(userManagementActions.loadCompanyGroups());
    dispatch(changeRequestsActions.loadAvailableApprovers());
    console.log(moment(), moment(expirationIotDate));
    if (moment().isAfter(expirationIotDate)) {
      dispatch(authActions.getIotCreds());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

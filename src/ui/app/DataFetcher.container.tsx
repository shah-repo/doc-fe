import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { changeRequestsActions } from "../../state/ducks/changeRequest";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { userManagementActions } from "../../state/ducks/userManagement";
import useGetHasTag from "../hooks/useGetHasTag";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);

  useEffect(() => {
    dispatch(documentTypeActions.loadList());
    dispatch(authActions.getSessionDetails(employeeId));
    dispatch(authActions.loadUserGroups());
    dispatch(userManagementActions.loadCompanyGroups());
    dispatch(changeRequestsActions.loadAvailableApprovers());
  }, [dispatch, employeeId]);

  useEffect(() => {
    canManageUsers && dispatch(userManagementActions.loadCompanyGroups());
  }, [canManageUsers, dispatch]);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

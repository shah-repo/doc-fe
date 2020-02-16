import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHasTag } from "../../common/utils/selectors";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { userManagementActions } from "../../state/ducks/userManagement";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

  useEffect(() => {
    dispatch(documentTypeActions.loadList());
    dispatch(authActions.getSessionDetails(employeeId));
    dispatch(authActions.loadUserGroups());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    canManageUsers && dispatch(userManagementActions.loadCompanyGroups());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageUsers]);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

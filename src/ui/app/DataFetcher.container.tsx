import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { companyActions } from "../../state/ducks/company";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { userManagementActions } from "../../state/ducks/userManagement";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  useEffect(() => {
    dispatch(documentTypeActions.loadList());
    dispatch(companyActions.queryCompany(employeeId));
    dispatch(authActions.loadUserGroups());
    dispatch(userManagementActions.loadCompanyGroups());
  }, []);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;

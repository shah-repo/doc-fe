import { isEmpty } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { authActions } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { HOME_URL } from "../../constants/urls";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDidMount from "../../hooks/useDidMount";
import useGetHasTag from "../../hooks/useGetHasTag";
import ListPresenter from "./presenter";

export const UserManagementListContainer: React.FunctionComponent = () => {
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const intl = useIntl();

  const TABLE_NAME = "userManagement";
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);

  const getResendSignupEmailAction = useActionCreator(authActions.resendSignupEmail);
  const notify = () => toast.info(intl.formatMessage({
    id: "user.management.signup.email.sent",
  }));
  const async = useAsync({
    onSuccess: () => {
      notify();
    },
  });

  const handleResendSignupEmail = ( email: string ) => async.start(getResendSignupEmailAction, email, async);

  if (isEmpty(tableCriteria.queryDict) && !didMount) {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            active: true,
          },
        },
        TABLE_NAME,
      ),
    );
  }

  if (!canManageUsers) {
    return <Redirect to={HOME_URL} />;
  }

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  return (
    <ListPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      tableData={tableData}
      clearFilter={clearFilter}
      groupOptions={groupOptions}
      handleResendSignupEmail={handleResendSignupEmail}
    />
  );
};

export default UserManagementListContainer;

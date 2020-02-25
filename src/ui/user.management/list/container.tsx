import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { GroupTag } from "../../../state/ducks/auth/types";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { HOME_URL } from "../../constants/urls";
import useDidMount from "../../hooks/useDidMount";
import useGetHasTag from "../../hooks/useGetHasTag";
import ListPresenter from "./presenter";

export const UserManagementListContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "userManagement";
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const didMount = useDidMount();

  if (_.isEmpty(tableCriteria.queryDict) && !didMount) {
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
    />
  );
};

export default UserManagementListContainer;

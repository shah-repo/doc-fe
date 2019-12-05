import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getHasTag, getTableState } from "../../../common/utils/helpers";
import { GroupTag } from "../../../state/ducks/auth/types";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { HOME_URL } from "../../constants/urls";
import ListPresenter from "./presenter";

export const UserManagementListContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "userManagement";
  const dispatch = useDispatch();
  const tableState = useSelector(getTableState(TABLE_NAME));
  const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

  useEffect(() => {
    if (_.isEmpty(tableState.queryDict)) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableState,
            queryDict: {
              active: true,
            },
          },
          TABLE_NAME,
        ),
      );
    }
  }, []);

  if (!canManageUsers) {
    return <Redirect to={HOME_URL} />;
  }

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  return (
    <ListPresenter
      tableName={TABLE_NAME}
      tableState={tableState}
      clearFilter={clearFilter}
    />
  );
};

export default UserManagementListContainer;

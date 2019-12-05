import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import tableSearchSelectors from "../../../state/ducks/tableSearch/selectors";
import { ApplicationState } from "../../../state/reducers";
import { HOME_URL } from "../../constants/urls";
import ListPresenter from "./presenter";

export const UserManagementListContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "userManagement";
  const dispatch = useDispatch();
  const tableState = useSelector((reduxState: ApplicationState) =>
    tableSearchSelectors.getTableState(reduxState, TABLE_NAME),
  );
  const canManageUsers = useSelector((state: ApplicationState) =>
    authSelectors.getHasTag(state, GroupTag.USER_MANAGEMENT),
  );

  if (!canManageUsers) {
    return <Redirect to={HOME_URL} />;
  }

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

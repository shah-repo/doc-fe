import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import tableSearchSelectors from "../../../state/ducks/tableSearch/selectors";
import { ApplicationState } from "../../../state/reducers";
import ListPresenter from "./presenter";

export const UserManagementListContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "userManagement";
  const tableState = useSelector((reduxState: ApplicationState) =>
    tableSearchSelectors.getTableState(reduxState, TABLE_NAME),
  );

  const dispatch = useDispatch();
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

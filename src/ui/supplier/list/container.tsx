import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableState } from "../../../common/utils/selectors";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import useDidMount from "../../hooks/useDidMount";
import ListPresenter from "./presenter";

export const SuppliersListContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "suppliersList";
  const dispatch = useDispatch();
  const tableState = useSelector(getTableState(TABLE_NAME));
  const didMount = useDidMount();

  if (_.isEmpty(tableState.queryDict) && !didMount) {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableState,
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

export default SuppliersListContainer;

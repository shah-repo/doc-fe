import { isEmpty } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { GroupTag } from "../../../state/ducks/auth/types";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { HOME_URL } from "../../constants/urls";
import useDidMount from "../../hooks/useDidMount";
import useGetHasTag from "../../hooks/useGetHasTag";
import KendoPresenter from "./kendogrid.presenter";

const UserManagementKendoContainer: React.FunctionComponent = () => {
  const didMount = useDidMount();
  const dispatch = useDispatch();
  // const intl = useIntl();

  const TABLE_NAME = "userManagement";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);

  if (isEmpty(tableCriteria.queryDict) && !didMount) {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {},
          kendoConfig: JSON.stringify({
            filter: {
              logic: "and",
              filters: [{ field: "active", operator: "eq", value: true }],
            },
          }),
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
    <KendoPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      tableData={tableData}
      clearFilter={clearFilter}
    />
  );
};

export default UserManagementKendoContainer;

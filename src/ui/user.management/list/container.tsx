import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getHasTag, getTableState } from "../../../common/utils/selectors";
import { GroupTag } from "../../../state/ducks/auth/types";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { LoadCompanyGroups, userManagementActions } from "../../../state/ducks/userManagement";
import { SelectOption } from "../../components/forms/fields/Select";
import { HOME_URL } from "../../constants/urls";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDidMount from "../../hooks/useDidMount";
import ListPresenter from "./presenter";

export const UserManagementListContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "userManagement";
  const [groupOptions, setGroupOptions] = useState<SelectOption[]>([]);
  const dispatch = useDispatch();
  const tableState = useSelector(getTableState(TABLE_NAME));
  const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));
  const loadCompanyGroupsAction = useActionCreator(userManagementActions.loadCompanyGroups);
  const async = useAsync<LoadCompanyGroups>({
    onSuccess: (data = []) => {
      const options: SelectOption[] = data.map((group) => ({
        value: group.id,
        text: group.name,
      }));

      setGroupOptions(options);
    },
  });
  const loadCompanyGroups = () => async.start(loadCompanyGroupsAction, async);
  const didMount = useDidMount();

  useEffect(() => {
    loadCompanyGroups();
  }, []);

  if (_.isEmpty(tableState.queryDict) && !didMount) {
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
      groupOptions={groupOptions}
    />
  );
};

export default UserManagementListContainer;

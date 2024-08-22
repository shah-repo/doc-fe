import { isEmpty } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTableCriteria, getTableData } from '../../../common/utils/selectors';
import tableSearchActions from '../../../state/ducks/tableSearch/actions';
import useDidMount from '../../hooks/useDidMount';
import KendoPresenter from './presenter';

const UserManagementKendoContainer: React.FunctionComponent = () => {
  const didMount = useDidMount();
  const dispatch = useDispatch();

  const TABLE_NAME = 'userManagement';
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const data = useSelector(getTableData(TABLE_NAME));

  if (isEmpty(tableCriteria.queryDict) && !didMount) {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {},
        },
        TABLE_NAME,
      ),
    );
  }

  // if (!canManageUsers) {
  //   return <Redirect to={HOME_URL} />;
  // }

  return (
    <KendoPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      data={data}
    />
  );
};

export default UserManagementKendoContainer;

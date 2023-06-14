import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import EditIcon from '@material-ui/icons/Edit';
import { get, set } from 'lodash';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { userManagementActions } from '../../../../state/ducks/userManagement';
import { GetEmployeeResponse } from '../../../../state/ducks/userManagement/types';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { toastError } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { enterUserInfo } from '../column.definition';
import { UserManage } from '../types';
import Commandstyles from './CommandCell.styles';

interface CommandCellProps {
  dataItem: UserManage | GetEmployeeResponse
  editField: string
  add: (dataItem: UserManage) => void
  cancel: (dataItem: UserManage) => void
  edit: (dataItem: GetEmployeeResponse) => void
  colSpan?: number
  style?: React.CSSProperties
  ariaColumnIndex?: number
  className?: string
  columnIndex?: number
  role?: string
  rowType?: string
}

export const CommandCell = ({
  dataItem,
  editField,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  add,
  cancel,
  edit,
}: CommandCellProps) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const classes = Commandstyles();
  const inEdit = dataItem[editField];

  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncName = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      if (data.length === 0) {
        set(dataItem, 'id', null);
        add(dataItem as UserManage);
        return;
      }
      set(dataItem, 'name', data[0].user.name);
      dataItem.id = data[0].user.id;
      add(dataItem as UserManage);
    },
  });
  const fetchUseInfo = () => {
    const name = get(dataItem, 'name');
    const email = get(dataItem, 'email');
    const userName = name || enterUserInfo.name;
    const userEmail = email || enterUserInfo.email;
    if (!userEmail || !userName) {
      toastError(intl.formatMessage({ id: 'user.management.name.email.required' }));
      return;
    }
    if (!name) {
      set(dataItem, name, userName);
    }
    if (!email) {
      set(dataItem, email, userEmail);
    }
    asyncName.start(getEmployeeAction, { email: userEmail }, asyncName );
  };

  if (rowType === 'groupHeader') {
    return null;
  }

  return inEdit ? (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText('user.management.add.employee')}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => fetchUseInfo()}
            className={classes.button}
          >
            <AddCircleOutlineIcon
              className={classes.ButtonColor}
              fontSize="small"
            />
          </IconButton>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText('common.discard')}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => cancel(dataItem as UserManage)}
            className={classes.button}
          >
            <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  ) : (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText('user.management.edit.employee')}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => edit(dataItem as GetEmployeeResponse)}
            className={classes.button}
          >
            <EditIcon className={classes.ButtonColor} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  );
};

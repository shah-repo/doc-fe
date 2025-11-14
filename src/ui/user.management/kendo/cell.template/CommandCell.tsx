import { get } from 'lodash';
import * as React from 'react';
import { translate } from '../../../../common/intl';
import { GetEmployeeResponse } from '../../../../state/ducks/userManagement/types';
import ActionsButtons from '../../../administration/general.settings/components/SettingsTable/components/ActionButtons';
import { toastError } from '../../../components/notifications';
import { UserManage } from '../types';

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
  columnIndex = 0,
  add,
  cancel,
  edit,
}: CommandCellProps): React.ReactElement | null => {
  const isEditMode = Boolean(dataItem[editField]);

  const addEmployee = () => {
    const name = get(dataItem, 'name');
    const email = get(dataItem, 'email');
    if (!email || !name) {
      toastError(translate('user.management.name.email.required'));
      return;
    }
    add(dataItem as UserManage);
  };

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <ActionsButtons
        isEditMode={isEditMode}
        isActive
        onConfirm={addEmployee}
        onDiscard={() => cancel(dataItem as UserManage)}
        onEdit={() => edit(dataItem as GetEmployeeResponse)}
      />
    </td>
  );
};

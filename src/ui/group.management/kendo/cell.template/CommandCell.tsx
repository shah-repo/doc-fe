import { GridRowClickEvent } from '@progress/kendo-react-grid';
import React from 'react';
import { GroupRequestBody } from '../../../../state/ducks/groupManagement/types';
import { LoadCompanyGroup } from '../../../../state/ducks/userManagement/types';
import ActionsButtons from '../../../administration/general.settings/components/SettingsTable/components/ActionButtons';

interface CommandCellProps {
  dataItem: any
  rowType?: string
  colSpan?: number
  style?: React.CSSProperties
  className?: string
  columnIndex?: number
  update: ((props: GroupRequestBody) => void)
  discard: ((props: LoadCompanyGroup) => void)
  cancel: (() => void)
  edit: ((props: GridRowClickEvent) => void)
}

export const CommandCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  update,
  cancel,
  edit,
}: CommandCellProps): React.ReactElement | null => {
  const isEditMode = Boolean(dataItem.inEdit);

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
        onConfirm={() => update(dataItem)}
        onDiscard={cancel}
        onEdit={() => edit(dataItem)}
      />
    </td>
  );
};

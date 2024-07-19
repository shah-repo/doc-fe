import { ColumnMenuItem } from '@progress/kendo-react-data-tools';
import { GridColumnMenuProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { DisplayText, TranslatedText } from '../../../../components/common/kendo/helpers';
import { EditableLHRSummaryItem } from '../../types';

interface CustomColumnMenuProps extends GridColumnMenuProps {
  columns: Array<ColumnDefinition<EditableLHRSummaryItem>>
  onLock: ({ field, locked }) => void
}

interface ColumnMenuContextProps {
  columns: Array<ColumnDefinition<EditableLHRSummaryItem>>
  onLock: (params) => void
}

export const ColumnMenuContext = React.createContext<ColumnMenuContextProps>({} as ColumnMenuContextProps);

export const CustomColumnMenu: React.ComponentType<CustomColumnMenuProps> = (props) => {
  const { column, onLock, columns } = props;
  const selectedColumn = columns.find(c => c.field === column.field);
  const isLocked = Boolean(selectedColumn?.locked);
  const index = selectedColumn?.orderIndex ?? selectedColumn?.mainOrderIndex ?? 0;

  return (
    <ColumnMenuItem
      {...props}
      iconClass={`k-icon k-grid-menu-icon ${selectedColumn?.locked ? 'k-i-unlock' : 'k-i-lock'}`}
      onClick={() => onLock({ locked: isLocked, field: column?.field })}
      title={translate(isLocked ? TranslatedText[DisplayText.UNLOCK_COLUMN] : TranslatedText[DisplayText.LOCK_COLUMN])}
      data-cy={`column-menu-${index}-item-${selectedColumn?.locked ? 'unfreeze' : 'freeze'}`}
    />
  );
};

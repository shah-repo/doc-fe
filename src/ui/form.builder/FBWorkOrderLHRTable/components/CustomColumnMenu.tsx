import { ColumnMenuItem } from '@progress/kendo-react-data-tools';
import { GridColumnMenuProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../../common/intl';
import {
  DisplayText,
  TranslatedText,
} from '../../../components/common/kendo/helpers';
import { ColumnDefinition } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableLHRTableItem } from '../types';

interface CustomColumnMenuProps extends GridColumnMenuProps {
  columns: Array<ColumnDefinition<EditableLHRTableItem>>
  onColumnShowHide: (params) => void
  onLock: ({ field, locked }) => void
}

interface ColumnMenuContextProps {
  columns: Array<ColumnDefinition<EditableLHRTableItem>>
  onColumnShowHide: (params) => void
  onLock: (params) => void
}

export const LHRTableColumnMenuContext
  = React.createContext<ColumnMenuContextProps>({} as ColumnMenuContextProps);

export const CustomColumnMenu: React.ComponentType<CustomColumnMenuProps> = (
  props,
) => {
  const { column, onLock, onColumnShowHide } = props;
  const { columns } = React.useContext(LHRTableColumnMenuContext)!;
  const selectedColumn = columns.find((c) => c.field === column.field);
  const isLocked = Boolean(selectedColumn?.locked);
  const index
    = selectedColumn?.orderIndex ?? selectedColumn?.mainOrderIndex ?? 0;

  return (<>
    {!selectedColumn?.disableShowOrHideSelection && (
      <ColumnMenuItem
        {...props}
        iconClass="k-i-preview k-i-eye k-grid-menu-icon"
        onClick={() => onColumnShowHide(column)}
        title={translate(TranslatedText[DisplayText.HIDE_COLUMN])}
        data-cy={`column-menu-${index}-item-hide`}
      />
    )}
    <ColumnMenuItem
      {...props}
      iconClass={`k-icon k-grid-menu-icon ${
        selectedColumn?.locked ? 'k-i-unlock' : 'k-i-lock'
      }`}
      onClick={() => onLock({ locked: isLocked, field: column?.field })}
      title={translate(
        isLocked
          ? TranslatedText[DisplayText.UNLOCK_COLUMN]
          : TranslatedText[DisplayText.LOCK_COLUMN],
      )}
      data-cy={`column-menu-${index}-item-${
        selectedColumn?.locked ? 'unfreeze' : 'freeze'
      }`}
    />
  </>
  );
};

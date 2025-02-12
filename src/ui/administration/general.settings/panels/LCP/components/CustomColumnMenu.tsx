import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createStyles, makeStyles } from '@material-ui/core';
import { ColumnMenuItem } from '@progress/kendo-react-data-tools';
import { GridColumnMenuProps } from '@progress/kendo-react-grid';
import { GridColumnMenuColumnProps } from '@progress/kendo-react-grid/dist/npm/interfaces/GridColumnMenuColumnProps';
import cx from 'classnames';
import React, { useContext } from 'react';
import { translate } from '../../../../../../common/intl';
import { ColumnDefinition } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import HeaderMenu from '../../../../../components/common/header/Menu';
import { DisplayText, TranslatedText } from '../../../../../components/common/kendo/helpers';
import Colors from '../../../../../layout/theme/utils/colors';
import { EditableLCP } from './Grid/types';
interface CustomColumnMenuProps extends Partial<GridColumnMenuProps> {
  field: string
}

export interface CustomGridColumnMenuColumnProps extends GridColumnMenuColumnProps {
  locked: boolean
}

interface ColumnMenuContextProps {
  columns: Array<ColumnDefinition<EditableLCP>>
  onLock: (params) => void
}

export const ColumnMenuContext = React.createContext<ColumnMenuContextProps>({} as ColumnMenuContextProps);

const styles = makeStyles(() =>
  createStyles({
    icon: {
      color: Colors.light_gray_III,
    },
    columnMenuItem: {
      color: Colors.light_gray_II,
      backgroundColor: Colors.white,
      margin: '0px',
      padding: '0px',
      width: '230px',
    },
  }));

export const CustomColumnMenu: React.ComponentType<CustomColumnMenuProps> = (props) => {
  const classes = styles();
  const { field } = props;
  const { columns, onLock } = useContext(ColumnMenuContext);
  const selectedColumn = columns.find(c => c.field === field);
  const isLocked = Boolean(selectedColumn?.locked);
  const index = selectedColumn?.orderIndex ?? selectedColumn?.mainOrderIndex ?? 0;
  const dataCy = `column-menu-${index}`;

  return (
    <HeaderMenu
      columnMenuItemClasses={cx('k-grid-columnmenu-popup', classes.columnMenuItem)}
      icon={<FontAwesomeIcon className={cx('k-icon', classes.icon)} icon={solid('ellipsis-vertical')} />}
      dataCy={dataCy}
    >
      <ColumnMenuItem
        {...props}
        iconClass={`k-icon k-grid-menu-icon ${selectedColumn?.locked ? 'k-i-unlock' : 'k-i-lock'}`}
        onClick={() => onLock({ locked: isLocked, field })}
        title={translate(isLocked ? TranslatedText[DisplayText.UNLOCK_COLUMN] : TranslatedText[DisplayText.LOCK_COLUMN])}
        data-cy={`column-menu-${index}-item-${selectedColumn?.locked ? 'unfreeze' : 'freeze'}`}
      />
    </HeaderMenu>
  );
};

import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createStyles, makeStyles } from '@material-ui/core';
import { ColumnMenuItem, ColumnMenuProps } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import React, { ComponentType } from 'react';
import { translate } from '../../../../common/intl';
import Colors from '../../../layout/theme/utils/colors';
import HeaderMenu from '../header/Menu';
import { DisplayText, TranslatedText } from '../kendo/helpers';
import { CustomTreeListColumnProps } from '../treelist/types';

interface CustomColumnMenuProps extends ColumnMenuProps {
  columns: CustomTreeListColumnProps[]
  onColumnShowHide: (column: CustomTreeListColumnProps) => void
  onLock: ({ field, locked }) => void
}

interface ColumnMenuContextProps {
  columns: CustomTreeListColumnProps[]
  onColumnShowHide: (params) => void
  onLock: (params) => void
  isMaximizedView?: boolean
}

export const ColumnMenuContext = React.createContext<ColumnMenuContextProps>({} as ColumnMenuContextProps);

const styles = makeStyles(() =>
  createStyles({
    icon: {
      color: Colors.light_gray_III,
    },
    iconButton: {
      marginRight: 0,
      cursor: 'pointer',
    },
    columnMenuItem: {
      color: Colors.light_gray_II,
      backgroundColor: Colors.white,
      margin: '0px',
      padding: '0px',
      width: '230px',
    },
  }));

export const CustomColumnMenu: ComponentType<CustomColumnMenuProps> = (props) => {
  const { field, onLock, columns, onColumnShowHide } = props;
  const column: CustomTreeListColumnProps | undefined = columns.find(c => c.field === field);
  const isLocked = Boolean(column?.locked);
  const classes = styles();
  const index = column?.orderIndex ?? column?.mainOrderIndex ?? 0;
  const dataCy = `column-menu-${index}`;
  return (
    <>
      <HeaderMenu
        columnMenuItemClasses={cx('k-grid-columnmenu-popup', classes.columnMenuItem)}
        menuIconButtonClass={classes.iconButton}
        icon={<FontAwesomeIcon className={cx('k-icon', classes.icon)} icon={solid('ellipsis-vertical')} />}
        dataCy={dataCy}
      >
        {!column?.disableShowOrHideSelection && (
          <ColumnMenuItem
            {...props}
            iconClass="k-i-preview k-i-eye k-grid-menu-icon"
            onClick={() => onColumnShowHide(column as CustomTreeListColumnProps)}
            title={translate(TranslatedText[DisplayText.HIDE_COLUMN])}
            data-cy={`column-menu-${index}-item-hide`}
          />
        )}
        <ColumnMenuItem
          {...props}
          iconClass={`k-icon k-grid-menu-icon ${column?.locked ? 'k-i-unlock' : 'k-i-lock'}`}
          onClick={() => onLock({ locked: isLocked, field })}
          title={translate(isLocked ? TranslatedText[DisplayText.UNLOCK_COLUMN] : TranslatedText[DisplayText.LOCK_COLUMN])}
          data-cy={`column-menu-${index}-item-${column?.locked ? 'unfreeze' : 'freeze'}`}
        />
      </HeaderMenu>
    </>
  );
};

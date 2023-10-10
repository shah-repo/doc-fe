import { ColumnMenuItem, ColumnMenuProps, ColumnMenuTextColumn } from '@progress/kendo-react-data-tools';
import React, { ComponentType } from 'react';
import { translate } from '../../../../../../common/intl';
import { DisplayText, TranslatedText } from '../../../../../components/common/kendo/helpers';
import { CustomTreeListColumnProps } from '../interface';

interface CustomColumnMenuProps extends ColumnMenuProps {
  columns: CustomTreeListColumnProps[]
  onColumnShowHide: (column: CustomTreeListColumnProps) => void
  onLock: ({ field, locked, closeMenu }) => void
}

interface ColumnMenuContextProps {
  columns: CustomTreeListColumnProps[]
  onColumnShowHide: (params) => void
  onLock: (params) => void
  isMaximizedView: boolean
}

export const ColumnMenuContext = React.createContext<ColumnMenuContextProps>({} as ColumnMenuContextProps);

export const CustomColumnMenu: ComponentType<CustomColumnMenuProps> = (props) => {
  const { field, onLock, columns, onColumnShowHide } = props;
  const column: CustomTreeListColumnProps | undefined = columns.find(c => c.field === field);
  const isLocked = Boolean(column?.locked);

  const itemsRender = (rendering: Array<React.ReactElement<HTMLDivElement, string | React.JSXElementConstructor<any>> | null>, colProps: { closeMenu: () => void, field?: string | undefined}) => {
    const items: Array<React.ReactElement<HTMLDivElement, string | React.JSXElementConstructor<any>> | null> = [...rendering];
    items.pop();
    !column?.disableShowOrHideSelection && items.push((
      <ColumnMenuItem
        {...props}
        iconClass="k-i-preview k-i-eye k-grid-menu-icon"
        onClick={() => onColumnShowHide(column as CustomTreeListColumnProps)}
        title={translate(TranslatedText[DisplayText.HIDE_COLUMN])}
      />));
    items.push((
      <ColumnMenuItem
        {...props}
        iconClass={`k-icon k-grid-menu-icon ${column?.locked ? 'k-i-unlock' : 'k-i-lock'}`}
        onClick={() => onLock({ ...colProps, locked: isLocked, field })}
        title={translate(isLocked ? TranslatedText[DisplayText.UNLOCK_COLUMN] : TranslatedText[DisplayText.LOCK_COLUMN])}
      />));
    return items;
  };

  return (
    <>
      {column?.isShowedMenu ?? <ColumnMenuTextColumn {...props} sortAsc={false} sortDesc={false} itemsRender={itemsRender} />}
    </>
  );
};

import { ColumnMenuItem, ColumnMenuProps, ColumnMenuTextColumn } from '@progress/kendo-react-data-tools';
import React, { ComponentType } from 'react';
import { useIntl } from 'react-intl';
import { DisplayText, TranslatedText } from '../../../../../components/common/kendo/helpers';
import { CustomTreeListColumnProps } from '../constants';

interface CustomColumnMenuProps extends ColumnMenuProps {
  columns: CustomTreeListColumnProps[]
  onColumnShowHide: (column: CustomTreeListColumnProps) => void
  onLock: ({ field, locked, closeMenu }) => void
}

export const CustomColumnMenu: ComponentType<CustomColumnMenuProps> = (props) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const { field, onLock, columns, onColumnShowHide } = props;
  const column: CustomTreeListColumnProps | undefined = columns.find(c => c.field === field);
  const locked = Boolean(column?.locked);

  const itemsRender = (rendering: Array<React.ReactElement<HTMLDivElement, string | React.JSXElementConstructor<any>> | null>, colProps: { closeMenu: () => void, field?: string | undefined}) => {
    const items: Array<React.ReactElement<HTMLDivElement, string | React.JSXElementConstructor<any>> | null> = [...rendering];
    items.pop();
    items.push((<ColumnMenuItem
      {...props}
      iconClass="k-i-preview k-i-eye k-grid-menu-icon"
      onClick={() => onColumnShowHide(column as CustomTreeListColumnProps)}
      title={getTranslatedText(TranslatedText[DisplayText.HIDE_COLUMN])}
    />), (
      <ColumnMenuItem
        {...props}
        iconClass={`k-icon k-grid-menu-icon ${column?.locked ? 'k-i-unlock' : 'k-i-lock'}`}
        onClick={() => onLock({ ...colProps, locked, field })}
        title={
      column?.locked
        ? getTranslatedText(TranslatedText[DisplayText.UNLOCK_COLUMN])
        : getTranslatedText(TranslatedText[DisplayText.LOCK_COLUMN])
        }
      />));
    return items;
  };

  return (
    <>
      {column?.showMenu ?? <ColumnMenuTextColumn {...props} sortAsc={false} sortDesc={false} itemsRender={itemsRender} />}
    </>
  );
};

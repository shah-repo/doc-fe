import { GridCellProps } from '@progress/kendo-react-grid';
import React, { ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { DisplayText, TranslatedText } from '../kendo/helpers';

const CellRender = (td: ReactElement | null, {
  rowType,
  dataItem,
}: GridCellProps) => {
  const intl = useIntl();
  if (td && td.props.children && rowType === 'groupHeader') {
    const formatMessageMap = (text: string | number) =>
      intl.formatMessage({ id: TranslatedText[text] });
    let children = (
      <>
        {td.props.children.props?.children}
        {typeof dataItem.value === 'boolean'
          ? dataItem.value
            ? formatMessageMap(DisplayText.YES)
            : formatMessageMap(DisplayText.NO)
          : null}
      </>
    );
    if (dataItem.field === 'active') {
      children = (
        <>
          {td.props.children.props?.children}{' '}
          {dataItem.value
            ? formatMessageMap(DisplayText.ACTIVE)
            : formatMessageMap(DisplayText.INACTIVE)}
        </>
      );
    }
    if (dataItem.field === 'status') {
      children = (
        <>
          {td.props.children?.props?.children}
        </>
      );
    }
    if (dataItem.field === 'isOfficial') {
      children = (
        <>
          {td.props.children?.props?.children}{' '}
          {dataItem.value
            ? formatMessageMap(DisplayText.OFFICIAL)
            : formatMessageMap(DisplayText.UNOFFICIAL)}
        </>
      );
    }
    if (dataItem.field === 'precalc.lhr_end_accepted_quantity') {
      children = (
        <>
          {td.props.children?.props?.children[0]}{' '}
          {dataItem.value === -1 ? 'N/A' : dataItem.value}
        </>
      );
    }
    return React.cloneElement(td, td.props, children);
  }
  return td;
};

export default CellRender;

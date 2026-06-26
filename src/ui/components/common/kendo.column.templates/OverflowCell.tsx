import { get } from 'lodash';
import React, { lazy, Suspense } from 'react';
import { translate } from '../../../../common/intl';
import { convertHtmlEntities, stripTags } from '../../../../common/utils/helpers';
import { HTML_CONTENT_FIELDS } from '../../../documentType/grid/constants';
import useHoverOnce from '../../../hooks/useHoverOnce';
import { CustomGridCellProps } from '../kendo/types';

const LazyOverflowTooltip = lazy(async () => await import('../../OverflowTooltip'));

export const OverflowCell: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const fieldValue = get(dataItem, field ?? '', '') ?? '';
  const dataString = Array.isArray(fieldValue) ? fieldValue.join(', ') : fieldValue;
  const shouldStripHtml = HTML_CONTENT_FIELDS.includes(field ?? '');
  const convertedValue = convertHtmlEntities(dataString) ?? '';
  const dataItemValue = shouldStripHtml ? stripTags(convertedValue) : convertedValue;
  const [elementRef, isHovered] = useHoverOnce<HTMLSpanElement>();

  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={{ ...style, textAlign: 'left' }}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      {!isHovered ? <span ref={elementRef}>
        {dataItemValue}
      </span>
        : <Suspense fallback={<div>{translate('common.loading')}</div>}>
          <LazyOverflowTooltip title={dataItemValue} placement="top" interactive arrow>
            {dataItemValue}
          </LazyOverflowTooltip>
        </Suspense>}
    </td>
  );
};

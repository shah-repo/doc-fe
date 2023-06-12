import { Grid, GridProps } from '@progress/kendo-react-grid';
import { LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';
import cx from 'classnames';
import React, { MutableRefObject, PropsWithChildren, useLayoutEffect, useMemo, useRef } from 'react';
import { intl } from '../../../common/intl';
import { withThemeNext } from '../../layout/theme-next';
import { Translation } from '../../translations/types';
import useStyles from './StyledKendoGrid.styles';
import { StyledKendoGridProps } from './StyledKendoGrid.types';

const formatMessage = (id: Translation) => intl.formatMessage({ id });

loadMessages({
  grid: {
    filterBooleanAll: formatMessage('common.all'),
    filterIsTrue: formatMessage('common.true'),
    filterIsFalse: formatMessage('common.false'),
    groupPanelEmpty: formatMessage('kendo.groupPanelEmpty'),
  },
}, intl.locale);

const StyledKendoGrid: React.FC<PropsWithChildren<StyledKendoGridProps>> = ({
  children,
  hasBoxScrollbars,
  containerRef,
  onRowClick,
  ...props
}, ref: MutableRefObject<Grid>) => {
  useStyles();

  const gridContainerRef = containerRef ?? useRef<HTMLDivElement>(null);
  const gridContainer = gridContainerRef.current;

  const [gridContent, gridHeader] = useMemo<Array<HTMLDivElement | null>>(
    () => (
      gridContainer
        ? [
          gridContainer.querySelector('.k-grid-content'),
          gridContainer.querySelector('.k-grid-header'),
        ]
        : [null, null]
    ),
    [gridContainer],
  );

  useLayoutEffect(() => {
    if (gridContent && gridHeader) {
      const verticalScrollWidth = gridContent.offsetWidth - gridContent.clientWidth;
      gridHeader.style.paddingInlineEnd = `${verticalScrollWidth}px`;
    }
  });

  useLayoutEffect(() => {
    if (gridContent) {
      hasBoxScrollbars
        ? gridContent.classList.add('containing-box-scrollbar')
        : gridContent.classList.remove('containing-box-scrollbar');
    }
  }, [hasBoxScrollbars, gridContent]);

  const renderRow: GridProps['rowRender'] = (row, rowProps) => {
    const rowElement = onRowClick
      ? React.cloneElement(row, { className: cx(row.props.className, 'k-clickable-row') })
      : row;

    return props.rowRender?.(rowElement, rowProps) ?? rowElement;
  };

  return (
    <LocalizationProvider language={intl.locale}>
      {/* TODO Switch to Box after upgrading MUI as for now it doesn't support refs */}
      <div
        ref={gridContainerRef}
        style={props.style}
      >
        <Grid
          {...props}
          ref={ref}
          rowRender={renderRow}
          onRowClick={onRowClick}
        >
          {children}
        </Grid>
      </div>
    </LocalizationProvider>
  );
};

export default withThemeNext(React.forwardRef(StyledKendoGrid));

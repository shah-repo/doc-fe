import { Grid } from '@progress/kendo-react-grid';
import { LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';
import cx from 'classnames';
import React, { MutableRefObject, PropsWithChildren, useLayoutEffect, useMemo, useRef } from 'react';
import { intl } from '../../../common/intl';
import { withThemeNext } from '../../layout/theme-next';
import { Translation } from '../../translations/types';
import useStyles from './StyledKendoGrid.styles';
import { RowComponent, StyledKendoGridProps } from './StyledKendoGrid.types';

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
  onRowClick,
  ...props
}, ref: MutableRefObject<Grid>) => {
  useStyles();

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridContainer = gridContainerRef.current;

  const [gridContent, gridHeaderWrap] = useMemo<Array<HTMLDivElement | null>>(
    () => (
      gridContainer
        ? [
          gridContainer.querySelector('.k-grid-content'),
          gridContainer.querySelector('.k-grid-header-wrap'),
        ]
        : [null, null]
    ),
    [gridContainer],
  );

  useLayoutEffect(() => {
    if (gridContent && gridHeaderWrap) {
      const verticalScrollWidth = gridContent.offsetWidth - gridContent.clientWidth;
      gridHeaderWrap.style.paddingRight = `${verticalScrollWidth}px`;
    }
  });

  useLayoutEffect(() => {
    if (gridContent) {
      hasBoxScrollbars
        ? gridContent.classList.add('containing-box-scrollbar')
        : gridContent.classList.remove('containing-box-scrollbar');
    }
  }, [hasBoxScrollbars, gridContent]);

  const renderRow: RowComponent = (row) =>
    React.cloneElement(row, {
      className: cx(row.props.className, { 'k-clickable-row': onRowClick }),
    });

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
          rowRender={props.rowRender ?? renderRow}
        >
          {children}
        </Grid>
      </div>
    </LocalizationProvider>
  );
};

export default withThemeNext(React.forwardRef(StyledKendoGrid));

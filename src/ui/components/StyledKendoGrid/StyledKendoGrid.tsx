import { Grid, GridRowProps } from "@progress/kendo-react-grid";
import { LocalizationProvider, loadMessages } from "@progress/kendo-react-intl";
import cx from "classnames";
import React, { PropsWithChildren, useLayoutEffect, useMemo, useRef } from "react";
import { intl } from "../../../common/intl";
import { withThemeNext } from "../../layout/theme-next";
import { Translation } from "../../translations/types";
import useStyles from "./StyledKendoGrid.styles";
import { StyledKendoGridProps } from "./StyledKendoGrid.types";

const formatMessage = (id: Translation) => intl.formatMessage({ id });

loadMessages({
  grid: {
    filterBooleanAll: formatMessage("common.all"),
    filterIsTrue: formatMessage("common.true"),
    filterIsFalse: formatMessage("common.false"),
    groupPanelEmpty: formatMessage("kendo.groupPanelEmpty"),
  },
}, intl.locale);

const StyledKendoGrid: React.FC<PropsWithChildren<StyledKendoGridProps>> = ({
  children,
  hasBoxScrollbars,
  ...props
}, ref) => {
  useStyles();

  const gridRef = ref ?? useRef<Grid>();
  const gridContent = useMemo(
    () => gridRef.current?.element.querySelector(".k-grid-content"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridRef, gridRef.current]
  );
  const gridHeaderWrap = useMemo(
    () => gridRef.current?.element.querySelector(".k-grid-header-wrap"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridRef, gridRef.current]
  );

  useLayoutEffect(() => {
    if (gridContent && gridHeaderWrap) {
      const verticalScrollWidth = gridContent.offsetWidth - gridContent.clientWidth;
      gridHeaderWrap.style.paddingRight = verticalScrollWidth + "px";
    }
  });

  useLayoutEffect(() => {
    if (gridContent) {
      hasBoxScrollbars
        ? gridContent.classList.add("containing-box-scrollbar")
        : gridContent.classList.remove("containing-box-scrollbar");
    }
  }, [hasBoxScrollbars, gridContent]);

  const renderRow = (row: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) =>
    React.cloneElement(row, {
      className: cx(row.props.className, { "k-clickable-row": props.onClick }),
    });

  return (
    <LocalizationProvider language={intl.locale}>
      <Grid
        {...props}
        ref={gridRef}
        rowRender={props.rowRender ?? renderRow}
      >
        {children}
      </Grid>
    </LocalizationProvider>
  );
};

export default withThemeNext(React.forwardRef(StyledKendoGrid));

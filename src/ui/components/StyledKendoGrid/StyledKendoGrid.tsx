import { Grid, GridProps } from "@progress/kendo-react-grid";
import { LocalizationProvider, loadMessages } from "@progress/kendo-react-intl";
import React, { PropsWithChildren, useLayoutEffect, useMemo, useRef } from "react";
import { intl } from "../../../common/intl";
import { withThemeNext } from "../../layout/theme-next";
import { Translation } from "../../translations/types";
import useStyles from "./StyledKendoGrid.styles";

const formatMessage = (id: Translation) => intl.formatMessage({ id });

loadMessages({
  grid: {
    filterBooleanAll: formatMessage("common.all"),
    filterIsTrue: formatMessage("common.true"),
    filterIsFalse: formatMessage("common.false"),
    groupPanelEmpty: formatMessage("kendo.groupPanelEmpty"),
  },
}, intl.locale);

const StyledKendoGrid: React.FC<PropsWithChildren<GridProps>> = ({ children, ...props }, ref) => {
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

  return (
    <LocalizationProvider language={intl.locale}>
      <Grid {...props} ref={gridRef}>
        {children}
      </Grid>
    </LocalizationProvider>
  );
};

export default withThemeNext(React.forwardRef(StyledKendoGrid));

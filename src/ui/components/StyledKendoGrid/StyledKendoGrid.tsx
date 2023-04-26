import { Grid, GridProps } from "@progress/kendo-react-grid";
import { LocalizationProvider, loadMessages } from "@progress/kendo-react-intl";
import React, { PropsWithChildren } from "react";
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

  return (
    <LocalizationProvider language={intl.locale}>
      <Grid {...props} ref={ref}>
        {children}
      </Grid>
    </LocalizationProvider>
  );
};

export default withThemeNext(React.forwardRef(StyledKendoGrid));

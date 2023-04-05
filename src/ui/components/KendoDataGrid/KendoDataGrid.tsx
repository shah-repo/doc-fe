import { Grid, GridProps } from "@progress/kendo-react-grid";
import { LocalizationProvider, loadMessages } from "@progress/kendo-react-intl";
import React from "react";
import { intl } from "../../../common/intl";
import { Translation } from "../../translations/types";
import useStyles from "./KendoDataGrid.styles";

const formatMessage = (id: Translation) => intl.formatMessage({ id });

loadMessages({
  grid: {
    filterBooleanAll: formatMessage("common.all"),
    filterIsTrue: formatMessage("common.true"),
    filterIsFalse: formatMessage("common.false"),
    groupPanelEmpty: formatMessage("kendo.groupPanelEmpty"),
  },
}, intl.locale);

const KendoDataGrid: React.FC<GridProps> = (props) => {
  useStyles();

  return (
    <LocalizationProvider language={intl.locale}>
      <Grid {...props} />
    </LocalizationProvider>
  );
};

export default KendoDataGrid;

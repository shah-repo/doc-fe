import { Grid } from "@material-ui/core";
import { map, startCase } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { CHANGE_REQUEST_ROOT_URL_SEARCH } from "../../../state/ducks/changeRequest/constants";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { KendoGrid } from "../../components/KendoGrid/KendoGrid";
import KendoGridStyles from "../../components/KendoGrid/KendoGrid.styles";
import FormListContainer from "../form.list/FormList.container";
import { KendoPresenterProps } from "./interfaces";


export function DocumentListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
}: KendoPresenterProps) {
  const classes = KendoGridStyles();
  const [dataToBeExported, setDataToBeExported] = React.useState<ChangeRequest[]>([]);
  const handleExportData = (dataToBeExported: ChangeRequest[]) => {
    setDataToBeExported(dataToBeExported);
  };
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const headers = map(columns, (column) => ({
    label: startCase(getTranslatedText(column.title)),
    key: column.field,
  }));
  // CR
  const isGrouped = tableCriteria?.queryDict?.dataState?.group?.length > 0;
  console.log("tableCriteria CR:", isGrouped);
  return (
    <Grid container>
      <Grid item xs={12} className={classes.headerGridItem}>
        <FormListContainer {...{ headers, tableData: dataToBeExported, isGrouped }} />
      </Grid>
      <Grid item xs={12} className={classes.kendoGridItem}>
        <KendoGrid
          tableName={tableName}
          tableCriteria={tableCriteria}
          schema={schema}
          exportDataChanges={handleExportData}
          onRowClick={onRowClick}
          queryUrl={CHANGE_REQUEST_ROOT_URL_SEARCH}
          defaultPayloadData={{}}
        />
      </Grid>
    </Grid>
  );
}

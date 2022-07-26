import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { TrainingListData } from "../../../state/ducks/training/types";
import GridTitle from "../../components/KendoGrid/GridTitle/presenter";
import { KendoGrid } from "../../components/KendoGrid/KendoGrid";
import KendoGridStyles from "../../components/KendoGrid/KendoGrid.styles";
import ExportButton from "./ExportButton";
import { KendoPresenterProps } from "./interfaces";

export function TrainingListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
  queryUrl,
  defaultPayloadData,
}: KendoPresenterProps) {
  const classes = KendoGridStyles();
  const [dataToBeExported, setDataToBeExported] = useState<TrainingListData[]>([]);
  const handleExportData = (dataToBeExported: TrainingListData[]) => {
    setDataToBeExported(dataToBeExported);
  };

  return (
    <Grid container>
      <Grid item xs={12} className={classes.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="page.title.training" />
          </Grid>
          <Grid item>
            <ExportButton columns={columns} gridData={dataToBeExported} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.kendoGridItem}>
        <KendoGrid
          tableName={tableName}
          tableCriteria={tableCriteria}
          schema={schema}
          exportDataChanges={handleExportData}
          onRowClick={onRowClick}
          queryUrl={queryUrl}
          defaultPayloadData={defaultPayloadData}
        />
      </Grid>
    </Grid>
  );
}

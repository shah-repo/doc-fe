import { Box, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { TrainingListData } from "../../../state/ducks/training/types";
import GridTitle from "../../document.revision/grid/GridTitle";
import { KendoGrid } from "../../document.revision/grid/KendoGrid";
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
  const [dataToBeExported, setDataToBeExported] = useState<TrainingListData[]>([]);
  const handleExportData = (dataToBeExported: TrainingListData[]) => {
    setDataToBeExported(dataToBeExported);
  };
  console.log("debug :: dataToBeExported :: ", dataToBeExported);
  return (
    <Box m={2}>
      <Grid container={true}>
        <GridTitle translation="page.title.training" />
        <Grid item={true}>
          <ExportButton columns={columns} gridData={dataToBeExported} />
        </Grid>
        <Grid item={true} xs={12}>
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
    </Box>
  );
}

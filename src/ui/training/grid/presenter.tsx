import { Box, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ExportButton from "../../document.revision/grid/ExportButton";
import GridTitle from "../../document.revision/grid/GridTitle";
import { KendoGrid } from "../../document.revision/grid/KendoGrid";
import { KendoPresenterProps } from "./interfaces";


export function TrainingListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
}: KendoPresenterProps) {
  const [dataToBeExported, setDataToBeExported] = useState<DocumentRevision[]>([]);
  const handleExportData = (dataToBeExported: DocumentRevision[]) => {
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
          />
        </Grid>
      </Grid>
    </Box>
  );
}

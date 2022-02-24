import { Box, Grid } from "@material-ui/core";
import React from "react";
import { KendoPresenterProps } from "./interfaces";
import { KendoGrid } from "./KendoGrid";


export function DocumentListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
}: KendoPresenterProps) {
  return (
    <Box m={2}>
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <KendoGrid
            tableName={tableName}
            tableCriteria={tableCriteria}
            schema={schema}
            columns={columns}
            statuses={statuses}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

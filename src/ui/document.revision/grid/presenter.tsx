import { Grid } from "@material-ui/core";
import React from "react";
import { KendoPresenterProps } from "./interfaces";
import { KendoPanel } from "./KendoPanel";


export function DocumentListPresenter({ statuses, tableName, tableCriteria, schema, columns }: KendoPresenterProps) {
  // console.log("debug :: DocumentListPresenter");
  // console.log("debug :: DocumentListPresenter :: statuses :: ", statuses);
  console.log("debug :: DocumentListPresenter :: tableName :: ", tableName);
  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <KendoPanel
          tableName={tableName}
          tableCriteria={tableCriteria}
          schema={schema}
          columns={columns}
          statuses={statuses}
        />
      </Grid>
    </Grid>
  ); }

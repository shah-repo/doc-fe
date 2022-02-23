import { Grid } from "@material-ui/core";
import React from "react";
import { KendoPanel } from "./KendoPanel";

const DocumentListPresenter: React.FunctionComponent = () => {
  console.log("debug :: DocumentListPresenter");
  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <KendoPanel />
      </Grid>
    </Grid>
  ); };

export default DocumentListPresenter;

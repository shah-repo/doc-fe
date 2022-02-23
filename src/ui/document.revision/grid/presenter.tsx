import { Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { KendoPanel } from "./KendoPanel";

interface Props {
  statuses: DocumentRevisionStatus | DocumentRevisionStatus[];
  tableName: string;
}
const DocumentListPresenter: React.FunctionComponent<Props> = (statuses, tableName) => {
  console.log("debug :: DocumentListPresenter");
  console.log("debug :: DocumentListPresenter :: statuses :: ", statuses);
  console.log("debug :: DocumentListPresenter :: tableName :: ", tableName);
  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <KendoPanel />
      </Grid>
    </Grid>
  ); };

export default DocumentListPresenter;

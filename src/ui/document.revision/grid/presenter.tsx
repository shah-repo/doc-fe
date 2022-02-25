import { Box, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import Colors from "../../layout/theme/utils/colors";
import { documentRevisionQueryStatus } from "../utils/helpers";
import CreateButton from "./CreateButton/presenter";
import ExportButton from "./ExportButton/presenter";
import GridTitle from "./GridTitle/presenter";
import { KendoPresenterProps } from "./interfaces";
import { KendoGrid } from "./KendoGrid";

export function DocumentListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
  queryUrl,
}: KendoPresenterProps) {
  const [dataToBeExported, setDataToBeExported] = useState<DocumentRevision[]>([]);
  const handleExportData = (dataToBeExported: DocumentRevision[]) => {
    setDataToBeExported(dataToBeExported);
  };
  return (
    <Box p={2} style={{ background: Colors.background_white }}>
      <Grid container={true}>
        <Grid item xs>
          <Box mb={2}>
            <Grid container={true} alignItems="center">
              <Grid item xs>
                <GridTitle translation="navigation.document.list" />
              </Grid>
              <Grid item={true}>
                <ExportButton columns={columns} gridData={dataToBeExported} />
                <CreateButton url={DOCUMENT_REVISION_CREATE_URL} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item={true} xs={12}>
          <KendoGrid<DocumentRevision>
            tableName={tableName}
            tableCriteria={tableCriteria}
            schema={schema}
            statuses={statuses}
            exportDataChanges={handleExportData}
            onRowClick={onRowClick}
            queryUrl={queryUrl}
            defaultPayloadData={{
              documentTypeWithoutCategory: "true",
              status: documentRevisionQueryStatus(),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

import { Box, Grid } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ExportButton from "../../document.revision/grid/ExportButton";
import GridTitle from "../../document.revision/grid/GridTitle";
import { KendoGrid } from "../../document.revision/grid/KendoGrid";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { KendoPresenterProps } from "./interfaces";


export function DocumentTypePresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  title,
  onRowClick,
  queryUrl,
  documentTypeCategory,
}: KendoPresenterProps) {
  const ref = useRef(tableName);
  useEffect(() => {
    ref.current = tableName;
  }, [tableName]);
  const [dataToBeExported, setDataToBeExported] = useState<DocumentRevision[]>([]);
  const handleExportData = (dataToBeExported: DocumentRevision[]) => {
    setDataToBeExported(dataToBeExported);
  };
  return (
    <Box m={2}>
      <Grid container={true}>
        <GridTitle title={title} />
        <Grid item={true}>
          <ExportButton columns={columns} gridData={dataToBeExported} />
        </Grid>
        <Grid item={true} xs={12}>
          {ref.current === tableName && <KendoGrid
            tableName={tableName}
            tableCriteria={tableCriteria}
            schema={schema}
            statuses={statuses}
            exportDataChanges={handleExportData}
            onRowClick={onRowClick}
            queryUrl={queryUrl}
            defaultPayloadData={{
              documentTypeCategory: "Record",
              status: documentRevisionQueryStatus(),
            }}
            documentTypeCategory={documentTypeCategory}
          />}
        </Grid>
      </Grid>
    </Box>
  );
}

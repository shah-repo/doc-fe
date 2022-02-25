import { Box, Grid } from "@material-ui/core";
import { map, startCase } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { CHANGE_REQUEST_ROOT_URL_SEARCH } from "../../../state/ducks/changeRequest/constants";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { KendoGrid } from "../../document.revision/grid/KendoGrid";
import Colors from "../../layout/theme/utils/colors";
import FromListContainer from "../form.list/FormList.container";
import { KendoPresenterProps } from "./interfaces";


export function DocumentListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
}: KendoPresenterProps) {
  const [dataToBeExported, setDataToBeExported] = useState<ChangeRequest[]>([]);
  const handleExportData = (dataToBeExported: ChangeRequest[]) => {
    setDataToBeExported(dataToBeExported);
  };
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const headers = map(columns, (column) => ({
    label: startCase(getTranslatedText(column.title)),
    key: column.field,
  }));
  return (
    <Box p={2} style={{ background: Colors.background_white }}>
      <Grid container={true}>
        <FromListContainer {...{ headers, tableData: dataToBeExported }} />
        <Grid item={true} xs={12}>
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
    </Box>
  );
}

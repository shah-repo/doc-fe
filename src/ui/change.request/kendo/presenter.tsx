import { Grid } from "@material-ui/core";
import { map, startCase } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { CHANGE_REQUEST_ROOT_URL_SEARCH } from "../../../state/ducks/changeRequest/constants";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { KendoGridCriteria } from "../../components/common/kendo/types";
import FromListContainer from "../form.list/FormList.container";
import gridConfiguration from "./column.definition";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface KendoGridProps {
  currentUserEmail: string;
  tableName: string;
  tableCriteria: KendoGridCriteria;
}

const KendoGridList: React.FunctionComponent<KendoGridProps> = ({
  currentUserEmail,
  tableName,
  tableCriteria,
}) => {
  const classes = KendoGridStyles();
  const [dataToBeExported, setDataToBeExported] = useState<ChangeRequest[]>([]);
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const headers = map(gridConfiguration.columns, (column) => ({
    label: startCase(getTranslatedText(column.title)),
    key: column.field,
  }));

  const handleExportData = (dataToBeExported: ChangeRequest[]) => {
    setDataToBeExported(dataToBeExported);
  };

  return (
    <Grid container={true} className={classes.root}>
      <FromListContainer {...{ headers, tableData: dataToBeExported }} />
      <Grid item={true} xs={12}>
        <KendoPanel<ChangeRequest>
          gridConfiguration={gridConfiguration}
          tableName={tableName}
          gridData={[]}
          tableCriteria={tableCriteria}
          queryUrl={CHANGE_REQUEST_ROOT_URL_SEARCH}
          currentUserEmail={currentUserEmail}
          exportDataChanges={handleExportData}
        />
      </Grid>
    </Grid>
  );
};

export default KendoGridList;

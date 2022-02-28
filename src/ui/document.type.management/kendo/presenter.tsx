import { Box } from "@material-ui/core";
import React from "react";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType/types";
import { KendoGridConfiguration } from "../../components/common/kendo/types";
import { TablePanelStateProps } from "../../components/table/types";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface DTMProps {
  gridData: DocumentType[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  gridConfiguration: KendoGridConfiguration;
}

export const DocumentTypeManagementPresenter: React.FunctionComponent<DTMProps> = ({
  gridData,
  tableName,
  tableCriteria,
  gridConfiguration,
}) => {
  const classes = KendoGridStyles();
  return (
    <Box className={classes.root}>
      <KendoPanel
        gridData={gridData}
        gridConfiguration={gridConfiguration}
        tableName={tableName}
        tableCriteria={tableCriteria}
      />
    </Box>

  ); };

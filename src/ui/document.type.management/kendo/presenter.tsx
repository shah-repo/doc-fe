import { Box } from "@material-ui/core";
import React from "react";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType/types";
import { KendoGridConfiguration } from "../../components/common/kendo/types";
import { TablePanelStateProps } from "../../components/table/types";
import Colors from "../../layout/theme/utils/colors";
import { KendoPanel } from "./KendoPanel";

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
}) => (
  <Box p={2} style={{ background: Colors.background_white }}>
    <KendoPanel
      gridData={gridData}
      gridConfiguration={gridConfiguration}
      tableName={tableName}
      tableCriteria={tableCriteria}
    />
  </Box>

);

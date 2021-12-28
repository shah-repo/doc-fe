import React from "react";
import { KendoGridConfiguration } from "../../components/common/kendo/types";
import { TablePanelStateProps } from "../../components/table/types";
import { KendoGrid } from "./KendoPanel";

interface DTMProps {
  gridData: any;
  tableName: string;
  tableCriteria?: TablePanelStateProps;
  gridConfiguration: KendoGridConfiguration;
}

export const DocumentTypeManagementPresenter: React.FunctionComponent<DTMProps> = ({
  gridData,
  tableName,
  tableCriteria = {},
  gridConfiguration,
}) => (
  <KendoGrid
    gridData={gridData}
    gridConfiguration={gridConfiguration}
    tableName={tableName}
    tableCriteria={tableCriteria as any}
  />
);

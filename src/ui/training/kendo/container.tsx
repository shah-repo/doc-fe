import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  getTableCriteria,
  getTableData,
} from "../../../common/utils/selectors";
import gridConfiguration from "./column.definition";
import KendoGridList from "./presenter";

type Props = RouteComponentProps;

const KendoContainer: React.FunctionComponent<Props> = () => {
  const TABLE_NAME = "training";
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  return (
    <KendoGridList
      tableName={TABLE_NAME}
      columns={gridConfiguration}
      data={tableData}
      tableCriteria={tableCriteria}
    />
  );
};

export default KendoContainer;

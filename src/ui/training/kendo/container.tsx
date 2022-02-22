import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  getTableCriteria,
} from "../../../common/utils/selectors";
import gridConfiguration from "./column.definition";
import KendoGridList from "./presenter";

type Props = RouteComponentProps;

const KendoContainer: React.FunctionComponent<Props> = () => {
  const TABLE_NAME = "training";
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  return (
    <KendoGridList
      tableName={TABLE_NAME}
      columns={gridConfiguration}
      tableCriteria={tableCriteria}
    />
  );
};

export default KendoContainer;

import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  getTableCriteria,
} from "../../../common/utils/selectors";
import authSelectors from "../../../state/ducks/auth/selectors";
import KendoGridList from "./presenter";

export const CR_TABLE_NAME = "changeRequests";
const KendoContainer: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const tableCriteria = useSelector(getTableCriteria(CR_TABLE_NAME));

  return (
    <KendoGridList
      currentUserEmail={currentUserEmail}
      tableName={CR_TABLE_NAME}
      tableCriteria={tableCriteria}
    />
  );
};

export default KendoContainer;

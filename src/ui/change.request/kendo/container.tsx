import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  getTableCriteria,
  getTableData,
} from "../../../common/utils/selectors";
import authSelectors from "../../../state/ducks/auth/selectors";
import {
  changeRequestEditPath,
  changeRequestPreviewPath,
} from "../utils/paths";
import KendoGridList from "./presenter";

type OwnProps = RouteComponentProps;
type Props = OwnProps;

export const CR_TABLE_NAME = "changeRequests";
const KendoContainer: React.FunctionComponent<Props> = ({ history }) => {
  const edit = (changeRequestId: string) =>
    history.push(changeRequestEditPath(changeRequestId));
  const preview = (changeRequestId: string) =>
    history.push(changeRequestPreviewPath(changeRequestId));
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const tableCriteria = useSelector(getTableCriteria(CR_TABLE_NAME));
  const data = useSelector(getTableData(CR_TABLE_NAME));

  return (
    <KendoGridList
      currentUserEmail={currentUserEmail}
      editChangeRequest={edit}
      previewChangeRequest={preview}
      tableName={CR_TABLE_NAME}
      tableCriteria={tableCriteria}
      data={data}
    />
  );
};

export default KendoContainer;

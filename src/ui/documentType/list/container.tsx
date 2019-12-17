import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableState } from "../../../common/utils/selectors";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { ApplicationState } from "../../../state/reducers";
import { HOME_URL } from "../../constants/urls";
import { RouteParams } from "../utils/types";
import DocumentByTypeListPresenter from "./presenter";

type Props = RouteComponentProps<RouteParams>;

export const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match,
}) => {
  const { acronym } = match.params;
  const documentType = useSelector(
    (state: ApplicationState) =>
      documentTypeSelectors.getDocumentTypeByAcronym(state, acronym),
  );
  const TABLE_NAME = `documentsByTypeList-${acronym}`;
  const dispatch = useDispatch();
  const tableState = useSelector(getTableState(TABLE_NAME));

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  if (!documentType || !documentType.pageDetails) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <DocumentByTypeListPresenter
      tableName={TABLE_NAME}
      tableState={tableState}
      clearFilter={clearFilter}
      documentType={documentType}
    />
  );
};

export default DocumentByTypeListContainer;

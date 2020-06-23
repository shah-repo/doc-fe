import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { authSelectors } from "../../../state/ducks/auth";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { HOME_URL } from "../../constants/urls";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { RouteParams } from "../utils/types";
import DocumentByTypeListPresenter from "./presenter";

type Props = RouteComponentProps<RouteParams>;

export const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match, history,
}) => {
  const { docTypeId } = match.params;
  const documentType = useSelector(documentTypeSelectors.byId)?.[docTypeId];
  const currentUsersName = useSelector(authSelectors.currentUserName);
  const TABLE_NAME = `documentsByTypeList-${documentType?.documentTypeAcronym}`;
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict) || documentType.group === "PO") {
      const owner = documentType.group === "PO" ? currentUsersName : undefined;
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              "status[]": documentRevisionQueryStatus(),
              owner,
            },
          },
          TABLE_NAME,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docTypeId]);

  useEffect(() => {
    dispatch(documentRevisionsActions.loadList());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  if (!documentType || !documentType.pageDetails) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <div style={{ height: "100%" }}>
      <DocumentByTypeListPresenter
        tableName={TABLE_NAME}
        tableCriteria={tableCriteria}
        tableData={tableData}
        clearFilter={clearFilter}
        documentType={documentType}
      />
    </div>
  );
};

export default DocumentByTypeListContainer;

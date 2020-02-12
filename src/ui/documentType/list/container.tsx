import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { documentTypeActions, DocumentTypeById, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { ApplicationState } from "../../../state/reducers";
import { HOME_URL } from "../../constants/urls";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { RouteParams } from "../utils/types";
import DocumentByTypeListPresenter from "./presenter";

type Props = RouteComponentProps<RouteParams>;

export const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match,
}) => {
  const { acronym } = match.params;
  const [enableRedirect, toggleEnableRedirect] = React.useState(false);
  const [showError, toggleShowError] = React.useState(false);
  const documentType = useSelector(
    (state: ApplicationState) =>
      documentTypeSelectors.getDocumentTypeByAcronym(state, acronym),
  );
  const TABLE_NAME = `documentsByTypeList-${acronym}`;
  const dispatch = useDispatch();
  const isSingleId = useSelector(documentTypeSelectors.isSingleDocRevId) ;
  const docRevId = useSelector(documentTypeSelectors.docRevTypeById);
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const docId = useSelector(documentTypeSelectors.docId);

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict)) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              "status[]": documentRevisionQueryStatus(),
            },
          },
          TABLE_NAME,
        ),
      );
    }
  }, [acronym]);

  const async = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (isSingleId) {
        toggleEnableRedirect(true);
        return;
      }
      toggleShowError(true);
      setTimeout(() => toggleShowError(false), 1000 );
    },
  });

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  if (!documentType || !documentType.pageDetails) {
    return <Redirect to={HOME_URL} />;
  }

  const openDocRev = () => {
    async.start(getDocRevByIds, documentType.id, async);
  };

  return (
    <div style={{height: "100%"}}>
      {enableRedirect &&
      <Redirect to={{ pathname: `/document_revision/${docId}/output_document/${docRevId}` }} />}
      <DocumentByTypeListPresenter
        tableName={TABLE_NAME}
        tableCriteria={tableCriteria}
        tableData={tableData}
        clearFilter={clearFilter}
        documentType={documentType}
        openDocRev={openDocRev}
        showError={showError}
      />
    </div>
  );
};

export default DocumentByTypeListContainer;

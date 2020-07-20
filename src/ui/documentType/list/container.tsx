import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { authSelectors } from "../../../state/ducks/auth";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { documentTypeSelectors, PageDetailsColumn } from "../../../state/ducks/documentRevisions/documentType";
import { pageDetailsActions } from "../../../state/ducks/pageDetails";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { TableColumnProps } from "../../components/table/column/types";
import { DOCUMENT_BY_CATEGORY_LIST_URL, HOME_URL } from "../../constants/urls";
import { canEditDocumentRevision, documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { documentEditPath, documentPreviewPath } from "../../document.revision/utils/paths";
import { RouteParams } from "../utils/types";
import { columnSearchConfiguration, getStaticColumns } from "./helpers";
import DocumentByTypeListPresenter from "./presenter";

type Props = RouteComponentProps<RouteParams>;

export const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match,
}) => {
  const dispatch = useDispatch();
  const { documentCategory, docTypeId } = match.params;
  const currentUsersName = useSelector(authSelectors.currentUserName);
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);

  /** If true, documents are filtered by category. If false, documents are filtered by type. */
  const isByCategory = match.path.includes(DOCUMENT_BY_CATEGORY_LIST_URL);

  const documentType = useSelector(documentTypeSelectors.byId)?.[docTypeId];
  const categoryExists = useSelector(documentRevisionsSelectors.categoryExists);
  const categoryColumns = useSelector(documentRevisionsSelectors.getCategoryColumns);
  const categoryButtonLabel = useSelector(documentRevisionsSelectors.getCategoryButtonLabel);

  const TABLE_NAME = isByCategory
    ? `documentsByCategoryList-${documentCategory}`
    : `documentsByTypeList-${documentType?.documentTypeAcronym}`;

  const queryUrl = DOCUMENT_REVISION_ROOT_URL + (isByCategory
    ? `?documentTypeCategory=${documentCategory}`
    : `?documentTypeId=${documentType?.id}`);

  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));

  const isPO = documentType?.group === "PO";

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict) || isPO) {
      const owner = isPO ? currentUsersName : undefined;
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
    if (isByCategory) {
      dispatch(pageDetailsActions.categoryPageDetails(documentCategory));
    }
    dispatch(documentRevisionsActions.loadList());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const pageDetailColumns = (isByCategory ? categoryColumns : documentType?.pageDetails?.columns) || [];

  const columns: TableColumnProps<DocumentRevision>[] = pageDetailColumns.map(
    (column: PageDetailsColumn) => {
      const [omitSearch, searchOptions] = columnSearchConfiguration(column.valuePath, tableCriteria);

      return {
        key: column.valuePath as keyof DocumentRevision,
        label: column.label,
        cellHref: cellHrefRenderer,
        omitSearch,
        columnOptions: {
          cellDataGetter: ({ rowData }) => rowData.column.valuePath,
        },
        searchOptions,
      };
    },
  );

  const staticColumns: TableColumnProps<DocumentRevision>[] = getStaticColumns(
    isByCategory,
    documentCategory,
    documentType,
    cellHrefRenderer,
    tableCriteria,
    canEdit,
  );

  if (!documentType && !categoryExists) {
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
        queryUrl={queryUrl}
        columns={columns.length ? columns : staticColumns}
        isByCategory={isByCategory}
        documentCategory={documentCategory}
        categoryButtonLabel={categoryButtonLabel}
      />
    </div>
  );
};

export default DocumentByTypeListContainer;

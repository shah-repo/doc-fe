import { get, isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { authSelectors } from "../../../state/ducks/auth";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { documentTypeSelectors, PageDetailsColumn } from "../../../state/ducks/documentRevisions/documentType";
import { pageDetailsSelectors } from "../../../state/ducks/pageDetails";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import Date from "../../components/Date";
import { TableColumnProps } from "../../components/table/column/types";
import { DOCUMENT_BY_CATEGORY_LIST_URL, HOME_URL } from "../../constants/urls";
import { canEditDocumentRevision, documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { documentEditPath, documentPreviewPath } from "../../document.revision/utils/paths";
import { generateVersionNumber } from "../../documentRevision/helpers";
import { RouteParams } from "../utils/types";
import { columnSearchConfiguration, getStaticColumns } from "./helpers";
import DocumentByTypeListPresenter from "./presenter";

type Props = RouteComponentProps<RouteParams>;

const getFormattedRowValue = (value: string, path: any, rowData: any) => {
  const isDate = moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid();
  const versionNumber = generateVersionNumber(
    rowData.revision,
    rowData.revisionStage,
    rowData.subRevision,
    rowData.revisionChangeType,
  );
  const ifRevision = path.startsWith("precalc.revision") ? versionNumber : value;
  return isDate ? <Date value={value} /> : ifRevision;
};

export const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match,
}) => {
  const dispatch = useDispatch();
  const { categoryName, docTypeId } = match.params;
  const currentUsersName = useSelector(authSelectors.currentUserName);
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);

  /** If true, documents are filtered by category. If false, documents are filtered by type. */
  const isByCategory = match.path.includes(DOCUMENT_BY_CATEGORY_LIST_URL);

  const documentType = useSelector(documentTypeSelectors.byId)?.[docTypeId];
  const documentCategory = useSelector(pageDetailsSelectors.byCategory)?.[categoryName];

  const TABLE_NAME = isByCategory
    ? `documentsByCategoryList-${categoryName}`
    : `documentsByTypeList-${documentType?.documentTypeAcronym}`;

  const queryUrl = DOCUMENT_REVISION_ROOT_URL + (isByCategory
    ? `?documentTypeCategory=${categoryName}`
    : `?documentTypeId=${documentType?.id}`);

  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));

  const isPO = documentType?.group === "PO" || documentCategory?.category === "Purchase Order";

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

  if ((!isByCategory && !documentType) || (isByCategory && !documentCategory)) {
    return <Redirect to={HOME_URL} />;
  }

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const pageDetailColumns = (isByCategory ? documentCategory.columns : documentType?.pageDetails?.columns) || [];

  const columns: TableColumnProps<DocumentRevision>[] = pageDetailColumns.map(
    (column: PageDetailsColumn) => {
      const [omitSearch, searchOptions] = columnSearchConfiguration(column.valuePath, tableCriteria);
      return {
        key: column.valuePath as keyof DocumentRevision,
        // version is a hack need to insert inside configuration 20.19
        label: column.label === "Version" as string ? "common.revision" : column.label,
        cellHref: cellHrefRenderer,
        omitSearch,
        columnOptions: {
          cellDataGetter: ({ rowData }) => getFormattedRowValue(get(rowData, column.valuePath), column.valuePath, rowData),
        },
        searchOptions,
      };
    },
  );

  const staticColumns: TableColumnProps<DocumentRevision>[] = getStaticColumns(
    isByCategory,
    categoryName,
    documentType,
    cellHrefRenderer,
    tableCriteria,
    canEdit,
  );

  return (
    <div style={{ height: "100%" }}>
      <DocumentByTypeListPresenter
        tableName={TABLE_NAME}
        tableCriteria={tableCriteria}
        tableData={tableData}
        clearFilter={clearFilter}
        queryUrl={queryUrl}
        columns={columns.length ? columns : staticColumns}
        isByCategory={isByCategory}
        documentCategory={documentCategory}
        documentType={documentType}
      />
    </div>
  );
};

export default DocumentByTypeListContainer;

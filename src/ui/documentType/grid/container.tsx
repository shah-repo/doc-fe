import { GridRowClickEvent } from "@progress/kendo-react-grid";
import { each, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps, useHistory } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { companySelectors } from "../../../state/ducks/company";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { PageDetailsColumn } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { pageDetailsSelectors } from "../../../state/ducks/pageDetails";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { ApplicationState } from "../../../state/reducers";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import { KendoCellTemplates, KendoColumn } from "../../components/common/kendo/types";
import { DataStateProps, KendoGridFilterCell } from "../../components/KendoGrid/interfaces";
import { TableColumnProps } from "../../components/table/column/types";
import { DOCUMENT_BY_CATEGORY_LIST_URL, HOME_URL } from "../../constants/urls";
import { canEditDocumentRevision, documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { documentEditPath, documentPreviewPath } from "../../document.revision/utils/paths";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { isTranslation } from "../../translations/types";
import { RouteParams } from "../utils/types";
import { columnSearchConfiguration, getStaticColumns } from "./helpers";
import { DocumentTypePresenter } from "./presenter";

const DocumentByTypeListContainer: React.FunctionComponent<RouteComponentProps<RouteParams>> = ({
  match,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { categoryName, docTypeId } = match.params;
  const title = useSelector((state: ApplicationState) => companySelectors.getNavigationTitle(state, categoryName));
  const getStatusesAction = useActionCreator(documentRevisionsActions.getDocRevStatuses);
  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const async = useAsync({
    onSuccess: (response: DocumentRevisionStatus[] = []) => {
      saveStatuses(response);
    },
  });
  const getStatuses = () => async.start(getStatusesAction, async, documentRevisionQueryStatus(), [], categoryName);
  /** If true, documents are filtered by category. If false, documents are filtered by type. */
  const isByCategory = match.path.includes(DOCUMENT_BY_CATEGORY_LIST_URL);
  const documentType = useSelector(documentTypeSelectors.byId)?.[docTypeId];
  const documentCategory = useSelector(pageDetailsSelectors.byCategory)?.[categoryName];
  const TABLE_NAME = isByCategory
    ? `documentsByCategoryList-${categoryName}`
    : `documentsByTypeList-${documentType?.documentTypeAcronym}`;
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const intl = useIntl();

  if ((!isByCategory && !documentType) || (isByCategory && !documentCategory)) {
    return <Redirect to={HOME_URL} />;
  }
  // Remove once column value modified on BE
  each(documentCategory.columns, (col) => {
    const label = col?.label as string;
    if (col && label === "PO Status") {
      col.valuePath = "poStatus";
    }
  });
  const pageDetailColumns = (isByCategory ? documentCategory.columns : documentType?.pageDetails?.columns) || [];

  const columns: TableColumnProps<DocumentRevision>[] = pageDetailColumns
    .filter((c) => c.showOnWeb)
    .map(
      (column: PageDetailsColumn) => {
        const searchOptions = columnSearchConfiguration(column.valuePath, tableCriteria);
        return {
          key: column.valuePath as keyof DocumentRevision,
          // version is a hack need to insert inside configuration 20.19
          label: column.label === "Version" as string ? "common.revision" : column.label,
          searchOptions,
        };
      },
    );
  const staticColumns: TableColumnProps<DocumentRevision>[] = getStaticColumns(
    isByCategory,
    categoryName,
    documentType,
  );

  const columnDef = columns.length ? columns : staticColumns;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);


  const setSearchStatus = (
    dataState: DataStateProps,
    columns: KendoColumn[]
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState,
          },
          columnConfig: JSON.stringify(columns),
        },
        TABLE_NAME
      )
    );
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict)) {
      const dataState: DataStateProps = {
        filter: {
          logic: "and",
          filters: [],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(
        dataState,
        kendoColumnDef as KendoColumn[]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict, categoryName]);

  const ownerFieldsMapping = {
    "owner.user.name": ["owner.user.avatar", "owner.user.initialColor"],
  };
  const kendoColumnDef = columnDef.map((columnDetails, index) => {
    let filterCellTemplate: string | undefined;
    let dynamicCellTemplate: KendoCellTemplates;
    let dynamicCellGroupable = true;
    let upDateField = !columns.length ? columnDetails.searchOptions?.dataKey || columnDetails.key : columnDetails.key;
    if (columnDetails.searchOptions?.dateFilter) {
      filterCellTemplate = KendoGridFilterCell.RELEASED_AT;
      dynamicCellTemplate = KendoCellTemplates.DATE_INFO;
      dynamicCellGroupable = false;
    } else if (columnDetails.searchOptions?.ownerTemplate) {
      dynamicCellTemplate = KendoCellTemplates.USER_AVATAR;
    }  else if (columnDetails.searchOptions?.poStatusTemplate) {
      filterCellTemplate = KendoGridFilterCell.PO_STATUS;
      dynamicCellTemplate = KendoCellTemplates.STATUS;
    } else if (columnDetails.searchOptions?.statusTemplate) {
      filterCellTemplate = KendoGridFilterCell.DISPLAY_STATUS;
      dynamicCellTemplate = KendoCellTemplates.STATUS;
      upDateField = "displayStatus";
    } else {
      dynamicCellTemplate = KendoCellTemplates.COMMON_CELL;
    }
    const columnLabel = isTranslation(columnDetails.label)
      ? intl.formatMessage({ id: columnDetails.label })
      : columnDetails.label;

    return {
      field: upDateField,
      title: columnLabel,
      filter: "text",
      width: 15,
      groupable: dynamicCellGroupable,
      cell: dynamicCellTemplate,
      locked: false,
      show: true,
      showColumnMenu: true,
      filterCell: filterCellTemplate,
      key: { index },
      extraFields: ["id", "document.id", ...ownerFieldsMapping[upDateField] || []],
    };
  });
  const schema = getSchemaFromColumns(kendoColumnDef as KendoColumn[]);

  // check if document is editable or readonly
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  const onRowClick = ({ dataItem }: GridRowClickEvent) => {
    if (isEmpty(dataItem.id) || isEmpty(dataItem.document.id)) {
      return false;
    }
    let urlPath = documentPreviewPath(dataItem.id, dataItem.document.id);
    if (canEdit(dataItem)) {
      urlPath = documentEditPath(dataItem.id, dataItem.document.id);
    }
    history.push(urlPath);
  };
  return (
    <DocumentTypePresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      statuses={statuses}
      isByCategory={isByCategory}
      documentCategory={documentCategory}
      documentType={documentType}
      headerColumns={columnDef}
      columns={kendoColumnDef as KendoColumn[]}
      onRowClick={onRowClick}
      title={title}
      queryUrl={DOCUMENT_REVISION_SEARCH_ROOT_URL}
      documentTypeCategory={isByCategory ? categoryName : documentType?.documentTypeAcronym}
    />
  );
};

export default DocumentByTypeListContainer;

/* eslint-disable react-hooks/exhaustive-deps */
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { authSelectors } from "../../../state/ducks/auth";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { PageDetailsColumn } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { pageDetailsSelectors } from "../../../state/ducks/pageDetails";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { DisplayText, TranslatedText } from "../../components/common/kendo/helpers";
import { KendoCellTemplates } from "../../components/common/kendo/types";
import { TableColumnProps } from "../../components/table/column/types";
import { DOCUMENT_BY_CATEGORY_LIST_URL, HOME_URL } from "../../constants/urls";
import { documentRevisionEffectiveDateOption, documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { checkIsDocumentPO } from "../../documentRevision/helpers/checkDocumentGroup";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { isTranslation } from "../../translations/types";
import DocumentByTypeListPresenter from "../kendo/presenter";
import { RouteParams } from "../utils/types";
import { DateDropdownFilterCell } from "./filter.templates/DateDropdownFilter";
import { DropdownFilterCell } from "./filter.templates/DropdownFilter";
import { columnSearchConfiguration, getStaticColumns } from "./helpers";

type Props = RouteComponentProps<RouteParams>;

const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match,
}) => {
  const dispatch = useDispatch();
  const { categoryName, docTypeId } = match.params;
  const currentUsersName = useSelector(authSelectors.currentUserName);

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

  const docRevRootUrl = DOCUMENT_REVISION_ROOT_URL + (isByCategory
    ? `?documentTypeCategory=${categoryName}`
    : `?documentTypeId=${documentType?.id}`);

  const queryUrl = documentRevisionQueryStatus().reduce((acc, state) =>  acc + `status%5B%5D=${state}&`,
    `${docRevRootUrl}&`);

  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const providedData = useSelector(getTableData(TABLE_NAME));

  const isPO = checkIsDocumentPO(documentType?.groupOptions);
  const intl = useIntl();

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict) || isPO) {
      const owner = isPO ? currentUsersName : undefined;
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              owner,
            },
          },
          TABLE_NAME,
        ),
      );
    }
  }, [docTypeId]);

  useEffect(() => {
    getStatuses();
  }, [categoryName]);

  if ((!isByCategory && !documentType) || (isByCategory && !documentCategory)) {
    return <Redirect to={HOME_URL} />;
  }

  const clearFilter = () => dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  const pageDetailColumns = (isByCategory ? documentCategory.columns : documentType?.pageDetails?.columns) || [];

  const columns: TableColumnProps<DocumentRevision>[] = pageDetailColumns
    .filter((c) => c.showOnWeb)
    .map(
      (column: PageDetailsColumn) => {
        const searchOptions = columnSearchConfiguration(column.valuePath, tableCriteria, statuses);
        return {
          key: column.valuePath as keyof DocumentRevision,
          // version is a hack need to insert inside configuration 20.19
          label: column.label === "Version" as string ? "common.revision" : column.label,
          searchOptions,
        }; },
    );
  const staticColumns: TableColumnProps<DocumentRevision>[] = getStaticColumns(
    isByCategory,
    categoryName,
    documentType,
  );

  const columnDef = columns.length ? columns : staticColumns;

  const DisplayStatusFilterCell: any = (props: GridFilterCellProps) => (
    <DropdownFilterCell
      {...props}
      data={statuses}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.SELECT_STATE],
      })}
    />
  );
  const RealeaseDateFilterCell = (props: any) => (
    <DateDropdownFilterCell
      {...props}
      data={documentRevisionEffectiveDateOption()}
      defaultItem={{
        text: intl.formatMessage({ id: TranslatedText[DisplayText.NONE] }),
        value: "none",
      }}
      operator={"gt"}
    />
  );

  const kendoColumnDef = columnDef.map((columnDetails, index) => {
    let filterCellTemplate;
    let dynamicCellTemplate;
    let formatField;

    let upDateField = !columns.length ? columnDetails.searchOptions?.dataKey || columnDetails.key :  columnDetails.key;

    if (columnDetails.searchOptions?.dateFilter) {
      filterCellTemplate = RealeaseDateFilterCell;
      dynamicCellTemplate = KendoCellTemplates.DATE_INFO;
    } else if (columnDetails.searchOptions?.ownerTemplate) {
      dynamicCellTemplate = KendoCellTemplates.USER_AVATAR;
    } else if (columnDetails.searchOptions?.statusTemplate) {
      filterCellTemplate = DisplayStatusFilterCell;
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
      groupable: true,
      cell: dynamicCellTemplate,
      locked: false,
      show: true,
      showColumnMenu: true,
      format: formatField,
      filterCell: filterCellTemplate,
      key: { index },
    };
  });
  return (
    <div>
      <DocumentByTypeListPresenter
        tableName={TABLE_NAME}
        dynamicColumns={kendoColumnDef}
        tableCriteria={tableCriteria}
        providedData={providedData}
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

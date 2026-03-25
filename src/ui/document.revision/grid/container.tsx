import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { intl } from '../../../common/intl';
import { getTableCriteria } from '../../../common/utils/selectors';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from '../../../state/ducks/documentRevisions/constants';
import { CATEGORY, DOC_TYPE_GROUP_OPTION, PageDetailsColumn } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { pageDetailsSelectors } from '../../../state/ducks/pageDetails';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { getSchemaFromColumns } from '../../common/utils/helpers';
import { DataStateProps } from '../../components/KendoGrid/interfaces';
import { OverflowCell } from '../../components/common/kendo.column.templates/OverflowCell';
import { KendoColumn } from '../../components/common/kendo/types';
import { TableColumnProps } from '../../components/table/column/types';
import { ownerFieldsMapping } from '../../documentType/grid/constants';
import { columnSearchConfiguration } from '../../documentType/grid/helpers';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { isTranslation } from '../../translations/types';
import { canEditDocumentRevision, documentRevisionQueryStatus } from '../utils/helpers';
import { documentEditPath, documentPreviewPath } from '../utils/paths';
import { predefinedColumnDetails } from './column.definition';
import { DocumentListPresenter } from './presenter';

const TABLE_NAME = 'documentRevisions';

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const notGroupOptions = [
    DOC_TYPE_GROUP_OPTION.RECORD,
    DOC_TYPE_GROUP_OPTION.PO,
    DOC_TYPE_GROUP_OPTION.GROUP_TRAINING,
    DOC_TYPE_GROUP_OPTION.WORK_ORDER,
  ];
  const notInCategory = CATEGORY.WORKORDER_CATEGORY;
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const history = useHistory();

  const docListCategory = useSelector(pageDetailsSelectors.byCategory)?.['Document List'];
  const columns: Array<TableColumnProps<DocumentRevision>> = docListCategory?.columns
    ?.filter((c) => c.showOnWeb)
    ?.map(
      (column: PageDetailsColumn) => {
        const searchOptions = columnSearchConfiguration(column.valuePath, tableCriteria);
        return {
          key: column.valuePath as keyof DocumentRevision,
          label: column.label,
          searchOptions,
        };
      },
    );

  const kendoColumnDef = columns?.map((columnDetails, index) => {
    const columnLabel = isTranslation(columnDetails.label)
      ? intl.formatMessage({ id: columnDetails.label })
      : columnDetails.label;

    const columnDef = {
      field: columnDetails.key,
      title: columnLabel,
      show: true,
      showColumnMenu: true,
      key: { index },
      extraFields: ['id', ...ownerFieldsMapping[columnDetails.key] || []],
      width: 8,
    };

    return predefinedColumnDetails[columnDetails.key]
      ? { ...columnDef, ...predefinedColumnDetails[columnDetails.key] }
      : { ...columnDef, cell: OverflowCell, showTooltip: true, tooltipField: columnDetails.key };
  });
  const schema = getSchemaFromColumns(kendoColumnDef as KendoColumn[]);

  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const async = useAsync({
    onSuccess: (response: DocumentRevisionStatus[] = []) => {
      saveStatuses(response);
    },
  });
  const getStatusesAction = useActionCreator(
    documentRevisionsActions.getDocRevStatuses,
  );
  const getStatuses = () =>
    async.start(
      getStatusesAction,
      async,
      documentRevisionQueryStatus(),
      notGroupOptions,
      undefined,
      notInCategory,
    );

  useEffect(() => {
    getStatuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSearchStatus = (
    dataState: DataStateProps,
    columns: KendoColumn[],
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          apiError: '',
          queryDict: {
            dataState,
          },
          columnConfig: JSON.stringify(columns),
        },
        TABLE_NAME,
      ),
    );
  };

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict) && kendoColumnDef?.length) {
      const dataState: DataStateProps = {
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'displayStatus',
              operator: 'eq',
              value: 'Released' as DocumentRevisionStatus,
            },
          ],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(
        dataState,
        kendoColumnDef as KendoColumn[],
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  const onRowClick = (rowData: { dataItem: DocumentRevision }) => {
    if (isEmpty(rowData.dataItem.id) || isEmpty(rowData.dataItem.document.id)) {
      return false;
    }
    if (canEditDocumentRevision(rowData.dataItem)) {
      history.push(documentEditPath(rowData.dataItem.id, rowData.dataItem.document.id));
    }
    history.push(documentPreviewPath(rowData.dataItem.id, rowData.dataItem.document.id));
  };

  return (
    <DocumentListPresenter
      statuses={statuses}
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={kendoColumnDef as KendoColumn[]}
      onRowClick={onRowClick}
      queryUrl={DOCUMENT_REVISION_SEARCH_ROOT_URL}
    />
  );
};

export default DocumentListContainer;

import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getTableCriteria } from '../../../common/utils/selectors';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from '../../../state/ducks/documentRevisions/constants';
import { CATEGORY, DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { getSchemaFromColumns } from '../../common/utils/helpers';
import { KendoColumn } from '../../components/common/kendo/types';
import { DataStateProps } from '../../components/KendoGrid/interfaces';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { canEditDocumentRevision, documentRevisionQueryStatus } from '../utils/helpers';
import { documentEditPath, documentPreviewPath } from '../utils/paths';
import gridConfiguration from './column.definition';
import { DocumentListPresenter } from './presenter';

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const TABLE_NAME = 'documentRevisions';
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const dispatch = useDispatch();
  const notGroupOptions = [DOC_TYPE_GROUP_OPTION.RECORD, DOC_TYPE_GROUP_OPTION.PO];
  const notIncategory = CATEGORY.WORKORDER_CATEGORY;
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const history = useHistory();

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
      notIncategory,
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
    if (isEmpty(tableCriteria.queryDict)) {
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
        gridConfiguration.columns,
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
      columns={gridConfiguration.columns}
      onRowClick={onRowClick}
      queryUrl={DOCUMENT_REVISION_SEARCH_ROOT_URL}
    />
  );
};

export default DocumentListContainer;

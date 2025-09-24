import { GridRowClickEvent } from '@progress/kendo-react-grid';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { intl } from '../../../common/intl';
import { getTableCriteria } from '../../../common/utils/selectors';
import { authSelectors } from '../../../state/ducks/auth';
import { ChangeRequest, ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { PageDetailsColumn } from '../../../state/ducks/documentRevisions/documentType/types';
import { pageDetailsSelectors } from '../../../state/ducks/pageDetails';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { getSchemaFromColumns } from '../../common/utils/helpers';
import { DataStateProps } from '../../components/KendoGrid/interfaces';
import { KendoColumn } from '../../components/common/kendo/types';
import { TableColumnProps } from '../../components/table/column/types';
import { ownerFieldsMapping } from '../../documentType/grid/constants';
import { columnSearchConfiguration } from '../../documentType/grid/helpers';
import { isTranslation } from '../../translations/types';
import { canEditChangeRequest } from '../helpers';
import { changeRequestEditPath, changeRequestPreviewPath } from '../utils/paths';
import gridConfiguration from './column.definition';
import { DocumentListPresenter } from './presenter';

export const CR_TABLE_NAME = 'changeRequests';
const predefinedColumnWidths: {[key: string]: number} = {
  crId: 10,
  title: 40,
  'owner.user.name': 30,
  state: 20,
};

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(CR_TABLE_NAME));
  const history = useHistory();
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const arCategory = useSelector(pageDetailsSelectors.byCategory)?.['Change Request'];

  const columns: Array<TableColumnProps<ChangeRequest>> = arCategory.columns
    .filter((c) => c.showOnWeb)
    .map(
      (column: PageDetailsColumn) => {
        const searchOptions = columnSearchConfiguration(column.valuePath, tableCriteria);
        return {
          key: column.valuePath as keyof ChangeRequest,
          label: column.label,
          searchOptions,
        };
      },
    );

  const kendoColumnDef = columns.map((columnDetails, index) => {
    const columnLabel = isTranslation(columnDetails.label)
      ? intl.formatMessage({ id: columnDetails.label })
      : columnDetails.label;

    const dynamicCellGroupable = ['owner', 'state'].includes(columnDetails.searchOptions?.dataKey ?? '');

    return {
      field: columnDetails.key,
      title: columnLabel,
      filter: 'text',
      width: predefinedColumnWidths[columnDetails.key] ?? 15,
      groupable: dynamicCellGroupable,
      locked: true,
      show: true,
      showColumnMenu: true,
      key: { index },
      extraFields: ['id', ...ownerFieldsMapping[columnDetails.key] || []],
    };
  });
  const schema = getSchemaFromColumns(kendoColumnDef as KendoColumn[]);

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
          columnConfig: JSON.stringify(gridConfiguration.columns),
        },
        CR_TABLE_NAME,
      ),
    );
  };

  useEffect(() => {
    if (
      isEmpty(tableCriteria?.queryDict?.dataState?.filter?.filters)
      && isEmpty(tableCriteria?.queryDict?.dataState?.sort)
      && isEmpty(tableCriteria?.queryDict?.dataState?.group)
      && !tableCriteria?.hasClearedDefaultFilters
    ) {
      const dataState: DataStateProps = {
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'state',
              operator: 'eq',
              value: ChangeRequestStatus.InReview,
            },
          ],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(dataState, gridConfiguration.columns);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRowClick = ({ dataItem }: GridRowClickEvent) => {
    if (isEmpty(dataItem.id)) {
      return false;
    }
    let urlPath = changeRequestPreviewPath(dataItem.id);
    if (canEditChangeRequest(dataItem, currentEmployeeId)) {
      urlPath = changeRequestEditPath(dataItem.id);
    }
    history.push({ pathname: urlPath });
  };

  return (
    <DocumentListPresenter
      tableName={CR_TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={gridConfiguration.columns}
      onRowClick={onRowClick}
    />
  );
};

export default DocumentListContainer;

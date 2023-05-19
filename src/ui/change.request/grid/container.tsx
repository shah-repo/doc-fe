import { GridRowClickEvent } from '@progress/kendo-react-grid';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getTableCriteria } from '../../../common/utils/selectors';
import { authSelectors } from '../../../state/ducks/auth';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { getSchemaFromColumns } from '../../common/utils/helpers';
import { KendoColumn } from '../../components/common/kendo/types';
import { DataStateProps } from '../../components/KendoGrid/interfaces';
import { canEditChangeRequest } from '../utils/helpers';
import { changeRequestEditPath, changeRequestPreviewPath } from '../utils/paths';
import gridConfiguration from './column.definition';
import { DocumentListPresenter } from './presenter';

export const CR_TABLE_NAME = 'changeRequests';

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(CR_TABLE_NAME));
  const history = useHistory();
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);

  const setSearchStatus = (
    dataState: DataStateProps,
    columns: KendoColumn[]
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
        CR_TABLE_NAME
      )
    );
  };

  useEffect(() => {
    if (
      isEmpty(tableCriteria?.queryDict?.dataState?.filter?.filters) &&
      isEmpty(tableCriteria?.queryDict?.dataState?.sort) &&
      isEmpty(tableCriteria?.queryDict?.dataState?.group)
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
    if (canEditChangeRequest({ dataProp: dataItem, currentUserEmail })) {
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

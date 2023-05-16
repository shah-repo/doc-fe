import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getTableCriteria } from '../../../common/utils/selectors';
import { AsyncTaskActions } from '../../../state/ducks/async.tasks';
import { ASYNC_TASK_SEARCH } from '../../../state/ducks/async.tasks/constants';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import {
  EffectiveDateFormValues, PasswordFormValues,
} from '../../change.request/form/types';
import { getSchemaFromColumns } from '../../common/utils/helpers';
import { KendoColumn } from '../../components/common/kendo/types';
import { DataStateProps } from '../../components/KendoGrid/interfaces';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import { SQS_TYPES, TimeTravelProps } from '../types';
import gridConfiguration from './column.definition';
import { AsyncTasksPresenter } from './presenter';

const AsyncTasksContainer: React.FunctionComponent<
  RouteComponentProps
> = () => {
  const TABLE_NAME = 'asyncType';
  const intl = useIntl();
  const transitionDialog = useDialog();
  const [type, setType] = React.useState('');
  const [payload, setPayload] = React.useState('');
  const [loadTable, setLoadTable] = React.useState(false);
  const executeAsyncTask = useActionCreator(AsyncTaskActions.executeAsyncTask);
  const executeSessionTimeTravelAsyncTask = useActionCreator(AsyncTaskActions.executeSessionTimeTravelAsyncTask);
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  const setSearchStatus = (
    dataState: DataStateProps,
    columns: KendoColumn[],
    forceUpdate
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          forceUpdate,
          apiError: '',
          queryDict: {
            dataState,
          },
          columnConfig: JSON.stringify(columns),
        },
        TABLE_NAME
      )
    );
  };

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict) || loadTable) {
      const dataState: DataStateProps = {
        filter: {
          logic: 'and',
          filters: [],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(dataState, gridConfiguration.columns, loadTable);
      setLoadTable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict, loadTable]);

  const onRowClick = () => void 0;
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };
  const async = useAsync({
    onSuccess: () => {
      closeApproveDialog();
      setType('');
      setLoadTable(true);
    },
    onError: () => {
      closeApproveDialog();
      toastError(intl.formatMessage({ id: 'common.sqs.task.failed' }));
    },
  });
  const openApproveDialog = () => {
    transitionDialog.open();
  };
  const closeApproveDialog = () => {
    transitionDialog.close();
  };
  const handleEmptyFormSubmit = () => {
    setPayload(JSON.stringify({
      password: '',
      taskType: type,
    }));
    openApproveDialog();
  };
  const handleDateFormSubmit = (selectedDate: string) => {
    if ([SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS].includes(SQS_TYPES[type])) {
      setPayload(JSON.stringify({
        taskType: type,
        currentDate: selectedDate,
      }));
    }
    else if ([SQS_TYPES.SEND_PASSWORD_EXPIRATION_EMAILS].includes(SQS_TYPES[type])) {
      setPayload(JSON.stringify({
        taskType: type,
        processedAtTimestamp: selectedDate,
      }));
    }
    else {
      setPayload(JSON.stringify({
        taskType: type,
        timestamp: selectedDate,
      }));
    }
    openApproveDialog();
  };
  const handlePasswordExpirationFormSubmit = (data: any) => {
    setPayload(JSON.stringify({
      taskType: type,
      passwordUpdatedAt: data?.passwordUpdatedAt,
      passwordLastEmailSentAt: data?.passwordLastEmailSentAt,
      userEmails: data?.userEmails ? data.userEmails.split(',') : [],
    }));
    openApproveDialog();
  };
  const handlePasswordExpirationEmailSpecificFormSubmit = (data: any) => {
    setPayload(JSON.stringify({
      taskType: type,
      processedAtTimestamp: data?.processedAtTimestamp,
      userEmails: data?.userEmails ? data.userEmails.split(',') : [],
    }));
    openApproveDialog();
  };
  const handleuuidFormSubmit = (uuid: string) => {
    setPayload(JSON.stringify( [SQS_TYPES.RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE].includes(SQS_TYPES[type]) ? {
      taskType: type,
      docRevId: uuid,
    } : {
      taskType: type,
      pageDetailsId: uuid,
    }));
    openApproveDialog();
  };
  const handleEmailFormSubmit = (email: string) => {
    setPayload(JSON.stringify( {
      taskType: type,
      email,
    }));
    openApproveDialog();
  };
  const handleTimeTravelFormSubmit = (values: TimeTravelProps) => {
    if ([SQS_TYPES.TIME_TRAVEL_USER_SESSION].includes(SQS_TYPES[type])) {
      setPayload(JSON.stringify(values));
    }
    openApproveDialog();
  };
  const handleTimeTravelCompany = (values: TimeTravelProps) => {
    if ([SQS_TYPES.TIME_TRAVEL_COMPANY].includes(SQS_TYPES[type])) {
      setPayload(
        JSON.stringify({
          taskType: type,
          timeTravel: values,
        })
      );
    }
    openApproveDialog();
  };
  const handleTimeTravelUser = (values: TimeTravelProps) => {
    if ([SQS_TYPES.TIME_TRAVEL_USER].includes(SQS_TYPES[type])) {
      setPayload(
        JSON.stringify({
          taskType: type,
          timeTravel: values,
        })
      );
    }
    openApproveDialog();
  };
  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    const updatedPayload = JSON.parse(payload);
    if ([SQS_TYPES.TIME_TRAVEL_USER_SESSION].includes(SQS_TYPES[type])) {
      async.start(
        executeSessionTimeTravelAsyncTask,
        { ...updatedPayload, ...values },
        async
      );
    } else {
      async.start(executeAsyncTask, { ...updatedPayload, ...values }, async);
    }
  };

  return (
    <AsyncTasksPresenter
      tableName={TABLE_NAME}
      tableCriteria={tableCriteria}
      schema={schema}
      columns={gridConfiguration.columns}
      queryUrl={ASYNC_TASK_SEARCH}
      onRowClick={onRowClick}
      type={type}
      async={async}
      transitionDialog={transitionDialog}
      handleChange={handleChange}
      handleEmptyFormSubmit={handleEmptyFormSubmit}
      handleDateFormSubmit={handleDateFormSubmit}
      handlePasswordExpirationFormSubmit={handlePasswordExpirationFormSubmit}
      handlePasswordExpirationEmailSpecificFormSubmit={handlePasswordExpirationEmailSpecificFormSubmit}
      handleuuidFormSubmit={handleuuidFormSubmit}
      handleEmailFormSubmit={handleEmailFormSubmit}
      handleTimeTravelFormSubmit={handleTimeTravelFormSubmit}
      handleTimeTravelCompany={handleTimeTravelCompany}
      handleTimeTravelUser={handleTimeTravelUser}
      onSubmit={onSubmit}
    />
  );
};

export default AsyncTasksContainer;

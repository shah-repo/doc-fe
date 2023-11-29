import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { Attachment } from '../../../../../state/ducks/attachments/types';
import { ChangeRequest, ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { taskActions } from '../../../../../state/ducks/tasks';
import { Button } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import { FBSection } from '../../../../form.builder';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { COMMENTS_FIELD, EmployeeStatus } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableTLItem, EmployeeResponse, TasksListItem, TLItemEditEvent } from './types';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  isAdditionalColumnsShown?: boolean
}

const FBTasksListTable: React.FunctionComponent<props> = ({ changeRequest, isShowOnly = false, isAdditionalColumnsShown }) => {
  const classes = useStyles();
  const [editedTLItem, setEditedTLItem] = React.useState<Partial<EditableTLItem>>();
  const isTasksListAdded = editedTLItem?.[MODE_FIELD] === Mode.add;
  const increasedBy = isTasksListAdded ? 2 : 1;
  const [data, setData] = React.useState<Array<Partial<EditableTLItem>>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const editTLItem = ({ dataItem }: TLItemEditEvent) => {
    !isShowOnly && setEditedTLItem(dataItem);
  };
  const discardTLItem = () => setEditedTLItem(undefined);
  const fetchTasksList = useActionCreator(taskActions.fetchTasksList);
  const addTask = useActionCreator(taskActions.addTask);
  const updateTask = useActionCreator(taskActions.updateTask);
  const deleteTask = useActionCreator(taskActions.deleteTask);

  const loadTasksTableData = () => {
    tasksAsync.start(fetchTasksList, changeRequest?.id, tasksAsync);
  };

  const tasksAsync = useAsync({
    onSuccess: (data) => {
      setData((data as EditableTLItem[]) ?? []);
    },
    onError: toastError,
  });
  const addTaskAsync = useAsync({
    onSuccess: (data) => {
      setData(prev => [...prev, data as EditableTLItem]);
    },
    onError: toastError,
  });

  const deleteTaskAsync = useAsync({
    onSuccess: loadTasksTableData,
    onError: toastError,
  });

  const updateTaskAsync = useAsync({
    onSuccess: loadTasksTableData,
    onError: toastError,
  });

  useEffect(() => {
    loadTasksTableData();
  }, []);

  const formik = useFormik<Partial<EditableTLItem>>({
    initialValues: {},
    onSubmit: (values) => {
      if (values[MODE_FIELD] === Mode.add) {
        const payload = {
          instruction: values?.instruction,
          employeeIds: values?.employeeResponse?.map(data => data.employeeId),
          partOfId: changeRequest?.id,
        };

        addTaskAsync.start(addTask, payload, addTaskAsync);
      } else {
        const payload = {
          instruction: values?.instruction,
          employeeIds: values?.employeeResponse?.map(data => data.employeeId),
          partOfId: changeRequest?.id,
          employeeUpdates: values?.employeeResponse?.map(data => ({
            employeeId: data.employeeId,
          })),
        };
        updateTaskAsync.start(updateTask, changeRequest?.id, values.taskId, payload, updateTaskAsync);
      }
      discardTLItem();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedTLItem ?? {} });
  }, [editedTLItem, setValues, resetForm]);

  const createDraftTLItem = () => setEditedTLItem({
    taskId: uuidv4(),
    number: '1',
    [MODE_FIELD]: Mode.add,
  });

  const deleteTaskItem = () => {
    if (!editedTLItem?.taskId) {
      return;
    }
    deleteTaskAsync.start(deleteTask, editedTLItem?.taskId, deleteTaskAsync);
  };

  const employeeStatusUpdates = (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => {
    const { values } = formik;
    const payload = {
      employeeUpdates: employeeResponse?.map(data => {
        if (data.employeeId !== employeeId) {
          return {
            employeeId: data.employeeId,
            status: data.status,
            attachments: data.attachments,
            comment: data.comment,
          };
        }
        return {
          employeeId: data.employeeId,
          status: employeeId === data.employeeId ? EmployeeStatus.Done : data.status,
          attachments: data.attachments,
          comment: values?.[taskId]?.[COMMENTS_FIELD]?.[employeeId] ?? data?.comment,
        };
      }),
    };
    updateTaskAsync.start(updateTask, changeRequest?.id, taskId, payload, updateTaskAsync);
  };

  const employeeEvidenceUpdates = (dataItem: TasksListItem, employeeId: string, attachments: Attachment[]) => {
    const { taskId, employeeResponse } = dataItem;
    const payload = {
      employeeUpdates: employeeResponse?.map(data => {
        if (data.employeeId !== employeeId) {
          return {
            employeeId: data.employeeId,
            status: data.status,
            attachments: data.attachments,
          };
        }
        return {
          employeeId: data.employeeId,
          status: data.status,
          attachments,
        };
      }),
    };
    updateTaskAsync.start(updateTask, changeRequest?.id, taskId, payload, updateTaskAsync);
  };

  const debounceEmployeeEvidenceUpdates = debounce(employeeEvidenceUpdates, 1000);

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editTLItem,
    onConfirm: submitForm,
    onDiscard: discardTLItem,
    onDelete: deleteTaskItem,
    employeeStatusUpdates: employeeStatusUpdates,
    employeeEvidenceUpdates: debounceEmployeeEvidenceUpdates,
    isDisabled: ChangeRequestStatus.Closed === changeRequest?.state,
    currentState: changeRequest?.state,
  });

  const getColumns = () => {
    return schema.filter(({ show }) => show || isAdditionalColumnsShown);
  };

  const rowRender: DataGridProps<TasksListItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as TasksListItem;
    const isUpdating = [Mode.edit, Mode.add].includes(item[MODE_FIELD]);

    if (isShowOnly) {
      return (
        <FormikProvider value={formik}>
          {row}
        </FormikProvider>
      );
    }

    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const MDItemList = data.reduce<Array<Partial<EditableTLItem>>>((list, item, index) => {
    const isMDItemEdited = editedTLItem && editedTLItem.taskId === item.taskId;
    const number = `${index + increasedBy}`;
    return [
      ...list,
      {
        ...(isMDItemEdited ? { ...editedTLItem, number } : { ...item, number }),
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isTasksListAdded ? [editedTLItem] : []);

  return (
    <Box ref={containerRef} className={classes.root} data-cy="tasks-list-table">
      <FBSection label={translate('approvalRequest.tasks.list.section.heading')}>
        <Button
          kind="ghost"
          size="small"
          className={classes.addButton}
          startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
          onClick={createDraftTLItem}
          data-cy="add-task-small-btn"
          disabled={isShowOnly}
        >
          {translate('approvalRequest.tasks.list.add')}
        </Button>
      </FBSection>
      <KendoDataGrid<EditableTLItem>
        data={MDItemList as EditableTLItem[]}
        schema={getColumns()}
        fullWidth
        className={classes.rootTasksList}
        hasBoxScrollbars
        onRowClick={editTLItem}
        loading={tasksAsync.isLoading || addTaskAsync.isLoading || deleteTaskAsync.isLoading || updateTaskAsync.isLoading}
        rowRender={rowRender}
        containerRef={containerRef}
      />
      {!isShowOnly && <Button
        kind="add"
        fullWidth
        attached
        onClick={createDraftTLItem}
        data-cy="add-task"
      >
        {translate('approvalRequest.tasks.list.add')}
      </Button>}
    </Box>);
};

export default FBTasksListTable;
